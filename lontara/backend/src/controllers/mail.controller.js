const mailSyncService = require('../services/mailSync.service');
const { prisma } = require('../config/prisma');

exports.syncFromEmail = async (req, res) => {
  try {
    const result = await mailSyncService.syncEmailsToDatabase(req.user.id);
    res.json({ message: 'Sync complete', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listMail = async (req, res) => {
  try {
    const mails = await prisma.mail.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(mails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
