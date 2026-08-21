import { Button, Card, CardActions, CardContent, Chip, Link, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

const Blog = ({ blogs , handleLikes , handleRemoval , user }) => {
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
    <Card variant='outlined'>
      <CardContent>
        <Typography variant='h5' component="div">
          {blog.title}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          by {blog.author}
        </Typography>

        <Link href={blog.url}>{blog.url}</Link>

        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
          added by {blog.user.username}
        </Typography>
      </CardContent>

      <CardActions>
        <Chip label={`${blog.likes} likes`} size='small'/>

        {user && <Button size='small' color='primary' onClick={onLike}>Like</Button>}

        {isOwner && <Button size='small' color='error' onClick={onRemoval}>Remove</Button>}
      </CardActions>
    </Card>
  )
}

export default Blog