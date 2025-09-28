const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.user.create({
    data: {
      email: "mongo@example.com",
      googleId: "987654321",
      name: "Mongo User",
      role: "TU"
    }
  });
  console.log("Inserted user:", newUser);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
