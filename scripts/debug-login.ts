import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("Debugging Login for username: 'admin'...");

    const user = await prisma.user.findUnique({
        where: { username: 'admin' }
    });

    if (!user) {
        console.error("❌ User 'admin' NOT FOUND in the database.");
        return;
    }

    console.log("✅ User 'admin' found.");
    console.log("Stored Role:", user.role);
    console.log("Stored Director Role:", user.directorateRole);
    console.log("Stored Password Hash:", user.password);

    const isMatch = await bcrypt.compare('admin123', user.password);

    if (isMatch) {
        console.log("✅ Password 'admin123' matches the stored hash.");
    } else {
        console.error("❌ Password 'admin123' DOES NOT match the stored hash.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
