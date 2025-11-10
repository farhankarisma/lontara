const express = require("express");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis"); // ✅ ADD THIS
const { oauth2Client, getAuthUrl } = require("../config/googleAuth");
const { authMiddleware, adminOnly } = require("../middlewares/auth");
const { encrypt } = require("../utils/crypto"); // ✅ ADD THIS
const prisma = require("../config/prisma"); // ✅ ADD THIS

const router = express.Router();

// Step 1: Admin minta URL login ke Google
router.get("/connect-url", authMiddleware, adminOnly, (req, res) => {
  // bikin state token supaya kita tau refresh token ini buat siapa
  const state = jwt.sign(
    { sub: req.user.sub }, // id user/admin yang lagi login
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  const url = getAuthUrl(state); // panggil helper dari config
  res.json({ url });
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res
        .status(400)
        .redirect("http://localhost:3000/error?msg=missing_code_or_state");
    } // 1. Validasi State JWT

    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(401)
        .redirect("http://localhost:3000/error?msg=invalid_state");
    } // 2. Tukar 'code' dengan 'tokens'

    const { tokens } = await oauth2Client.getToken(code);
    const { access_token, refresh_token } = tokens;

    if (!refresh_token) {
      // Ini terjadi jika user sudah pernah otorisasi.
      // Kita bisa update access_token saja, tapi untuk admin setup,
      // refresh_token itu wajib di awal.
      console.warn(
        "Refresh token tidak didapat. Mungkin sudah pernah terhubung."
      );
    }

    // 3. Set kredensial untuk dapat info email admin
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const adminEmail = userInfo.data.email;
    const adminId = decodedState.sub; // ID admin dari database Anda // 4. Enkripsi dan Simpan Refresh Token

    if (refresh_token) {
      const encryptedToken = encrypt(refresh_token);
      await prisma.authUser.update({
        where: { id: adminId },
        data: {
          googleRefreshToken: encryptedToken,
          email: adminEmail, // Update email admin dengan email Google-nya
        },
      });
    } // 5. Redirect kembali ke Frontend // Arahkan ke halaman setting di frontend dengan pesan sukses

    res.redirect(
      `http://localhost:3000/admin/settings?status=google_connected&email=${adminEmail}`
    );
  } catch (error) {
    console.error("Google Callback Error:", error.message);
    res.redirect("http://localhost:3000/error?msg=google_callback_failed");
  }
});

module.exports = router;
