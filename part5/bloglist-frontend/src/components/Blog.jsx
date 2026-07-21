import { useState } from 'react'

const Blog = ({ blog , handleLikes , handleRemoval }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [details,setDetails] = useState(false)

  const toggleDetails = () => setDetails(!details)
  const buttonText = details ? 'hide' : 'view' //Shows hide when details are shown

  const onLike = () => {
    handleLikes(blog.id)
  }

  const onRemoval = () => {
    window.alert(`Remove blog ${blog.title} by ${blog.author}?`)
    handleRemoval(blog.id)
  }

  return(
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{buttonText}</button>
      </div>
      {details && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={onLike}>like</button>
          </div>
          <div> {blog.user.username} </div>
          <button onClick={onRemoval}>Remove</button>
        </div>
      )}
    </div>
  )

}

export default Blog