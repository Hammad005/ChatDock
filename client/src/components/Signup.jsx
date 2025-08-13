import React from 'react'

const Signup = () => {
    const handleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  }
  return (
    <div>Signup</div>
  )
}

export default Signup