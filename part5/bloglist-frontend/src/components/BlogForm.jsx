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
        title
        <input className='title'
          type='text' value={title} name='title' onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input className='author'
          type='text' value={author} name='author' onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url
        <input className='url'
          type='text' value={url} name='url' onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type='submit'>send</button>
    </form>
  )
}

export default BlogForm