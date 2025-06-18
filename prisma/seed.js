const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10); // <-- penting

  await prisma.tb_user.create({
    data: {
      username: "admin",
      nama: "Administrator",
      password: hashedPassword, // <-- simpan hash
      role: "Admin",
    },
  });

  console.log("✅ Admin user created");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
