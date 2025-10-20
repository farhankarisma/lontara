const express = require("express");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const { oauth2Client, getAuthUrl } = require("../config/googleAuth");
const { authMiddleware } = require("../middlewares/auth"); // <-- HANYA authMiddleware
const prisma = require("../config/prisma");
const { encrypt } = require("../utils/crypto");

const router = express.Router();

// -----------------------------------------------------------------
// STEP 1: STAFF (BUKAN ADMIN) MEMINTA URL LOGIN
// -----------------------------------------------------------------
router.get("/connect-url", authMiddleware, async (req, res) => { // <-- Tidak ada adminOnly
  try {
    // 'req.user.sub' sekarang adalah ID Staff yang sedang login
    const state = jwt.sign(
      { sub: req.user.sub }, 
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    const url = getAuthUrl(state);
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------------------------
// STEP 2: GOOGLE MENGIRIM STAFF KEMBALI KE SINI
// -----------------------------------------------------------------
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.redirect('http://localhost:3000/settings?error=auth_failed');
    }

    // Validasi 'state' untuk tahu ID Staff mana
    let decodedState;
    try {
      decodedState = jwt.verify(state, process.env.JWT_SECRET);
    } catch (err) {
      return res.redirect('http://localhost:3000/settings?error=invalid_state');
    }

    const staffUserId = decodedState.sub; // Ini adalah ID Staff

    // Tukar 'code' dengan 'tokens'
    const { tokens } = await oauth2Client.getToken(code);
    const { refresh_token } = tokens;

    if (!refresh_token) {
      return res.redirect('http://localhost:3000/settings?error=no_refresh_token');
    }

    // Ambil email Google dari Staff
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const googleEmail = userInfo.data.email;
    const googleId = userInfo.data.id;

    // Enkripsi dan Simpan Refresh Token
    const encryptedToken = encrypt(refresh_token);

    // Simpan ke tabel 'AdminGoogle' (walaupun namanya admin, kita isi data Staff)
    await prisma.adminGoogle.upsert({
      where: { authUserId: staffUserId }, // Cari berdasarkan ID Staff
      update: { // Jika sudah ada, update tokennya
        encryptedRefresh: encryptedToken,
        googleEmail: googleEmail,
        googleId: googleId,
        connectedAt: new Date(),
      },
      create: { // Jika belum ada, buat data baru
        authUserId: staffUserId,
        encryptedRefresh: encryptedToken,
        googleEmail: googleEmail,
        googleId: googleId,
        connectedAt: new Date(),
      }
    });

    console.log(`Akun Staff ${googleEmail} berhasil terhubung ke Google.`);
    res.redirect(`http://localhost:3000/settings?success=true`);

  } catch (error) {
    console.error("Google Callback Error:", error.message);
    res.redirect('http://localhost:3000/settings?error=callback_failed');
  }
});

module.exports = router;