const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/auth'); // <- ambil fungsinya
const mailController = require('../controllers/mail.controller');

// Sinkronisasi email Gmail -> simpan ke DB sebagai surat masuk
router.get('/sync', authMiddleware, mailController.syncFromEmail);

// List surat hasil sinkronisasi
router.get('/', authMiddleware, mailController.listMail);

module.exports = router;
