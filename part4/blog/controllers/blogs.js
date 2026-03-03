const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('users', { username:1, name:1, id:1 })

  return response.json(blogs)
})

blogRouter.get('/:id', async (request,response,next) => {
  try{
    const blog = await Blog.
      findById(request.params.id)
    if(!blog) return response.status(404).end()

    return response.json(blog)
  }catch (error){
    next(error)
  }
})

blogRouter.post('/',async (request, response, next) => {
  try {
    const body = request.body
    if(!body.url || !body.title) return response.status(400).end()

    const user = request.user
    if(!user) return response.status(404).json({ error: 'No user found' })

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      users: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async(request,response,next) => {
  try{
    const user = request.user
    const blog = await Blog.findById(request.params.id)
    if(!blog) return response.status(404).json({ error: 'blog not found' })

    if (user.id.toString() === blog.users.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      return response.status(204).end()
    }

    response.status(403).json({ error: 'not authorized to delete this blog' })
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