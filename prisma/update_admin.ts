import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "yusufjaelani@gmail.com";
  const password = "Portfolio_12";
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`Updating admin account for ${email}...`);

  // Delete old default admin if exists
  await prisma.admin.deleteMany({
    where: {
      email: "admin@yusufjaelani.com",
    },
  }).catch(() => {});

  // Upsert target admin
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
    },
  });

  console.log("✅ Admin account successfully updated!");
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to update admin:", e.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

