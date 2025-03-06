// src/routes/questions.ts
import { Hono } from 'hono'
import { z } from 'zod'
import prisma from '../prisma'

const questions = new Hono()

// src/routes/questions.ts
questions.get('/', async (c) => {
  const categoryId = c.req.query('categoryId')
  try {
    const questions = await prisma.question.findMany({
      where: categoryId ? { categoryId: parseInt(categoryId) } : {},
      include: { answers: true },
    })
    return c.json(questions, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// GET /questions/:id
questions.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  try {
    const question = await prisma.question.findUnique({
      where: { id },
      include: { answers: true }, // Skila svörum með spurningunni
    })
    if (!question) {
      return c.json({ error: 'Question not found' }, 404)
    }
    return c.json(question, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

questions.post('/', async (c) => {
  const schema = z.object({
    question: z.string().min(1),
    categoryId: z.number(),
    answers: z.array(
      z.object({
        answer: z.string().min(1),
        isCorrect: z.boolean(),
      })
    ).length(4), // Kröfur fyrir 4 svör
  })
  try {
    const body = await c.req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid data. Exactly 4 answers are required.' }, 400)
    }
    const question = await prisma.question.create({
      data: {
        question: result.data.question,
        categoryId: result.data.categoryId,
        answers: {
          create: result.data.answers,
        },
      },
      include: { answers: true }, // Skila svörum með spurningunni
    })
    return c.json(question, 201)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// PATCH /questions/:id
questions.patch('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const schema = z.object({
    question: z.string().min(1).optional(),
    categoryId: z.number().optional(),
  })
  try {
    const body = await c.req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    const question = await prisma.question.update({
      where: { id },
      data: result.data,
    })
    return c.json(question, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// DELETE /questions/:id
questions.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  try {
    await prisma.question.delete({
      where: { id },
    })
    return c.newResponse(null, 204)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default questions