const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogsList) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogsList.reduce(reducer, 0)
}

const favoriteBlog = (blogsList) => {
  if (blogsList.length !== 0) {
    const maxLike = Math.max(...blogsList.map((x) => x.likes))
    const maxLikeBlog = blogsList.find((x) => x.likes === maxLike)
    const result = {
      author: maxLikeBlog.author,
      likes: maxLikeBlog.likes,
      title: maxLikeBlog.title,
    }
    return result
  } else {
    return []
  }
}

const mostBlogs = (blogsList) => {
  if (blogsList.length !== 0) {
    const author = _.map(
      _.countBy(blogsList, (value) => value.author),
      (val, key) => ({
        author: key,
        blogs: val,
      })
    )
    const result = author.find(
      (x) => x.blogs === Math.max(...author.map((x) => x.blogs))
    )

    return result
  } else {
    return []
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
