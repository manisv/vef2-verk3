// src/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'HTML', slug: 'html' },
    { name: 'CSS', slug: 'css' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {}, // Ekki þarf að uppfæra neitt
      create: category,
    })
  }
  console.log('Flokkar búnir til eða uppfærðir.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })