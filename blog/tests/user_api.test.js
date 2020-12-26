const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const { expect } = require('@jest/globals')

beforeEach(async () => {
  await User.deleteMany({})
  const promiseArray = helper.initialUsers.map((u) =>
    helper.userSave(u)
  )
  await Promise.all(promiseArray)
})

describe('user validation tests', () => {
  test('there are two initial users', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(2)
  })

  test('if the username and password properties are missing, the app will response 400 status', async () => {
    const newUser1 = {
      username: 'Ting',
      name: 'Ting Chen',
    }
    const newUser2 = {
      name: 'Ting Chen',
      password: 'hello',
    }
    await api.post('/api/users').send(newUser1).expect(400)
    await api.post('/api/users').send(newUser2).expect(400)
  })

  test.only('if the length of username and password is less than 3 characters, the app will response 400 status', async () => {
    const newUser1 = {
      username: 'T',
      name: 'Ting Chen',
      password: 'hello',
    }
    const newUser2 = {
      username: 'Ting',
      name: 'Ting Chen',
      password: 'he',
    }
    await api.post('/api/users').send(newUser1).expect(400)
    await api.post('/api/users').send(newUser2).expect(400)
  })
})
afterAll(() => {
  mongoose.connection.close()
})
