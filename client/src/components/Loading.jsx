import React from 'react'
import Logo from '../assets/logo.png'
import { Progress } from './ui/progress'
import ModeToggle from './ModeToggle'

const Loading = ({progress}) => {
  return (
    <>
    <div className='w-full h-screen flex flex-col justify-center items-center gap-3'>
        <div className='w-[60px] h-auto object-contain'>
            <img src={Logo} alt="loading" className='w-full h-full object-cover'/>
        </div>
        <h3 className='text-xl tracking-wider'>ChatDock</h3>
        <div className='md:w-1/4 w-1/2 mt-4 '>
        <Progress value={progress}/>
        </div>
    </div>
    </>
  )
}

export default Loading