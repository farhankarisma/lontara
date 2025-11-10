const express = require("express");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { oauth2Client, getAuthUrl } = require("../config/googleAuth");
const { authMiddleware } = require("../middlewares/auth");
const prisma = require("../config/prisma");
const { encrypt, decrypt } = require("../utils/crypto");

const router = express.Router();

// ✅ Check Gmail token health (for Staff)
router.get("/gmail-health", authMiddleware, async (req, res) => {
  try {
    const staffUserId = req.user.sub;

    const gmailConnection = await prisma.adminGoogle.findUnique({
      where: { authUserId: staffUserId },
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
      process.env.GOOGLE_REDIRECT_URI
    );

    testOAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    try {
      await testOAuth2Client.getAccessToken();

      return res.json({
        status: "connected",
        email: gmailConnection.googleEmail,
        connectedAt: gmailConnection.connectedAt,
        action: null,
      });
    } catch (tokenError) {
      if (tokenError.message && tokenError.message.includes("invalid_grant")) {
        console.log(`⚠️ Token expired for staff: ${staffUserId}`);

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

// ✅ Get OAuth URL for Staff
router.get("/connect-url", authMiddleware, async (req, res) => {
  try {
    const state = jwt.sign(
      { sub: req.user.sub, type: "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const url = getAuthUrl(state);
    res.json({ url });
  } catch (error) {
    console.error("Get connect URL error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ OAuth Callback for Staff
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect("http://localhost:3000/settings?error=auth_failed");
    }

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return res.redirect("http://localhost:3000/settings?error=invalid_state");
    }

    const staffUserId = decodedState.sub;

    const { tokens } = await oauth2Client.getToken(code);
    const { refresh_token } = tokens;

    if (!refresh_token) {
      return res.redirect(
        "http://localhost:3000/settings?error=no_refresh_token"
      );
    }

    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;
    const googleId = userInfo.data.id;

    const encryptedToken = encrypt(refresh_token);

    await prisma.adminGoogle.upsert({
      where: { authUserId: staffUserId },
      update: {
        encryptedRefresh: encryptedToken,
        googleEmail: googleEmail,
        googleId: googleId,
        connectedAt: new Date(),
      },
      create: {
        authUserId: staffUserId,
        encryptedRefresh: encryptedToken,
        googleEmail: googleEmail,
        googleId: googleId,
        connectedAt: new Date(),
      },
    });

    console.log(`✅ Staff ${googleEmail} berhasil terhubung ke Google.`);

    // Redirect to dashboard
    res.redirect(`http://localhost:3000/dashboard?gmail_connected=true`);
  } catch (error) {
    console.error("❌ Google Callback Error:", error.message);
    res.redirect("http://localhost:3000/settings?error=callback_failed");
  }
});

// ✅ Disconnect Gmail for Staff
router.post("/disconnect", authMiddleware, async (req, res) => {
  try {
    const staffUserId = req.user.sub;

    await prisma.adminGoogle.update({
      where: { authUserId: staffUserId },
      data: {
        encryptedRefresh: null,
        googleEmail: null,
        googleId: null,
      },
    });

    console.log(`✅ Staff ${staffUserId} disconnected Gmail`);
    res.json({ message: "Gmail disconnected successfully" });
  } catch (error) {
    console.error("Disconnect error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
