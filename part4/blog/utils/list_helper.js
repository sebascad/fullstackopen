const _ = require('lodash')
const { info } = require('./logger')
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc,current) => acc + current.likes,0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((favorite, current) =>
    current.likes > favorite.likes ? current : favorite
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const count = _.countBy(blogs,'author')
  console.log(count)

  const topAuthor = _.maxBy(Object.keys(count), author => count[author])

  return {
    author: topAuthor,
    blogs: count[topAuthor]
  }
}

module.exports = {dummy,totalLikes,favoriteBlog,mostBlogs}

