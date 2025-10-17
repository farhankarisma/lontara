const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { authMiddleware } = require("../middlewares/auth");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  const user = await prisma.authUser.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "8h" }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // req.user di-set di middlewares/auth.js -> berisi { sub, username, role, iat, exp }
    const user = await prisma.authUser.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
