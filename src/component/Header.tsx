'use client'
import React from 'react'
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars} from '@fortawesome/free-solid-svg-icons'
import { isOpen,toggle } from '@/lib/redux/slideBarSlice/slidebar';
import { useSession } from "next-auth/react";
import {useSelector,useDispatch} from 'react-redux'
export default function Header() {
   const { data: session, status } = useSession();

  

  const value=useSelector(toggle)
  const dispatch=useDispatch()
    const router=useRouter()
  return (
    <header className=' h-16 sm:h-24 border fixed w-full z-40 bg-indigo-900 border-gray-500 border-b-1  border-b-black/5'>
      <nav className='w-full h-full flex justify-between items-center  '>
        <div className='flex items-center justify-center gap-x-4 ml-2'>
        <div className='block mt-2 sm:hidden'>
        <FontAwesomeIcon onClick={()=>dispatch(isOpen(!value))} className="text-[22px] text-gray-300  " icon={faBars} />
        </div>  
        <div className='text-slate-100  md:text-3xl font-semibold  text-2xl '>AccessGate</div>

        </div>
          {!session?.user ?
        <div className='flex justify-center items-center space-x-1.5'>
        <button onClick={() => router.push('/signup')} type='button' className='mr-4  px-3 lg:py-1.5 py-1 hidden sm:block rounded-sm border text-slate-600 hover:bg-gray-300/90 border-black/15 bg-gray-300'>Sign Up</button>
        <button onClick={() => router.push('/signIn')} type='button' className='mr-4 px-3 lg:py-1.5 py-1 hidden sm:block rounded-sm border text-slate-600 hover:bg-gray-300/90 border-black/15 bg-gray-300'>Sign In</button>

        </div>:<></>}
      
      </nav>
    </header>
  )
}
