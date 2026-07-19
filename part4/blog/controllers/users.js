const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

const User = require('../models/user')

userRouter.get('/', async (request,response) => {
  const users = await User.find({}).populate('blogs')

  response.json(users)
})

userRouter.post('/', async (request,response) => {
  const {username,name,password} = request.body
  const passwordHash = await bcrypt.hash(password,10) //10 salt rounds

  if(username.length < 3 || password.length < 3) return response.status(400).end()
    
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter