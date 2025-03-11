'use client'
import React from 'react'
import { useState,useEffect } from "react";
import axios from 'axios'
import AutoSizer from "react-virtualized-auto-sizer"
import {z} from 'zod'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function AgentForm(){

   const schema=z.object({
      userName:z.string().min(3,"* Please Enter Your Name"),
      email: z.string().email(" * Please provide a valid Email"),
      password:z.string().min(6,"* Password must be atleast 6 characters long"),
      mobile:z.string().min(10,"* Enter valid mobile number")
    })

   
  const [countryCodes,setCountryCodes]=useState<any>()
  const [selectedCode, setSelectedCode] = useState("");
  const [isFormData,setPostFormData]=useState(false)
  const [frontEnderror, setFrontEndErrors] = useState<frontEndFormDataError>();
  const [signUpResponse,setSignUpResponse]=useState<{message:string}>()
  const [errorResponse,setErrorResponse]=useState<{message:string}>()
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobile: "",
    password: "",
  });
    
   
console.log(frontEnderror)

    useEffect(()=>{
      async function postFormData(){
        try{
          const data={...formData,mobile:`(${selectedCode.split(" ")?.[0]}) ${formData.mobile}`}
          const response= await axios.post('/api/agentForm',data)
          setSignUpResponse(response.data)
          setFormData( {userName:"",
            email: "",
            mobile:"",
            password: "",})
        }
        catch(error:any){
          console.log(error)
          if(error.status===400){
           const result=error.response.data?.error
           const errorData=Object.entries(result as formDataError).filter(([key, value]) => key !== "_errors" && (value?._errors.length ?? 0) > 0).map(([key,value])=>{
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



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFrontEndErrors({...frontEnderror,[e.target.name]:""})
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    const {userName,email,password,mobile}=formData
    const result=schema.safeParse({userName,email,password,mobile})

    if(!selectedCode){
      setFrontEndErrors({...frontEnderror,mobile:'*country code is missimg'})
    }
    if(result.success && selectedCode){

      setPostFormData(!isFormData)
    }
    
    else{
      if(result?.error){

      
      const errorData=Object.entries(result?.error?.format() as formDataError).filter(([key, value]) => key !== "_errors" && (value?._errors.length ?? 0) > 0).map(([key,value])=>{
        return { [key]: value?._errors[0] }})

        const errorObject = Object.assign({}, ...errorData);
        setFrontEndErrors(errorObject)
  }
}
}

  
  useEffect(()=>{
    async function fetch(){
      try{
        const response=await axios.get("https://restcountries.com/v3.1/all?fields=name,idd")
        setCountryCodes(response.data.slice(0,75))
       
        console.log(response.data)
      }
      catch(error:any){
console.log(error)
      }
    }
    fetch()
  },[])
  return (
    <div className='w-full relative top-8 md:top-20 h-auto flex min-h-screen items-center justify-center sm:items-start sm:justify-start'>
    <div className="w-[380px] mx-auto p-4 bg-slate-50 shadow-lg rounded ">
    {errorResponse?.message && <div className="w-full p-1"><p className="text-red-600 font-mono text-base text-start ">{errorResponse?.message}</p>
       </div>}
      {signUpResponse?.message && <div className="w-full p-1"><p className="text-green-600 font-mono text-base text-start ">{signUpResponse?.message}</p></div>}
      <h2 className="text-2xl font-semibold mb-4 text-start text-indigo-700/75">Add Agents</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="text" className="block text-gray-700 font-mono font-semibold">Name</label>
          <input
          id="text"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className={ ` ${frontEnderror?.userName ?'border-red-500 font-mono':" border-slate-700"} w-full p-2 border font-mono  text-sm rounded focus:outline-none focus:shadow focus:shadow-sky-200`}
             placeholder="Enter your name"
          />
           {frontEnderror?.userName  && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.userName  as string }</p>}
        </div>
   

        {/* Email */}
        <div>
          <label htmlFor='email' className="block text-gray-700 font-mono font-semibold">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={` ${frontEnderror?.email ?'border-red-500 font-mono':"border-slate-700"}  w-full p-2 font-mono border  text-sm rounded focus:outline-none focus:shadow focus:shadow-sky-200"`}
             placeholder="Enter your email address"
          />
           {frontEnderror?.email  && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.email  as string }</p>}
        </div>

        {/* Mobile Number with Country Code */}
        <div>
        
        
          <label className='font-semibold text-gray-700 font-mono' htmlFor="mobile " >Mobile</label>
          <div className={` ${frontEnderror?.mobile ?'border-red-500 font-mono':"border-slate-700 "}   flex border rounded focus:bg-white focus:shadow focus:shadow-sky-200`}>
          <Select value={selectedCode} onValueChange={setSelectedCode}>
      <SelectTrigger className="max-w-[100px] text-sm rounded-none outline-0 rounded-l border-0 h-11">
        <SelectValue placeholder="Select">{selectedCode || "Select"}</SelectValue>
      </SelectTrigger>
      <SelectContent>
      
        <SelectGroup>
          <SelectLabel>country code</SelectLabel>
      

          {/* <AutoSizer className='w-[120px] h-[80px] overflow-y-scroll'> */}

          {
            countryCodes?.map((country:any,index:number)=>{
              return(


<SelectItem 
  key={`${index}-${country.idd.root}${country.idd.suffixes?.[0]}`} 
  value={`${country.idd.root}${country.idd.suffixes?.[0]} ${country.name.common}`}
>
  {`${country.idd.root}${country.idd.suffixes?.[0]} ${country.name.common}`}
</SelectItem>

              )
            })
          }

          {/* </AutoSizer> */}
        
        </SelectGroup>
      </SelectContent>
    </Select>          
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-2 border font-mono border-l-0 text-sm outline-0 rounded-r rounded-l-none  "
              placeholder="Enter mobile number"
            />
          </div>
             {frontEnderror?.mobile  && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.mobile  as string }</p>}       
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-gray-700 font-mono">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={` ${frontEnderror?.password ?'border-red-500 font-mono':"border-slate-700"}  w-full p-2 border font-mono rounded  text-sm  focus:outline-none  focus:shadow focus:shadow-sky-200`}
             placeholder="Enter your password"
          />
           {frontEnderror?.password  && <p className="text-red-500 text-xs mt-1 font-mono ">{frontEnderror?.password  as string }</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-700 text-white border-2 border-white text-base p-2 rounded hover:bg-teal-600 transition duration-300"
        >
          Add Agent
        </button>
      </form>
    </div>

    <div className='flex flex-col'>
    </div>

    </div>
  );
};



