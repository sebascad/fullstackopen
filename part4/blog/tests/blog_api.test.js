const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const exampleBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]


beforeEach(async() => {
  await Blog.deleteMany({})

  const blogs = exampleBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogs.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

describe('GET Tests', () => {
  test('Returns the correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length,2)
  })

  test('id field is shown and named properly', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert(blog.id !== undefined)
      assert.strictEqual(blog._id,undefined) 
    })
  })
})

describe('POST Tests', () => {
  test('If a blog is succesfully added, the total count increments by 1', async () => {

    await api.post('/api/blogs')
      .send(exampleBlogs[0])
      .expect(201)
    
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length,  exampleBlogs.length + 1)
  })

  test('If the likes are not defined, its assigned 0 by default', async () => {
    const blog =  {
      title: 'Hola',
      author: 'Adios',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }

    const response = await api.post('/api/blogs')
      .send(blog)
      .expect(201)
    
    assert.strictEqual(response.body.likes,0)
  })

  test('If title or url are undefined, returns ERRORCODE 400', async () => {
    const blog = {
      title: undefined,
      author: 'anyone',
      url: undefined
    }

    await api.post('/api/blogs')
      .send(blog)
      .expect(400)
  })
})

describe('DELETE Tests', () => {
  test('If a blog is succesfully deleted, the total count decreases by 1', async () => {
    const initialBlogs = await api.get('/api/blogs')

    const blogToDelete = initialBlogs.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const finalBlogs = await api.get('/api/blogs')
    
    assert.strictEqual(finalBlogs.body.length,initialBlogs.body.length - 1)
  })

  test('If a blog doesnt exists, the count doesnt change', async () => {
    const initialBlogs = await api.get('/api/blogs')

    const blogToDelete = initialBlogs.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    // The blogs gets deleted "again"
    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const finalBlogs = await api.get('/api/blogs')

    //It only should decrease by one
    assert.strictEqual(finalBlogs.body.length,initialBlogs.body.length - 1)
  })
})

describe('PUT Tests', () => {
  test('Likes field is succesfully updated', async () => {
    const initialBlogs = await api.get('/api/blogs')

    const blogToUpdate = initialBlogs.body[0]

    const updatedLikes = {...blogToUpdate, likes: blogToUpdate.likes + 1}
    const response = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)
    
    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})