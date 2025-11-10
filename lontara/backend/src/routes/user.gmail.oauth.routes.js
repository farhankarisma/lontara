const express = require("express");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { authMiddleware } = require("../middlewares/auth");
const { encrypt, decrypt } = require("../utils/crypto");
const prisma = require("../config/prisma");

const router = express.Router();

// ✅ UPDATED: Add gmail.compose scope
const USER_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose", // ✅ MUST HAVE
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

// ✅ NEW: Check if token has required scopes
router.get("/gmail-check-scopes", authMiddleware, async (req, res) => {
  try {
    const gmailConnection = await prisma.userGmail.findUnique({
      where: { authUserId: req.user.sub },
    });

    if (!gmailConnection || !gmailConnection.encryptedRefresh) {
      return res.json({
        connected: false,
        needsReconnect: true,
        message: "Gmail not connected",
      });
    }

    const refreshToken = decrypt(gmailConnection.encryptedRefresh);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:5000/api/user/gmail-callback"
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    try {
      const { token } = await oauth2Client.getAccessToken();
      const tokenInfo = await oauth2Client.getTokenInfo(token);

      const hasAllScopes = USER_SCOPES.every((scope) =>
        tokenInfo.scopes?.includes(scope)
      );

      const missingScopes = USER_SCOPES.filter(
        (scope) => !tokenInfo.scopes?.includes(scope)
      );

      return res.json({
        connected: true,
        hasAllScopes: hasAllScopes,
        needsReconnect: !hasAllScopes,
        currentScopes: tokenInfo.scopes,
        missingScopes: missingScopes,
        email: gmailConnection.googleEmail,
      });
    } catch (tokenError) {
      // Token expired
      return res.json({
        connected: false,
        needsReconnect: true,
        message: "Token expired",
      });
    }
  } catch (error) {
    console.error("❌ Check scopes error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// ✅ Check Gmail token health (for User)
router.get("/gmail-health", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;

    const gmailConnection = await prisma.userGmail.findUnique({
      where: { authUserId: userId },
    });

    if (!gmailConnection || !gmailConnection.encryptedRefresh) {
      return res.json({
        status: "not_connected",
        message: "Gmail not connected",
        action: "connect",
      });
    }

    const refreshToken = decrypt(gmailConnection.encryptedRefresh);

    const testOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:5000/api/user/gmail-callback"
    );

    testOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    try {
      const { token } = await testOAuth2Client.getAccessToken();
      const tokenInfo = await testOAuth2Client.getTokenInfo(token);

      // ✅ Check if has all required scopes
      const hasAllScopes = USER_SCOPES.every((scope) =>
        tokenInfo.scopes?.includes(scope)
      );

      return res.json({
        status: hasAllScopes ? "connected" : "needs_update",
        email: gmailConnection.googleEmail,
        connectedAt: gmailConnection.connectedAt,
        action: hasAllScopes ? null : "reconnect",
        hasAllScopes: hasAllScopes,
      });
    } catch (tokenError) {
      if (tokenError.message && tokenError.message.includes("invalid_grant")) {
        console.log(`⚠️ Token expired for user: ${userId}`);

        return res.json({
          status: "expired",
          message: "Gmail token has expired",
          email: gmailConnection.googleEmail,
          action: "reconnect",
        });
      }

      throw tokenError;
    }
  } catch (error) {
    console.error("Gmail health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to check Gmail status",
    });
  }
});

// ✅ Get OAuth URL for User (force new scopes)
router.get("/gmail-connect-url", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;

    const state = jwt.sign(
      { sub: userId, type: "user" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "10m" }
    );

    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:5000/api/user/gmail-callback"
    );

    const authUrl = userOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: USER_SCOPES,
      state: state,
      prompt: "consent", // ✅ FORCE re-consent to update scopes
    });

    console.log("✅ Generated auth URL with scopes:", USER_SCOPES);

    res.json({ url: authUrl });
  } catch (error) {
    console.error("❌ Generate auth URL error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ OAuth Callback for User
router.get("/gmail-callback", async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error("❌ OAuth error:", error);
      return res.redirect(`http://localhost:3000/settings?error=${error}`);
    }

    if (!code || !state) {
      return res.redirect("http://localhost:3000/settings?error=missing_code");
    }

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET || "secret");
    } catch (err) {
      console.error("❌ Invalid state token:", err);
      return res.redirect("http://localhost:3000/settings?error=invalid_state");
    }

    if (decodedState.type !== "user") {
      return res.redirect(
        "http://localhost:3000/settings?error=invalid_token_type"
      );
    }

    const userOAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "http://localhost:5000/api/user/gmail-callback"
    );

    const { tokens } = await userOAuth2Client.getToken(code);
    const { access_token, refresh_token } = tokens;

    if (!refresh_token) {
      console.error("❌ No refresh token received");
      return res.redirect(
        "http://localhost:3000/settings?error=no_refresh_token"
      );
    }

    userOAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: userOAuth2Client });
    const userInfo = await oauth2.userinfo.get();

    const googleEmail = userInfo.data.email;
    const googleId = userInfo.data.id;
    const userId = decodedState.sub;

    console.log("✅ Gmail connected:", googleEmail);

    // ✅ Verify scopes
    const tokenInfo = await userOAuth2Client.getTokenInfo(access_token);
    console.log("✅ Token scopes:", tokenInfo.scopes);

    const encryptedRefresh = encrypt(refresh_token);

    await prisma.userGmail.upsert({
      where: { authUserId: userId },
      update: {
        googleEmail,
        googleId,
        encryptedRefresh,
        connectedAt: new Date(),
        lastUsedAt: new Date(),
      },
      create: {
        authUserId: userId,
        googleEmail,
        googleId,
        encryptedRefresh,
        connectedAt: new Date(),
        lastUsedAt: new Date(),
      },
    });

    res.redirect(`http://localhost:3000/main-dashboard?gmail_connected=true`);
  } catch (error) {
    console.error("❌ Gmail callback error:", error);
    res.redirect("http://localhost:3000/settings?error=connection_failed");
  }
});

// ✅ Check Gmail connection status
router.get("/gmail-status", authMiddleware, async (req, res) => {
  try {
    const gmailConnection = await prisma.userGmail.findUnique({
      where: { authUserId: req.user.sub },
    });

    if (!gmailConnection || !gmailConnection.encryptedRefresh) {
      return res.json({
        connected: false,
        email: null,
      });
    }

    res.json({
      connected: true,
      email: gmailConnection.googleEmail,
      connectedAt: gmailConnection.connectedAt,
      lastUsedAt: gmailConnection.lastUsedAt,
    });
  } catch (err) {
    console.error("Check Gmail status error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Disconnect Gmail
router.post("/gmail-disconnect", authMiddleware, async (req, res) => {
  try {
    await prisma.userGmail.update({
      where: { authUserId: req.user.sub },
      data: {
        encryptedRefresh: null,
      },
    });

    console.log("✅ Gmail disconnected for user:", req.user.username);
    res.json({ message: "Gmail disconnected successfully" });
  } catch (err) {
    console.error("Disconnect Gmail error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
