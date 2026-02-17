const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/error_handler')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI,{ family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB')
  })

app.use(express.json())

app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app
