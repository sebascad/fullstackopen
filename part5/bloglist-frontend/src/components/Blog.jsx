import { useNavigate, useParams } from 'react-router-dom'

const Blog = ({ blogs , handleLikes , handleRemoval , user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const id = useParams().id
  const blog = blogs.find(blog => blog.id === id)
  const navigate = useNavigate()

  const onLike = () => {
    handleLikes(blog.id)
  }

  const onRemoval = () => {
    window.alert(`Remove blog ${blog.title} by ${blog.author}?`)
    handleRemoval(blog.id)
    navigate('/')
  }

  const isOwner = user && blog.user && user.username === blog.user.username

  return(
    <div style={blogStyle} className='blog'>
      <div>
        <h2>{blog.title}: {blog.author}</h2>
      </div>
      <div>
        <div className='url'>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div className='user'> Added by {blog.user.username} </div>
        <div>
            likes {blog.likes}
          {user && <button onClick={onLike}>like</button>}
        </div>
        {isOwner && <button onClick={onRemoval}>Remove</button>}
      </div>
    </div>
  )
}

export default Blog