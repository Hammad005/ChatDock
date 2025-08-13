import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './page/Home'
import AuthPage from './page/AuthPage'
import { useAuthStore } from './store/useAuthStore'
import Loading from './components/Loading'

const protectRoutes = (condition, children, naivagate) => {
  return condition ? children : <Navigate to={naivagate} />
};
const App = () => {
  const {authLoading, checkAuth, user, progress} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (authLoading) return <Loading progress={progress}/>
  return (
    <>
    <Routes>
      <Route path='/' element={protectRoutes(user, <Home/>, '/login')}/>
      <Route path='/login' element={protectRoutes(!user, <AuthPage/>, '/')}/>
    </Routes>
    </>
  )
}

export default App