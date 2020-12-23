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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
