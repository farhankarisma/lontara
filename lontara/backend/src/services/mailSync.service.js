const { google } = require('googleapis');
const { prisma } = require('../config/prisma');
const { getOAuthClientByUserId } = require('../config/googleClient');
const { parseEmail } = require('../utils/mailParser');

exports.syncEmailsToDatabase = async (userId) => {
  const auth = await getOAuthClientByUserId(userId);
  const gmail = google.gmail({ version: 'v1', auth });

  const list = await gmail.users.messages.list({
    userId: 'me',
    labelIds: ['INBOX'],
    maxResults: 10,
  });

  const messages = list.data.messages || [];
  let saved = [];

  for (const msg of messages) {
    const fullMail = await gmail.users.messages.get({
      userId: 'me',
      id: msg.id,
      format: 'full',
    });

    const parsed = parseEmail(fullMail);

    const exists = await prisma.mail.findFirst({
      where: {
        subject: parsed.subject,
        sender: parsed.from,
        date: parsed.date
      },
    });
    if (!exists) {
      const mail = await prisma.mail.create({
        data: {
          subject: parsed.subject,
          sender: parsed.from,
          receiver: parsed.to,
          body: parsed.body,
          date: parsed.date,
        },
      });
      saved.push(mail);
    }
  }

  return saved;
};
