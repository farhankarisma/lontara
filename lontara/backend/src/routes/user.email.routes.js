const express = require('express');
const { google } = require('googleapis');
const { authMiddleware } = require('../middlewares/auth');
const { decrypt } = require('../utils/crypto');
const prisma = require('../config/prisma');

const router = express.Router();

// Helper function to get authenticated Gmail client
async function getGmailClient(userId) {
  const gmailConnection = await prisma.userGmail.findUnique({
    where: { authUserId: userId }
  });

  if (!gmailConnection || !gmailConnection.encryptedRefresh) {
    throw new Error('Gmail not connected');
  }

  const refreshToken = decrypt(gmailConnection.encryptedRefresh);

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_USER_REDIRECT_URI || 'http://localhost:5000/api/user/gmail-callback'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  await prisma.userGmail.update({
    where: { authUserId: userId },
    data: { lastUsedAt: new Date() }
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

// Helper function to parse email message
function parseMessage(message) {
  const headers = message.payload.headers;
  const getHeader = (name) => {
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  let body = '';
  if (message.payload.body.data) {
    body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
  } else if (message.payload.parts) {
    const textPart = message.payload.parts.find(part => part.mimeType === 'text/plain');
    const htmlPart = message.payload.parts.find(part => part.mimeType === 'text/html');
    
    if (htmlPart && htmlPart.body.data) {
      body = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
    } else if (textPart && textPart.body.data) {
      body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
    }
  }

  return {
    id: message.id,
    threadId: message.threadId,
    labelIds: message.labelIds || [],
    snippet: message.snippet || '',
    isRead: !message.labelIds?.includes('UNREAD'),
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    date: getHeader('Date'),
    body: body
  };
}

// ✅ Get inbox emails
router.get('/inbox', authMiddleware, async (req, res) => {
  try {
    const { maxResults = 10, pageToken } = req.query;
    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Fetching inbox emails for user:', req.user.username);

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        return parseMessage(detail.data);
      })
    );

    console.log('✅ Found', messageDetails.length, 'inbox messages');

    res.json({
      messages: messageDetails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    });

  } catch (err) {
    console.error('❌ Fetch inbox error:', err);
    res.status(500).json({ message: 'Failed to fetch emails', error: err.message });
  }
});

// ✅ Get sent emails
router.get('/sent', authMiddleware, async (req, res) => {
  try {
    const { maxResults = 10, pageToken } = req.query;
    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Fetching sent emails for user:', req.user.username);

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['SENT'],
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        return parseMessage(detail.data);
      })
    );

    console.log('✅ Found', messageDetails.length, 'sent messages');

    res.json({
      messages: messageDetails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    });

  } catch (err) {
    console.error('❌ Fetch sent emails error:', err);
    res.status(500).json({ message: 'Failed to fetch sent emails', error: err.message });
  }
});

// ✅ Get trash emails
router.get('/trash', authMiddleware, async (req, res) => {
  try {
    const { maxResults = 10, pageToken } = req.query;
    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Fetching trash emails for user:', req.user.username);

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['TRASH'],
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        return parseMessage(detail.data);
      })
    );

    console.log('✅ Found', messageDetails.length, 'trash messages');

    res.json({
      messages: messageDetails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    });

  } catch (err) {
    console.error('❌ Fetch trash emails error:', err);
    res.status(500).json({ message: 'Failed to fetch trash emails', error: err.message });
  }
});

// ✅ Get draft emails
router.get('/drafts', authMiddleware, async (req, res) => {
  try {
    const { maxResults = 10, pageToken } = req.query;
    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Fetching draft emails for user:', req.user.username);

    const response = await gmail.users.drafts.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined
    });

    const drafts = response.data.drafts || [];
    const draftDetails = await Promise.all(
      drafts.map(async (draft) => {
        const detail = await gmail.users.drafts.get({
          userId: 'me',
          id: draft.id
        });
        return {
          id: detail.data.id,
          message: parseMessage(detail.data.message)
        };
      })
    );

    console.log('✅ Found', draftDetails.length, 'drafts');

    res.json({
      drafts: draftDetails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    });

  } catch (err) {
    console.error('❌ Fetch drafts error:', err);
    res.status(500).json({ message: 'Failed to fetch drafts', error: err.message });
  }
});

