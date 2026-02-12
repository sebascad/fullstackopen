const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ?
    0 :
    blogs.reduce((acc,blog) => acc + blog.likes ,0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ?
    {} :
    blogs.reduce((acc,blog) => acc.likes < blog.likes ? blog : acc)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {}

  const authors = _.groupBy(blogs, 'author')
  const authorsArray = Object.entries(authors).map(([author, authorBlogs]) => ({
    author,
    blogs: authorBlogs.length
  }))
  return _.maxBy(authorsArray, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0

  const authors = _.groupBy(blogs, 'author')
  const authorsArray = Object.entries(authors).map(([author, authorBlogs]) => ({
    author,
    likes: _.sumBy(authorBlogs,'likes')
  }))

  return _.maxBy(authorsArray, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}