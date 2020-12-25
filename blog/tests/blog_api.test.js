const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog(blog)
  )
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('tests for GET', () => {
  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(6)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific title blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const contents = response.body.map((r) => r.title)
    expect(contents).toContain('Canonical string reduction')
  })
})

describe('tests for POST', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Hello world',
      author: 'Ting Chen',
      url: 'http://localhost:3001/api/blogs',
      likes: 0,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((n) => n.title)
    expect(titles).toContain('Hello world')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
