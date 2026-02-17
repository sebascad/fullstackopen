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
    const validNonexistingId = '507f1f77bcf86cd799439011'

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

describe('delete requests',() => {
  test('when a blog is deleted, size decreases by one', async () => {
    const blogs = await api.get('/api/blogs')
    const blogToDeleteID = blogs.body[0].id

    await api.delete(`/api/blogs/${blogToDeleteID}`)
      .expect(204)

    const blogsAfterDeletion = await api.get('/api/blogs')

    assert.strictEqual(blogsAfterDeletion.body.length,blogs.body.length - 1)
  })

  test('if the id is invalid, it shows an appropiate status code', async () => {
    await api.delete('/api/blogs/2')
      .expect(400)
  })

  test('if the id doesnt exists, size doesnt vary', async () => {
    const blogs = await api.get('/api/blogs')
    const validNonexistingId = '507f1f77bcf86cd799439011'

    await api.delete(`/api/blogs/${validNonexistingId}`)
      .expect(204)

    const blogsAfterDeletion = await api.get('/api/blogs')

    assert.strictEqual(blogsAfterDeletion.body.length,blogs.body.length)
  })
})

describe('update requests',() => {
  test('when a blog is updated, size doesnt vary', async () => {
    const blogs = await api.get('/api/blogs')
    const blogToUpdateID = blogs.body[0].id

    await api.put(`/api/blogs/${blogToUpdateID}`)
      .send({ title: 'Updated title', url: 'updated.com' })
      .expect(200)

    const blogsAfterUpdate= await api.get('/api/blogs')

    assert.strictEqual(blogsAfterUpdate.body.length,blogs.body.length)
  })

  test('if the id is invalid, it shows an appropiate status code', async () => {
    await api.put('/api/blogs/2')
      .send({ title: 'Updated title', url: 'updated.com' })
      .expect(400)
  })

  test('if the id doesnt exists, expect 404 error code', async () => {
    const validNonexistingId = '507f1f77bcf86cd799439011'

    await api.put(`/api/blogs/${validNonexistingId}`)
      .send({ title: 'Updated title', url: 'updated.com' })
      .expect(404)
  })
})
after(async () => {
  await mongoose.connection.close()
})