  const express = require("express");
  const jwt = require("jsonwebtoken");
  const { oauth2Client, getAuthUrl } = require("../config/googleAuth");
  const { authMiddleware, adminOnly } = require("../middlewares/auth");

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

  module.exports = router;
