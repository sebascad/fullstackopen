import { TextField , Button } from '@mui/material'
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
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label="title"
            size='small'
            margin='dense'
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="author"
            size='small'
            margin='dense'
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label="url"
            size='small'
            margin='dense'
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>

        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BlogForm