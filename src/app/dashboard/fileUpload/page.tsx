import React from 'react'
import FileUpload from '@/component/uploadFile'
export default function page() {
  return (
    <div className='w-full h-auto flex flex-col mt-8 items-center space-y-6 justify-start min-h-screen'>
      <div>
        <h1 className='text-2xl md:text-3xl text-violet-700/60 font-semibold font-serif'>Upload Your File Here</h1>
      </div>
      <FileUpload/>
    </div>
  )
}
