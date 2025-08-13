import React from 'react'
import ModeToggle from './components/ModeToggle';
import { Button } from './components/ui/button';

const App = () => {

  const handleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/api/auth/google`, "_self");
  }
  return (
    <>
    <Button onClick={handleLogin}>
      Login
    </Button>
    <ModeToggle/>
    </>
  )
}

export default App