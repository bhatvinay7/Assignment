'use client'
import React from 'react'
import {useRouter} from 'next/navigation'

import { signOut } from "next-auth/react";

export default function DashboardLayout() {
    const router=useRouter()
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/signIn" }); // Redirect to login after sign-out
      };
    
  return (
    
    <div className='w-[260px] hidden sm:flex min-h-screen h-full text-indigo-950/75 border-r bg-slate-100  flex-col items-start gap-y-5 p-4 border-r-black/15'>
    <div onClick={()=>router.push('/dashboard')} className="hover:cursor-pointer">
      Dashboard
    </div>
    <div onClick={()=>router.push('/dashboard/agents')} className="hover:cursor-pointer">
      Agents
    </div>
    <div onClick={()=>router.push('/dashboard/agentForm')} className="hover:cursor-pointer">
      Add Agents
    </div>
    <div onClick={()=>router.push('/dashboard/fileUpload')} className="hover:cursor-pointer">
     Upload File
    </div>
    <div onClick={()=>handleLogout()} className="hover:cursor-pointer hover:text-red-600">
     Log Out
    </div>
    </div>
    // <div className='w-4/5 min-h-screen h-full'>

    // </div>
  )
}
