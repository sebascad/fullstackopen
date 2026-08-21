import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Blog from './components/Blog'
import BlogList from './components/BlogList'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { AppBar, Button, Toolbar } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  const [user,setUser] = useState(null)
  const [notification,setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggerUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggerUserJSON){
      const user = JSON.parse(loggerUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  },[])

  const handleLogin = async ({ username,password }) => {
    try {
      const user = await loginService.login({ username,password })

      window.localStorage.setItem(
        'loggedBlogappUser',JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch{
      console.log('WRONG CREDENTIALS')
      setNotification({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      },5000)
    }
  }

  const handleLikes = async (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id)
    const changedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const updatedBlog = await blogService.update(changedBlog)
    setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
  }

  const handleRemoval = async (id) => {
    try{
      await blogService.remove(id)

      setBlogs(blogs.filter((blog) => blog.id !== id))
    }catch{
      window.alert('YOU CANNOT DELETE A BLOG THAT YOU DONT OWN!')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    try{
      const createdBlog = await blogService.create(blog)
      setBlogs(blogs.concat(createdBlog))

      setNotification({ text:`A new blog ${createdBlog.title} by ${createdBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      },5000)

    }catch{
      setNotification({ text: 'blog creation failed', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      },5000)
    }
  }

  const loginForm = () => {
    return(
      <div>
        <LoginForm
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  const blogList = () => {
    return(
      <div>
        <BlogList sortedBlogs={sortedBlogs} handleLikes={handleLikes}
          handleRemoval={handleRemoval} user={user} />
      </div>
    )
  }

  const createNewBlogForm = () => {
    return(
      <div>
        <BlogForm
          createBlog ={createBlog}
        />
      </div>
    )
  }

  return (
    <Router>
      <AppBar position='static'>
        <Toolbar>
          <h1 style={{ padding: 10 }}>Blog App</h1>

          <Button color='inherit' component={Link} to='/'>Blogs</Button>

          {user && <Button color='inherit' component={Link} to='/create'>new blog</Button>}

          {!user ? <Button color='inherit' component={Link} to='/login'>Login</Button> :
            <Button color='red' onClick={handleLogout}> Logout </Button> }

        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element = {
          blogList()
        } />

        <Route path="login" element = {
          loginForm()
        } />

        <Route path='/blogs/:id' element = {
          <Blog blogs={blogs} handleLikes={handleLikes} handleRemoval={handleRemoval}
            user={user}/>
        } />

        <Route path='/create' element = {
          createNewBlogForm()
        } />

      </Routes>
    </Router>
  )
}

export default App