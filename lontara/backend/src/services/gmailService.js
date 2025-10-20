const { google } = require('googleapis');
const prisma = require('../config/prisma');
const { oauth2Client } = require('../config/googleAuth');
const { decrypt } = require('../utils/crypto');

// ✅ Get Gmail client for user
async function getUserGmailClient(authUserId) {
  const userGmail = await prisma.userGmail.findUnique({
    where: { authUserId }
  });

  if (!userGmail || !userGmail.encryptedRefresh) {
    throw new Error('Gmail not connected. Please connect your Gmail account first.');
  }

  const refreshToken = decrypt(userGmail.encryptedRefresh);
  if (!refreshToken) {
    throw new Error('Failed to decrypt Gmail credentials.');
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  
  // Update last used timestamp
  await prisma.userGmail.update({
    where: { id: userGmail.id },
    data: { lastUsedAt: new Date() }
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// ✅ Get user's Gmail messages
async function getUserEmails(authUserId, options = {}) {
  try {
    const gmail = await getUserGmailClient(authUserId);
    
    const { maxResults = 50, pageToken, query = '' } = options;
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      pageToken,
      q: query
    });

    const messages = response.data.messages || [];
    
    // Get detailed info for each message
    const detailedMessages = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });
        
        const headers = detail.data.payload.headers;
        const getHeader = (name) => headers.find(h => h.name === name)?.value || '';
        
        return {
          id: detail.data.id,
          threadId: detail.data.threadId,
          labelIds: detail.data.labelIds || [],
          snippet: detail.data.snippet,
          isRead: !detail.data.labelIds?.includes('UNREAD'),
          from: getHeader('From'),
          to: getHeader('To'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          body: getEmailBody(detail.data.payload)
        };
      })
    );

    return {
      messages: detailedMessages,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    };
    
  } catch (error) {
    console.error('Get user emails error:', error);
    throw error;
  }
}

// ✅ Helper: Extract email body
function getEmailBody(payload) {
  let body = '';
  
  if (payload.parts) {
    payload.parts.forEach(part => {
      if (part.mimeType === 'text/plain' && part.body.data) {
        body += Buffer.from(part.body.data, 'base64').toString('utf-8');
      }
    });
  } else if (payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }
  
  return body;
}

// ✅ Mark email as read
async function markAsRead(authUserId, messageId) {
  try {
    const gmail = await getUserGmailClient(authUserId);
    
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
    
    return { success: true, message: 'Marked as read' };
    
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
}

// ✅ Get unread count
async function getUnreadCount(authUserId) {
  try {
    const gmail = await getUserGmailClient(authUserId);
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
      maxResults: 1
    });
    
    return response.data.resultSizeEstimate || 0;
    
  } catch (error) {
    console.error('Get unread count error:', error);
    throw error;
  }
}

module.exports = {
  getUserGmailClient,
  getUserEmails,
  markAsRead,
  getUnreadCount
};