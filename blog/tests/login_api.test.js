const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { response } = require('../app')
const { expect } = require('@jest/globals')
beforeEach(async () => {
  await User.deleteMany({})
  const promiseArray = helper.initialUsers.map((u) =>
    helper.userSave(u)
  )
  await Promise.all(promiseArray)
})

test('A successful login returns the user details and the token', async () => {
  const user1 = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password,
  }
  const returned = await api.post('/api/login').send(user1)
  expect(returned.body.username).toStrictEqual(
    helper.initialUsers[0].username
  )
  expect(returned.status).toBe(200)
  expect(returned.body.token).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})
