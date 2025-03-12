'use client'
import React from 'react'
import { toggle } from '@/lib/redux/slideBarSlice/slidebar';
import {useSelector,useDispatch} from 'react-redux'
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import {isOpen} from '@/lib/redux/slideBarSlice/slidebar'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUsers,faFile,faUserPlus,faChessBoard} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from 'next/navigation'
export default function MbileSlideBar() {
  const router=useRouter()
  const { data: session, status } = useSession();
  const value=useSelector(toggle)
  const dispatch=useDispatch()
   const handleLogout = async () => {
          await signOut({ callbackUrl: "/signIn" }); // Redirect to login after sign-out
        };
  return (
    <div className={` ${value ? " visible block  sm:hidden w-3/4 transition-all delay-700 ease-in ":"w-0 invisible transition-all delay-700 ease-in"} z-[39]  bg-slate-50 absolute min-h-screen h-full border-r border-black/10 `}>
       <div className='w-full  text-indigo-950/90  flex-col items-start  space-y-6 p-4 '>
      <div onClick={()=>{router.push('/dashboard'),dispatch(isOpen(!value))}} className="hover:cursor-pointer flex gap-x-1.5 items-center ">
      <FontAwesomeIcon className="text-sm" icon={faChessBoard} />
        Dashboard
      </div>
      <div onClick={()=>{router.push('/dashboard/agents'),dispatch(isOpen(!value))}} className="hover:cursor-pointer flex gap-x-1.5 items-center">
      <FontAwesomeIcon className="text-sm" icon={faUsers} />
        Agents
      </div>
      <div onClick={()=>{router.push('/dashboard/fileUpload'),dispatch(isOpen(!value))}} className="hover:cursor-pointer flex gap-x-1.5 items-center">
      <FontAwesomeIcon className="text-sm" icon={faFile} />
     Upload File
    </div>
      <div onClick={()=>{router.push('/dashboard/agentForm'),dispatch(isOpen(!value))}} className="hover:cursor-pointer flex gap-x-1.5 items-center">
      <FontAwesomeIcon className="text-sm" icon={faUserPlus} />
        Add Agents
      </div>
         {!session?.user ?  
       <div onClick={()=>{router.push('/signup'),dispatch(isOpen(!value))}} className="hover:cursor-pointer ">
      Sign Up
      </div>
      <div onClick={()=>{router.push('/signIn'),dispatch(isOpen(!value))}} className="hover:cursor-pointer ">
      Sign In
      </div>:<></>}
      <div onClick={()=>{handleLogout(),dispatch(isOpen(!value))}} className="hover:cursor-pointer hover:text-red-600">
       Log Out
      </div>
      </div>

    </div>
  )
}
