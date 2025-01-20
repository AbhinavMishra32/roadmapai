import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { AlignLeft, ArrowLeft, ArrowLeftCircle, MoveLeft } from 'lucide-react'

const Navbar = () => {
  const handleBack = () => {
    window.history.back();
  }
  return (
    <>
      <div className='fixed rounded-2xl z-20 w-full h-[50px] border-2 mx-2 bg-white/80 border-yellow-400 backdrop-blur-lg flex items-center'>
        <SidebarTrigger className='h-full w-10' />
        {/* <h1 className='ml-4 text-2xl font-bold text-gray-800'>Navbar</h1> */}
        <button onClick={handleBack} className='h-full flex items-center gap-2 hover:bg-gray-100 px-1 rounded-lg'>
          <ArrowLeftCircle className='h-6 w-6 text-gray-800' />
          <span className='text-gray-800'>Back</span>
        </button>
      </div>
      <div className='w-full h-[50px]'></div>
    </>
  )
}

export default Navbar