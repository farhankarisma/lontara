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
