const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogsList) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogsList.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes,
}
