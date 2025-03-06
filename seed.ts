import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Bættu við flokkum
  await prisma.category.createMany({
    data: [
      { name: 'html' },
      { name: 'css' },
      { name: 'javascript' },
    ],
  })

  // Bættu við spurningum og svörum
  await prisma.question.create({
    data: {
      question: 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?',
      category: { connect: { name: 'html' } },
      answers: {
        create: [
          { answer: '<form method="get" action="about.html"><button>About</button></form>', isCorrect: false },
          { answer: '<a href="about.html">About</a>', isCorrect: true },
          { answer: 'Allar jafn góðar / All equally good', isCorrect: false },
          { answer: '<button to="about.html">About</button>', isCorrect: false },
        ],
      },
    },
  })

  // Bættu við fleiri spurningum og svörum hér...
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })