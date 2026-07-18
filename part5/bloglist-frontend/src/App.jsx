import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [newBlog,setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

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

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({username,password})

      window.localStorage.setItem(
        'loggedBlogappUser',JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch{
      console.log("WRONG CREDENTIALS")
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      },5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try{
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setNewBlog({title: '',author: '',url: ''})

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
  
  const handleBlogChange = async (event) => {
    const {name, value} = event.target //When a field is submited, ex: title -> 'Hola'
    setNewBlog({...newBlog, [name]: value}) //only its value gets "updated"
  }

  const loginForm = () => {
    return(
      <div>
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({target}) => setUsername(target.value)}
        handlePasswordChange={({target}) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
      </div>
    )
  }

  const createNewBlogForm = () => {
    return(
      <BlogForm 
        title={newBlog.title}
        author={newBlog.author}
        url={newBlog.url}
        handleCreateBlog={handleCreateBlog}
        handleBlogChange={handleBlogChange}
      />
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

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
          
        </div>
      )}

    </div>
  )
}

export default App