// src/routes/answers.ts
import { Hono } from 'hono'
import prisma from '../prisma'
import { z } from 'zod'

const answers = new Hono()

// GET /answers
answers.get('/', async (c) => {
  const answers = await prisma.answer.findMany()
  return c.json(answers)
})

// GET /answers/:id
answers.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const answer = await prisma.answer.findUnique({
    where: { id },
  })
  if (!answer) {
    return c.notFound()
  }
  return c.json(answer)
})

// POST /answers
answers.post('/', async (c) => {
  const schema = z.object({
    answer: z.string().min(1),
    isCorrect: z.boolean(),
    questionId: z.number(),
  })
  const body = await c.req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error }, 400)
  }
  const answer = await prisma.answer.create({
    data: result.data,
  })
  return c.json(answer, 201)
})

// PATCH /answers/:id
answers.patch('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  const schema = z.object({
    answer: z.string().min(1),
    isCorrect: z.boolean(),
  })
  const body = await c.req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return c.json({ error: result.error }, 400)
  }
  const answer = await prisma.answer.update({
    where: { id },
    data: result.data,
  })
  return c.json(answer)
})

// DELETE /answers/:id
answers.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  await prisma.answer.delete({
    where: { id },
  })
  return c.newResponse(null, 204)
})

export default answers