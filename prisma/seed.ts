import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.category.createMany({
        data: [
            {
                name: 'General Discussion',
                slug: 'general-discussion',
                updatedAt: new Date(),
                description: 'General discussion about the community',
            },
            {
                name: 'Development',
                slug: 'development',
                updatedAt: new Date(),
                description: 'Development related discussions',
            }
        ]
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })