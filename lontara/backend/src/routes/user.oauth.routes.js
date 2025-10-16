const express = require("express");
const jwt = require("jsonwebtoken");
const { oauth2Client, getAuthUrl } = require("../config/googleAuth");
const { authMiddleware } = require("../middlewares/auth");
const prisma = require("../config/prisma");

const router = express.Router();

/**
 * @route   GET /api/user/oauth/connect-url
 * @desc    Generate a Google consent screen URL for the logged-in user
 * @access  Private
 */
router.get("/connect-url", authMiddleware, (req, res) => {
  // Create a 'state' token to prevent CSRF attacks and to identify
  // the user when Google calls us back.
  const state = jwt.sign(
    { sub: req.user.sub }, // Payload contains the logged-in user's ID
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Get the authorization URL from our helper
  const url = getAuthUrl(state);
  res.json({ url });
});

/**
 * @route   GET /api/user/oauth/callback
 * @desc    Handles the redirect from Google after user consent
 * @access  Public
 */
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    // 1. Ensure we received a code and state from Google
    if (!code || !state) {
      return res.status(400).redirect('/login?error=invalid_callback');
    }

    // 2. Verify the 'state' parameter to ensure it was initiated by us
    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Invalid state token:", err);
      return res.status(401).redirect('/login?error=invalid_state');
    }

    const userId = decodedState.sub;

    // 3. Exchange the authorization 'code' for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    // 4. We MUST get a refresh token on the first authorization
    if (!refreshToken) {
      console.error("No refresh token received from Google for user:", userId);
      return res.status(400).redirect('/dashboard?error=no_refresh_token');
    }

    // 5. Create a new UserGoogleAuth record in the database
    // This securely links the refresh token to the user
    await prisma.userGoogleAuth.create({
      data: {
        authUserId: userId,
        // TODO: Encrypt this token before saving to the database!
        encryptedRefresh: refreshToken,
        connectedAt: new Date(),
      },
    });

    // 6. Redirect the user back to your frontend application
    // A query parameter indicates a successful connection
    res.redirect('/dashboard?status=google_connected_successfully');

  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.redirect('/dashboard?error=oauth_failed');
  }
});

module.exports = router;