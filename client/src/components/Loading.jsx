import React, { useEffect } from 'react'
import Logo from '../assets/logo.png'
import { Progress } from './ui/progress'
import axios from '@/lib/axios'
import { useNavigate } from 'react-router-dom'

const Loading = ({progress}) => {
  const navigate = useNavigate();
   useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code){
          await axios.post("/auth/google", { code });
          navigate("/");
        }
      } catch (err) {
        console.error("Google login failed", err);
        navigate("/");
      }
    };

    handleGoogleAuth();
  }, []);
  return (
    <>
    <div className='w-full h-screen flex flex-col justify-between items-center'>
      <div className='flex flex-col items-center justify-center gap-3 w-full h-full'>
        <div className='w-[60px] h-auto object-contain'>
            <img src={Logo} draggable={false} alt="loading" className='w-full h-full object-cover'/>
        </div>
        <h3 className='text-xl tracking-wider'>ChatDock</h3>
        <div className='md:w-1/6 w-1/2 mt-4 '>
        <Progress value={progress}/>
        </div>
      </div>

        <p className='text-xs text-muted-foreground'>
          Don't close this window. Your messages are downloading.
        </p>
    </div>
    </>
  )
}

export default Loading