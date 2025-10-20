const express = require('express');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleAuth');
const { authMiddleware } = require('../middlewares/auth');
const { encrypt } = require('../utils/crypto');
const prisma = require('../config/prisma');

const router = express.Router();

const USER_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// ✅ Get Google OAuth URL for user
router.get('/gmail-connect-url', authMiddleware, (req, res) => {
  try {
    // Create state token with user ID
    const state = jwt.sign(
      { sub: req.user.sub, type: 'user' },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '10m' }
    );

    // ✅ IMPORTANT: Use correct redirect URI
    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:5000/api/user/gmail-callback' // ✅ Correct URI
    );

    const authUrl = userOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: USER_SCOPES,
      state
    });

    console.log('✅ Generated auth URL for user:', req.user.username);
    res.json({ url: authUrl });
    
  } catch (err) {
    console.error('Generate auth URL error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ OAuth callback for user Gmail connection
router.get('/gmail-callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Check for OAuth errors
    if (error) {
      console.error('❌ OAuth error:', error);
      return res.redirect(`http://localhost:3000/settings?error=${error}`);
    }

    if (!code || !state) {
      return res.redirect('http://localhost:3000/settings?error=missing_code');
    }

    // Verify state token
    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      console.error('❌ Invalid state token:', err);
      return res.redirect('http://localhost:3000/settings?error=invalid_state');
    }

    if (decodedState.type !== 'user') {
      return res.redirect('http://localhost:3000/settings?error=invalid_token_type');
    }

    // Create OAuth client with correct redirect URI
    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:5000/api/user/gmail-callback'
    );

    // Exchange code for tokens
    const { tokens } = await userOAuth2Client.getToken(code);
    const { access_token, refresh_token } = tokens;

    if (!refresh_token) {
      console.error('❌ No refresh token received');
      return res.redirect('http://localhost:3000/settings?error=no_refresh_token');
    }

    // Get user info from Google
    userOAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: userOAuth2Client });
    const userInfo = await oauth2.userinfo.get();

    const googleEmail = userInfo.data.email;
    const googleId = userInfo.data.id;
    const userId = decodedState.sub;

    console.log('✅ Gmail connected:', googleEmail);

    // Encrypt refresh token
    const encryptedRefresh = encrypt(refresh_token);

    // Save or update Gmail connection
    await prisma.userGmail.upsert({
      where: { authUserId: userId },
      update: {
        googleEmail,
        googleId,
        encryptedRefresh,
        connectedAt: new Date(),
        lastUsedAt: new Date()
      },
      create: {
        authUserId: userId,
        googleEmail,
        googleId,
        encryptedRefresh,
        connectedAt: new Date(),
        lastUsedAt: new Date()
      }
    });

    res.redirect(`http://localhost:3000/settings?status=gmail_connected&email=${googleEmail}`);
    
  } catch (error) {
    console.error('❌ Gmail callback error:', error);
    res.redirect('http://localhost:3000/settings?error=connection_failed');
  }
});

// ✅ Check Gmail connection status
router.get('/gmail-status', authMiddleware, async (req, res) => {
  try {
    const gmailConnection = await prisma.userGmail.findUnique({
      where: { authUserId: req.user.sub }
    });

    if (!gmailConnection || !gmailConnection.encryptedRefresh) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      email: gmailConnection.googleEmail,
      connectedAt: gmailConnection.connectedAt,
      lastUsedAt: gmailConnection.lastUsedAt
    });
    
  } catch (err) {
    console.error('Check Gmail status error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Disconnect Gmail
router.post('/gmail-disconnect', authMiddleware, async (req, res) => {
  try {
    await prisma.userGmail.delete({
      where: { authUserId: req.user.sub }
    });

    console.log('✅ Gmail disconnected for user:', req.user.username);
    res.json({ message: 'Gmail disconnected successfully' });
    
  } catch (err) {
    console.error('Disconnect Gmail error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;