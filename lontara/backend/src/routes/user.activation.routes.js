const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// ✅ Verify activation token
router.get('/verify-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await prisma.authUser.findFirst({
      where: {
        activationToken: token,
        activationTokenExpires: { gte: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        valid: false,
        message: 'Invalid or expired activation token' 
      });
    }

    res.json({ 
      valid: true,
      username: user.username,
      email: user.email,
      userId: user.id
    });
    
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Activate account & set password
router.post('/activate', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password required' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Find user with valid token
    const user = await prisma.authUser.findFirst({
      where: {
        activationToken: token,
        activationTokenExpires: { gte: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired activation token' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update user: set password, verify email, remove token
    const updatedUser = await prisma.authUser.update({
      where: { id: user.id },
      data: {
        passwordHash,
        isEmailVerified: true,
        activationToken: null,
        activationTokenExpires: null,
        mustChangePassword: false
      }
    });

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      { sub: updatedUser.id, username: updatedUser.username, role: updatedUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Account activated successfully',
      token: jwtToken,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
    
  } catch (err) {
    console.error('Activate account error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;