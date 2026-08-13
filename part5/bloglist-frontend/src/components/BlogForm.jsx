import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title,author,url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <form onSubmit={handleSubmit}>
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
      <button type='submit'>send</button>
    </form>
  )
}

export default BlogForm