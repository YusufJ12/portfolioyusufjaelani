require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function testLogin() {
    try {
        const admin = await db.admin.findFirst();
        console.log("Admin found:", admin);

        const isMatch = await bcrypt.compare("admin123", admin.passwordHash);
        console.log("Password match:", isMatch);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await db.$disconnect();
    }
}

testLogin();
