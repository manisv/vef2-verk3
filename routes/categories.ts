// src/routes/categories.ts
import { Hono } from 'hono'
import { z } from 'zod'
import prisma from '../prisma'

const categories = new Hono()

categories.get('/', async (c) => {
  try {
    const categories = await prisma.category.findMany()
    return c.json(categories, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// GET /categories/:slug
categories.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    })
    if (!category) {
      return c.json({ error: 'Category not found' }, 404)
    }
    return c.json(category, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// POST /categories
categories.post('/', async (c) => {
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
  })
  try {
    const body = await c.req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    const category = await prisma.category.create({
      data: result.data,
    })
    return c.json(category, 201)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// PATCH /categories/:slug
categories.patch('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const schema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
  })
  try {
    const body = await c.req.json()
    const result = schema.safeParse(body)
    if (!result.success) {
      return c.json({ error: 'Invalid data' }, 400)
    }
    const category = await prisma.category.update({
      where: { slug },
      data: result.data,
    })
    return c.json(category, 200)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

// DELETE /categories/:slug
categories.delete('/:slug', async (c) => {
  const slug = c.req.param('slug')
  try {
    await prisma.category.delete({
      where: { slug },
    })
    return c.newResponse(null, 204)
  } catch (error) {
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default categories