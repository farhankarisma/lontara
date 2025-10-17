const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const { authMiddleware, adminOnly } = require("../middlewares/auth");
const sendMail = require("../config/mailer");

const router = express.Router();

// contoh endpoint cek permission Gmail
router.get("/email-permission", authMiddleware, adminOnly, async (req, res) => {
  res.json({
    message: "Email permission OK",
    user: req.user,
  });
});

// ✅ endpoint baru: create user
router.post("/create-user", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { username, email, role } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: "Username & email required" });
    }

    // cek kalau username/email sudah ada
    const existing = await prisma.authUser.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // generate password sementara
    const tempPassword = crypto.randomBytes(6).toString("base64").slice(0, 10);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // simpan user baru
    const user = await prisma.authUser.create({
      data: {
        username,
        email,
        passwordHash,
        role: role || "STAFF",
        mustChangePassword: true,
      },
    });

    // kirim email
    const loginUrl = "http://localhost:5000/login"; // nanti diganti frontend URL
    await sendMail({
      to: email,
      subject: "Akun Lontara Mail Anda",
      html: `
        <h3>Halo ${username},</h3>
        <p>Akun Anda di <b>Lontara Mail</b> sudah dibuat.</p>
        <p><b>Username:</b> ${username}</p>
        <p><b>Password sementara:</b> ${tempPassword}</p>
        <p>Silakan login di: <a href="${loginUrl}">${loginUrl}</a></p>
        <p><i>Demi keamanan, segera ganti password setelah login pertama.</i></p>
      `,
    });

    res.json({ message: "User created & email sent", userId: user.id });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
