import React from 'react'

const App = () => {

  const handleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  }
  return (
    <>
    <button onClick={handleLogin}>
      Login
    </button>
    </>
  )
}

export default App