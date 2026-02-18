const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogRouter.get('/:id', async (request,response,next) => {
  try{
    const blog = await Blog.
      findById(request.params.id).populate('users')

    if(!blog) return response.status(404).end()

    return response.json(blog)
  }catch (error){
    next(error)
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  if(!body.url || !body.title) return response.status(400).end()

  const user = await User.findOne({})
  if(!user) return response.status(404).json('No user found')

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    users: user.id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

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