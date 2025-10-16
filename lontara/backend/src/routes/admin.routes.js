const express = require('express');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

const router = express.Router();

// contoh endpoint cek permission Gmail
router.get('/email-permission', authMiddleware, adminOnly, async (req, res) => {
  res.json({
    message: 'Email permission OK',
    user: req.user
  });
});

module.exports = router;

router.get("/connect-url", authMiddleware, (req, res) => {
  // Create a 'state' token. This is crucial for security and for knowing
  // which user is connecting their account when Google calls us back.
  const state = jwt.sign(
    { sub: req.user.sub }, // The ID of the currently logged-in user
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // A short expiry is good practice
  );

  // Generate the Google consent screen URL
  const url = getAuthUrl(state);
  res.json({ url });
});

// GET /api/user/oauth/callback
// This is the URL you configured in your Google Cloud Console as the Redirect URI
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).redirect('/login?error=invalid_callback');
    }

    // 1. Verify the 'state' token to see who initiated this
    let decodedState;
    try { 
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).redirect('/login?error=invalid_state');
    }

    const userId = decodedState.sub;

    // 2. Exchange the authorization 'code' for tokens
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      // This happens if the user has already granted consent before.
      // You might need to add 'prompt: consent' to getAuthUrl to force a new refresh token.
      // For now, we'll treat it as an error because we NEED the refresh token on the first go.
      return res.status(400).redirect('/dashboard?error=no_refresh_token');
    }

    // 3. Securely store the refresh token in the database
    await prisma.authUser.update({
      where: { id: userId },
      data: {
        googleRefreshToken: refreshToken, // Store the token
        isGoogleConnected: true,          // Flip the flag
      },
    });

    // 4. Redirect the user to their dashboard with a success message
    res.redirect('/dashboard?status=google_connected_successfully');

  } catch (error) {
    console.error("Error during OAuth callback:", error);
    res.redirect('/dashboard?error=oauth_failed');
  }
});

module.exports = router;