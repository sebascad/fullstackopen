const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogRouter.get('/:id', async (request,response,next) => {
  try{
    const blog = await Blog.findById(request.params.id)

    if(!blog) return response.status(404).end()

    return response.json(blog)
  }catch (error){
    next(error)
  }
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  if(!blog.url || !blog.title) return response.status(400).end()

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async(request,response,next) => {
  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }catch (error){
    next(error)
  }
})

blogRouter.put('/:id', async(request,response,next) => {
  try{
    const body = request.body
    const newBlog = {
      title: body.title,
      url: body.url
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    if(!updatedBlog) return response.status(404).end()

    response.json(updatedBlog)
  }catch(error){
    next(error)
  }
})
module.exports = blogRouter