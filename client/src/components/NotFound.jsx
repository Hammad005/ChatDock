import React from 'react'
import notFoundImage from "../assets/notFound.png";

const NotFound = () => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='w-auto h-[500px]'>
        <img src={notFoundImage} alt="notFound" className='w-full h-full object-contain ' />
        </div>
    </div>
  )
}

export default NotFound