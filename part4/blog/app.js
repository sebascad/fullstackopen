const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const errorHandler = require('./utils/error_handler')
const middleware = require('./utils/middleware')

const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('Connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI,{ family: 4 })
  .then(() => {
    logger.info('Connected to MongoDB')
  })

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs',blogRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

app.use(errorHandler.unknownEndpoint)
app.use(errorHandler.errorHandler)


module.exports = app
