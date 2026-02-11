const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0 ?
    0 :
    blogs.reduce((acc,blog) => acc + blog.likes ,0)
}

const favoriteBlog = (blogs) =>{
  return blogs.length === 0 ?
    {} :
    blogs.reduce((acc,blog) => acc.likes < blog.likes ? blog : acc)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}