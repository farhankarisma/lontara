const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Insert user dummy
  const newUser = await prisma.user.create({
    data: {
      email: "dummy@example.com",
      googleId: "1234567890",
      name: "Dummy User",
      role: "TU"
    }
  });
  console.log("Inserted user:", newUser);

  // Ambil semua user
  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
