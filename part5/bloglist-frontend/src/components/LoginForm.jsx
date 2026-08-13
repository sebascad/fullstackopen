import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ handleLogin }) => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username,password })
    setUsername('')
    setPassword('')
    navigate('/')
  }


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
          username
            <input
              type='text' value={username} name='Username' onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='text' value={password} name='Password' onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm