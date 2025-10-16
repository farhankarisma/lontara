const express = require("express");
const { google } = require("googleapis");
const { oauth2Client } = require("../config/googleAuth");
const { authMiddleware } = require("../middlewares/auth");
const prisma = require("../config/prisma");

const router = express.Router();

/**
 * @route   GET /api/gmail/emails
 * @desc    Fetch the 10 latest emails for the logged-in user
 * @access  Private
 */
router.get("/emails", authMiddleware, async (req, res) => {
  try {
    // 1. Find the Google credentials linked to the currently logged-in user
    const googleAuth = await prisma.userGoogleAuth.findUnique({
      where: {
        authUserId: req.user.sub, // 'req.user.sub' comes from your authMiddleware
      },
    });

    // 2. If no record is found or it doesn't contain a token, deny access
    if (!googleAuth || !googleAuth.encryptedRefresh) {
      return res.status(403).json({ 
        message: "Google account not connected. Please connect your account first." 
      });
    }

    // 3. Set the refresh token on our global oauth2Client instance
    // TODO: Decrypt the token here before using it!
    const refreshToken = googleAuth.encryptedRefresh;
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // 4. Create an authenticated Gmail API client
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 5. Use the client to call the Gmail API
    const response = await gmail.users.messages.list({
      userId: "me", // 'me' always refers to the authenticated user
      maxResults: 10,
      q: 'is:inbox' // Example query: only from inbox
    });

    res.json({
      message: "Successfully fetched emails.",
      data: response.data,
    });

  } catch (error) {
    console.error("Error fetching emails from Gmail API:", error);
    res.status(500).json({ message: "Failed to fetch emails." });
  }
});

module.exports = router;