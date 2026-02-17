const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const User = require('../models/user')

const api = supertest(app)

const initialUsers = [
  {
    'name': 'pepe',
    'username': 'pepepro',
    'password': 'pepeelmejor'
  },
  {
    'name': 'rosana',
    'username': 'rosanadelasnieves',
    'password': 'perropesao'
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

describe('creating a new user', () => {

  test('fails if username or password are undefined', async () => {
    const invalidUser = {
      username: 'josepro'
    }

    await api.post('/api/users')
      .send(invalidUser)
      .expect(400)
  })

  test('fails if username is too short', async () => {
    const invalidUser = {
      name: 'Josee',
      username: 'jo',
      password: 'hola'
    }

    await api.post('/api/users')
      .send(invalidUser)
      .expect(400)
  })

  test('fails if password is too short', async () => {
    const invalidUser = {
      name: 'Jose',
      username: 'josepro',
      password: 'h'
    }

    await api.post('/api/users')
      .send(invalidUser)
      .expect(400)
  })

  test('fails if username is already in the DB', async () => {
    const invalidUser = {
      name: 'jose',
      username: 'pepepro',
      password: 'hola'
    }

    await api.post('/api/users')
      .send(invalidUser)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})