import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
    const sectors = [
        "Vazahayoor",
        "Ayikarappadi",
        "Cherukavu",
        "Pallikkal",
        "Pulikkal",
        "Kottappuram",
        "Olavattur"
    ];

    console.log("Seeding Sectors...");
    for (const name of sectors) {
        await prisma.sector.upsert({
            where: { name },
            update: {},
            create: { name }
        });
    }

    const hashedPassword = await bcrypt.hash("password123", 10);

    await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            password: hashedPassword,
            role: "SUPER_ADMIN"
        },
        create: {
            username: "admin",
            password: hashedPassword,
            name: "Division Secretary",
            role: "SUPER_ADMIN",
        }
    });

    console.log("Seeding Categories...");
    const categories = [
        { name: "Donation", type: "INCOME" },
        { name: "Rent", type: "EXPENSE" },
        { name: "Food", type: "EXPENSE" },
        { name: "TA", type: "EXPENSE" }
    ];

    for (const cat of categories) {
        const existing = await prisma.transactionCategory.findFirst({
            where: {
                name: cat.name,
                type: cat.type,
                sectorId: null
            }
        });

        if (!existing) {
            await prisma.transactionCategory.create({
                data: {
                    name: cat.name,
                    type: cat.type,
                    sectorId: null
                }
            });
            console.log(`Created category: ${cat.name}`);
        } else {
            console.log(`Category exists: ${cat.name}`);
        }
    }

    console.log("Seeding completed.");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
