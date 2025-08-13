import React from 'react'

const Login = () => {
    const handleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  }
  return (
    <div>Login</div>
  )
}

export default Login