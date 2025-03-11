'use client'
import React from 'react'
import { useState } from "react";
import { signIn } from "next-auth/react";
import {redirect} from 'next/navigation'
import Image  from 'next/image';
export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError]=useState<string>("")
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
        const result= await signIn("credentials", { email, password,redirect:false });

       if(result?.error){
        setError(result?.error)
       }
       else{
        redirect('/dashboard')
       }
      
    };
  return (
    <div className="flex items-center justify-center min-h-screen p-1 border border-slate-500 bg-gray-100">
      <div className="p-6 rounded-md bg-gray-50 border shadow-lg w-[340px] md:w-[360px]">
        <h1 className="text-2xl font-bold mb-4 text-indigo-800/75 text-left">Sign In</h1>
        
        <div onClick={() => signIn("google",{ callbackUrl: "/dashboard" })} className='w-full bg-gray-100 flex py-1 gap-x-1.5 items-center justify-center border border-violet-800 px-4 shadow shadow-cyan-100 rounded-sm mb-4 hover:bg-gray-200'>
        <div  className="  text-black  ">
        <Image 
        src="/googleIcon.svg"  // Image path from the public folder
        alt="google logo"
        width={30}  // Set width
        height={30} // Set height
      />
        </div>    

        <div  className="w-fit text-black text-sm ">
          Sign in with Google
        </div>
        </div>
        <div className='flex items-center w-full mb-1'>

        <div className='h-[0.5px] bg-black/60 w-1/2  '></div>
        <div className='mx-1 text-black'>Or</div>
        <div className='h-[0.5px] bg-black/60 w-1/2 '></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='w-full'>
            
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-black outline-0 border-slate-600 focus:ring-1 focus:ring-blue-300  focus:border focus:border-slate-600 text-sm p-2 border rounded-sm"
          />
          </div>
          <div className='w-full'>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>{ setPassword(e.target.value),setError('')}}
            className={` ${error.includes("Incorrect password was entered") ? "border-red-600 shadow shadow-red-100/50" :"border-slate-600"} w-full p-2 outline-0 border text-black text-sm focus:ring-1 focus:ring-blue-300    focus:border focus:border-slate-600 rounded-sm`}
          />
          </div>
         
          {error&&
        <div className="w-full mb-1">
          <p className='text-red-600 font-mono text-start text-[12px]'>{error}</p>
        </div>}

          <button
            type="submit"
            className="w-full bg-violet-800 outline-0 border  border-slate-800 mt-2 focus:border focus:border-slate-600  text-base text-white py-2 px-4 rounded-sm hover:bg-violet-800/80"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
    
}