// ✅ Get unread count
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const gmail = await getGmailClient(req.user.sub);

    const response = await gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX', 'UNREAD'],
      maxResults: 1
    });

    console.log('✅ Unread count:', response.data.resultSizeEstimate || 0);

    res.json({
      count: response.data.resultSizeEstimate || 0
    });

  } catch (err) {
    console.error('❌ Get unread count error:', err);
    res.status(500).json({ message: 'Failed to get unread count', error: err.message });
  }
});

// ✅ Get specific email by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Fetching email:', id);

    const message = await gmail.users.messages.get({
      userId: 'me',
      id: id
    });

    res.json(parseMessage(message.data));

  } catch (err) {
    console.error('❌ Fetch email error:', err);
    res.status(500).json({ message: 'Failed to fetch email', error: err.message });
  }
});

// ✅ Mark email as read
router.post('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const gmail = await getGmailClient(req.user.sub);

    await gmail.users.messages.modify({
      userId: 'me',
      id: id,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });

    console.log('✅ Email marked as read:', id);

    res.json({ success: true, message: 'Marked as read' });

  } catch (err) {
    console.error('❌ Mark as read error:', err);
    res.status(500).json({ message: 'Failed to mark as read', error: err.message });
  }
});

// ✅ Mark email as unread
router.post('/:id/unread', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const gmail = await getGmailClient(req.user.sub);

    await gmail.users.messages.modify({
      userId: 'me',
      id: id,
      requestBody: {
        addLabelIds: ['UNREAD']
      }
    });

    console.log('✅ Email marked as unread:', id);

    res.json({ success: true, message: 'Marked as unread' });

  } catch (err) {
    console.error('❌ Mark as unread error:', err);
    res.status(500).json({ message: 'Failed to mark as unread', error: err.message });
  }
});

// ✅ Delete email (move to trash)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const gmail = await getGmailClient(req.user.sub);

    await gmail.users.messages.trash({
      userId: 'me',
      id: id
    });

    console.log('✅ Email moved to trash:', id);

    res.json({ success: true, message: 'Email moved to trash' });

  } catch (err) {
    console.error('❌ Delete email error:', err);
    res.status(500).json({ message: 'Failed to delete email', error: err.message });
  }
});

// ✅ Permanently delete email
router.delete('/:id/permanent', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const gmail = await getGmailClient(req.user.sub);

    await gmail.users.messages.delete({
      userId: 'me',
      id: id
    });

    console.log('✅ Email permanently deleted:', id);

    res.json({ success: true, message: 'Email permanently deleted' });

  } catch (err) {
    console.error('❌ Permanent delete error:', err);
    res.status(500).json({ message: 'Failed to permanently delete email', error: err.message });
  }
});

// ✅ Search emails
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { q, maxResults = 10, pageToken } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query (q) is required' });
    }

    const gmail = await getGmailClient(req.user.sub);

    console.log('✅ Searching emails with query:', q);

    const response = await gmail.users.messages.list({
      userId: 'me',
      q: q,
      maxResults: parseInt(maxResults),
      pageToken: pageToken || undefined
    });

    const messages = response.data.messages || [];
    const messageDetails = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id
        });
        return parseMessage(detail.data);
      })
    );

    console.log('✅ Found', messageDetails.length, 'messages matching query');

    res.json({
      messages: messageDetails,
      nextPageToken: response.data.nextPageToken,
      resultSizeEstimate: response.data.resultSizeEstimate
    });

  } catch (err) {
    console.error('❌ Search emails error:', err);
    res.status(500).json({ message: 'Failed to search emails', error: err.message });
  }
});

module.exports = router;