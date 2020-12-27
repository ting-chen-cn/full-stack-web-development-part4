const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
// const getTokenFrom = (request) => {
//   const authorization = request.get('authorization')
//   if (
//     authorization &&
//     authorization.toLowerCase().startsWith('bearer ')
//   ) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate(
    'user',
    {
      username: 1,
      name: 1,
      id: 1,
    }
  )
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  // const token = getTokenFrom(request)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
    return response
      .status(401)
      .json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author === undefined ? 'unknown' : body.author,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  })
  // const blog = new Blog(request.body)
  const savedBlogs = await blog.save()
  user.blogs = user.blogs.concat(savedBlogs._id)
  await user.save()
  response.json(savedBlogs.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (
    !request.token ||
    blog.user.toString() !== decodedToken.toString()
  ) {
    return response
      .status(401)
      .json({ error: 'token missing or invalid' })
  } else {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    url: request.body.url,
    likes: request.body.likes,
    author: request.body.author,
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter
