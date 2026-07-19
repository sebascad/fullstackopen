const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')
const { error } = require('../utils/logger')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')

  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
  if(!decodedToken) return response.status(401).json({error: "Token invalid"})
  
  const user = await User.findById(decodedToken.id)
  if (!user) return response.status(400).json({error: 'UserId missing or invalid'})
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  if(blog.url === undefined || blog.title === undefined) return response.status(400).end()

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  
  await user.save()

  const populatedBlog = await savedBlog.populate('user')
  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', async (request,response) => {
  const decodedToken = jwt.verify(getTokenFrom(request),process.env.SECRET)
  if (!decodedToken) return response.status(401).json({error: "Token invalid"})
  
  const blog = await Blog.findById(request.params.id)
  console.log(blog)
  console.log(decodedToken)
  if(!blog) return response.status(404).json({error: "Blog not found"})
  
  if (blog.user.toString() !== decodedToken.id) return response.status(403).json("Only the creator can delete")
  
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request,response) => {
  const {title, author, url, likes} = new Blog(request.body)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {title, author, url, likes},
     {new: true, runValidators: true}).populate('user')

  response.json(updatedBlog)
})

module.exports = blogRouter