'use client'
import { useState,useEffect } from "react";
import React from 'react'
import axios from '@/lib/axios'
import {z} from 'zod'


export default function SignupForm() {

  const schema=z.object({
    userName:z.string().min(3,"* Please Enter Your Name"),
    email: z.string().email(" * Please provide a valid Email"),
    password:z.string().min(6,"* Password must be atleast 6 characters long")
  })
  const [formData, setFormData] = useState<userData>({
    userName:"",
    email: "",
    password: "",
  });
  const [isFormData,setPostFormData]=useState(false)
 
  const [frontEnderror, setFrontEndErrors] = useState<frontEndFormDataError>();
  const [signUpResponse,setSignUpResponse]=useState<{message:string}>()
  const [errorResponse,setErrorResponse]=useState<{message:string}>()

  useEffect(()=>{
    async function postFormData(){
      try{
        const response= await axios.post('/api/signup',formData)
        setSignUpResponse(response.data)
        setFormData( {userName:"",
          email: "",
          password: "",})
      }
      catch(error:any){
        if(error.status===400){
         const data=error.response.data.error
         const errorData=Object.entries(data?.format() as formDataError).filter(([key, value]) => key !== "_errors" && (value?._errors.length ?? 0) > 0).map(([key,value])=>{
          return { [key]: value?._errors[0] }})
  
          const errorObject = Object.assign({}, ...errorData);
          setFrontEndErrors(errorObject)

       }
       else{
        console.log(error.response?.data)
         setErrorResponse(error.response?.data)
       }

      }
      finally{
        setTimeout(()=>{
          setSignUpResponse({message:""})
          setErrorResponse({message:""})
        },5000)
        setPostFormData(false)
      
      }
    }
    if(isFormData){
      postFormData()
    }
  },[isFormData])

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFrontEndErrors({...frontEnderror,[name]:""})
  };

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const {userName,email,password}=formData
    const result=schema.safeParse({userName,email,password})
    if(result.success){

      setPostFormData(!isFormData)
    }
    
    else{
      
      const errorData=Object.entries(result?.error?.format() as formDataError).filter(([key, value]) => key !== "_errors" && (value?._errors.length ?? 0) > 0).map(([key,value])=>{
        return { [key]: value?._errors[0] }})

        const errorObject = Object.assign({}, ...errorData);
        setFrontEndErrors(errorObject)
        // console.log(errorData)

      }
  }
      

  

  return (
    <div className="flex flex-col w-full  items-center p-1 justify-center min-h-screen bg-gray-50">
      <div className=" bg-slate-50 to-gray-200 rounded-sm w-full max-w-[360px] shadow shadow-slate-200  p-6 border border-black/20   ">
       {errorResponse?.message && <div className="w-full p-1"><p className="text-red-600 font-mono text-base text-start ">{errorResponse?.message}</p>
       </div>}
      {signUpResponse?.message && <div className="w-full p-1"><p className="text-green-600 font-mono text-base text-start ">{signUpResponse?.message}</p></div>}

        <h2 className="text-2xl font-semibold font-serif text-start text-slate-700 mb-4">Sign Up</h2>
        <form onSubmit={(e)=>handleSubmit(e)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium  text-gray-700">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData?.userName}
              onChange={handleChange}
              className={` ${frontEnderror?.userName ?'border-red-500 font-mono':""} w-full p-2 border-2 text-slate-800 rounded border-indigo-950/75 mt-1`}
              placeholder="Enter your name"
            />
            {frontEnderror?.userName && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.userName as string }</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={` ${frontEnderror?.email ?'border-red-500 font-mono':""} w-full p-2 border-2 text-slate-800 rounded border-indigo-950/75 mt-1`}
              placeholder="Enter your email"
            />
            {frontEnderror?.email && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.email as string}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e)=>handleChange(e)}
              className={`${frontEnderror?.password ?'border-red-500 font-mono':""} w-full p-2 border-2 text-slate-800 rounded border-indigo-950/75 mt-1`}
              placeholder="Enter your password"
            />
            {frontEnderror?.password && <p className="text-red-500 text-xs mt-1 font-mono">{frontEnderror?.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-900 hover:bg-blue-900/75 text-white py-2 rounded border border-black"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

