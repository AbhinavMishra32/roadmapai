import React from 'react'

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-200 rounded-full animate-pulse"></div>
        <div className="absolute top-2 left-2 w-20 h-20 border-4 border-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute top-4 left-4 w-16 h-16 border-4 border-yellow-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  )
}

export default LoadingAnimation

