const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogRouter.get('/:id', async (request,response) => {
  const blog = await Blog.findById(request.params.id)
  return response.json(blog)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.url || !blog.title) return response.status(400).end()

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request,response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogRouter