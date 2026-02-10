
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("Creating/Updating Super Admin User...");

    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    const user = await prisma.user.upsert({
        where: { username: "superadmin" },
        update: {
            password: hashedPassword,
            role: "SUPER_ADMIN",
            name: "Global Super Admin"
        },
        create: {
            username: "superadmin",
            password: hashedPassword,
            name: "Global Super Admin",
            role: "SUPER_ADMIN",
            directorateRole: "PRESIDENT" // Optional default
        }
    });

    console.log("✅ Super Admin user created:", user);
}

main()
    .catch(e => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
