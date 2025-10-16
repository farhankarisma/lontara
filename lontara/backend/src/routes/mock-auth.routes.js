const express = require('express');
const router = express.Router();

// Simple test login endpoint (mock) - temporary untuk testing frontend
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('Login attempt:', { username, password });

    // Mock validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username dan password harus diisi'
      });
    }

    // Mock users untuk testing sementara
    const mockUsers = {
      'admin': { password: 'admin123', role: 'ADMIN', name: 'Administrator', email: 'admin@unpad.ac.id' },
      'user1': { password: 'user123', role: 'USER', name: 'Test User', email: 'user1@unpad.ac.id' },
      'testuser': { password: 'password123', role: 'USER', name: 'Test User 2', email: 'testuser@unpad.ac.id' }
    };

    const user = mockUsers[username];

    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Username atau password salah'
      });
    }

    // Generate simple mock token
    const mockToken = Buffer.from(JSON.stringify({
      id: `mock_${username}`,
      username,
      role: user.role,
      timestamp: Date.now()
    })).toString('base64');

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: `mock_${username}`,
          username,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: mockToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login gagal: ' + error.message
    });
  }
});

module.exports = router;