const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  // content: {
  //   type: String,
  //   minLength: 5,
  //   required: true,
  // },
  // date: {
  //   type: Date,
  //   required: true,
  // },
  // important: Boolean,
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
