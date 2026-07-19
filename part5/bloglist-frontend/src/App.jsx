import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
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

  const handleLogin = async ({username,password}) => {
    try {
      const user = await loginService.login({username,password})

      window.localStorage.setItem(
        'loggedBlogappUser',JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
    } catch{
      console.log("WRONG CREDENTIALS")
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }

  const handleLikes = async (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id)
    const changedBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1}

    const updatedBlog = await blogService.update(changedBlog)
    setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
  }

  const handleRemoval = async (id) => {
    try{
      await blogService.remove(id)

      setBlogs(blogs.filter((blog) => blog.id !== id))
    }catch{
      window.alert("YOU CANNOT DELETE A BLOG THAT YOU DONT OWN!")
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const createBlog = async (blog) => {
    try{
      blogFormRef.current.toggleVisibility()
      
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

  const createNewBlogForm = () => {
    return(
      <div>
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <BlogForm 
          createBlog ={createBlog}
          />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {!user && (
        <div>
          <h1>log in to application</h1>
          {loginForm()}
        </div>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          <h4>{user.name} logged in</h4>
          <button onClick={handleLogout}>logout</button>

          <h2>create new blog</h2>
          {createNewBlogForm()}

          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} handleLikes={handleLikes} handleRemoval={handleRemoval}/>
          )}
          
        </div>
      )}

    </div>
  )
}

export default App