const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUser = {
  username: 'ejemplo',
  name: 'ejemplo',
  password: 'secret'
}

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User(initialUser)

  await user.save()
})

describe('failure scenarios', () => {
  test('When the length of a username is less than 3, expect 400 status code', async () => {
    const wrongUser = {
      username: 'pe',
      name: 'pepe',
      password: 'secret'
    }

    await api.post('/api/users').send(wrongUser)
      .expect(400)
  })

  test('When the length of a password is less than 3, expect 400 status code', async () => {
    const wrongUser = {
      username: 'pepe',
      name: 'pepe',
      password: 'se'
    }

    await api.post('/api/users').send(wrongUser)
      .expect(400)
  })

  test('When the username is already in the database, expect 400 status code and the count shouldt increase',   async () => {
    const initialUsers = await api.get('/api/users')
    
    const wrongUser = {
      username: 'ejemplo',
      name: 'pepe',
      password: 'secret'
    }

    await api.post('/api/users').send(wrongUser)
      .expect(400)
    
    const finalUsers = await api.get('/api/users')

    assert.strictEqual(initialUsers.body.length,finalUsers.body.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})