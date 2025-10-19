const { google } = require('googleapis');
const { prisma } = require('./prisma');

async function getOAuthClientByUserId(userId) {
  const account = await prisma.adminGoogle.findUnique({
    where: { authUserId: userId },
  });

  if (!account || !account.encryptedRefresh) {
    throw new Error('Google account is not connected');
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: account.encryptedRefresh,
  });

  return oAuth2Client;
}

module.exports = { getOAuthClientByUserId }; 