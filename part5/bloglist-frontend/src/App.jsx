import { useState, useEffect, useRef } from 'react'
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

const App = () => {
  const [blogs, setBlogs] = useState([])
  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  const [user,setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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

  const blogFormRef = useRef()

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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
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

      setSuccessMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      },5000)

    }catch{
      setErrorMessage('blog creation failed')
      setTimeout(() => {
        setErrorMessage(null)
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

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">Blogs</Link>

        <Link style={padding} to={'/create'}>new blog </Link>
        {!user ? (<Link style={padding} to= "/login">Login</Link>) :
          <button onClick={handleLogout}> Logout </button> }
      </div>

      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

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