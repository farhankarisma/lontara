const express = require('express');
const prisma = require('../config/prisma');

const router = express.Router();

// Endpoint untuk tes koneksi database
router.get('/db-check', async (req, res) => {
  try {
    // Mencoba melakukan query sederhana ke database
    const userCount = await prisma.authUser.count();
    
    // Jika berhasil, kirim pesan sukses
    res.status(200).json({ 
      message: 'Connection to database successful.',
      totalUsers: userCount 
    });

  } catch (error) {
    // Jika gagal, kirim pesan error
    console.error("Database connection check failed:", error);
    res.status(500).json({ 
      message: 'Failed to connect to the database.',
      error: error.message 
    });
  }
});

module.exports = router;