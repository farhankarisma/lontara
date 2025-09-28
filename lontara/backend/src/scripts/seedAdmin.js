require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

async function main() {
  const username = process.env.INIT_ADMIN_USERNAME || 'admin';
  const password = process.env.INIT_ADMIN_PASSWORD || 'admin123';
  const email = process.env.INIT_ADMIN_EMAIL || 'tu-admin@unpad.ac.id';

  const exists = await prisma.authUser.findUnique({ where: { username } });
  if (exists) {
    console.log('Admin already exists:', username);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const admin = await prisma.authUser.create({
    data: { username, passwordHash: hash, role: 'ADMIN', email }
  });

  console.log('Created admin:', { username: admin.username, role: admin.role });
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
