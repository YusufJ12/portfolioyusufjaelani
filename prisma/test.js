// Test prisma 5 connection
require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function test() {
    try {
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("Connection successful:", result);

        // Try to count admins
        const count = await prisma.admin.count();
        console.log("Admin count:", count);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
