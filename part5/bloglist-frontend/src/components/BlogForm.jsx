import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title,author,url })
    setTitle('')
    setAuthor('')
    setUrl('')
    navigate('/')
  }

  return(
    <form onSubmit={handleSubmit}>
      <h2>create new</h2>
      <div>
        <label>
        title
          <input className='title'
            type='text' value={title} name='title' onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
        author
          <input className='author'
            type='text' value={author} name='author' onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
        url
          <input className='url'
            type='text' value={url} name='url' onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type='submit'>create</button>
    </form>
  )
}

export default BlogForm