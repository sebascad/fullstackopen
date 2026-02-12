const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const Blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
  {
    'title': 'hola hola',
    'author': 'Pepe Perez',
    'url': 'www.hola.es',
    'likes': 2
  },
  {
    'title': 'Viva el betis',
    'author': 'Juan Perez',
    'url': 'www.adios.es',
    'likes': 5
  },
]


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('get requests', () => {
  test('returns the blogs in a JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length,initialBlogs.length)
  })

  test('id is shown properly', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert(blog.id)
    })
  })

  test('a note is displayed if exists by id', async () => {
    const initialBlogs = await api.get('/api/blogs')
    const noteToDisplay = initialBlogs.body[0]

    const response = await api
      .get(`/api/blogs/${noteToDisplay.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body,noteToDisplay)
  })

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = '2'

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('post requests', () => {
  test('when a new blog is posted, increases size by one', async () => {
    const newBlog = {
      'title': 'hola hola',
      'author': 'Pepe Perez',
      'url': 'www.hola.es',
      'likes': 2
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    assert.strictEqual(blogsAfter.body.length,initialBlogs.length + 1)
  })
  test('if likes field is missing, by default is zero', async () => {
    const newBlog = {
      'title': 'hola hola',
      'author': 'Pepe Perez',
      'url': 'www.hola.es',
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await api.get('/api/blogs')
    const lastBlog = blogsAfter.body[blogsAfter.body.length-1]

    assert.strictEqual(lastBlog.likes,0)
  })
  test('if title or url fields are missing, return 400 Bad Request', async () => {
    const newBlogNoTitle = {
      'author': 'Pepe Perez',
      'url': 'www.hola.es',
    }

    const newBlogNoUrl = {
      'title': 'prueba',
      'author': 'Pepe Perez',
    }

    await api.post('/api/blogs')
      .send(newBlogNoTitle)
      .expect(400)

    await api.post('/api/blogs')
      .send(newBlogNoUrl)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})