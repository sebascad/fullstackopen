import Blog from './Blog'

const BlogList = ({ sortedBlogs , handleLikes , handleRemoval, user }) => {
  return(
    sortedBlogs.map(blog =>
      <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleRemoval={handleRemoval}
        user={user}/>
    )
  )
}

export default BlogList