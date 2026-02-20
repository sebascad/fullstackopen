const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {
  const user = request.get('user')
  if(!user) return response.status(404).json('User not found')
  next()
}

module.exports = { tokenExtractor, userExtractor }