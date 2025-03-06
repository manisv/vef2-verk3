// src/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Búa til flokka
  await prisma.category.createMany({
    data: [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'HTML', slug: 'html' },
      { name: 'CSS', slug: 'css' },
    ],
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