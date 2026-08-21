import { Button, TextField } from '@mui/material'
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
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            label='username'
            size='small'
            margin='dense'
            value={username}
            onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          <TextField
            label='password'
            size='small'
            margin='dense'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>

        <div>
          <Button type='submit' variant='contained' style={{ marginTop: 10 }}>login</Button>
        </div>

      </form>
    </>
  )
}

export default LoginForm