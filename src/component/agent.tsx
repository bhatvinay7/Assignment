'use client'
import React from 'react'
import {useState,useEffect} from 'react'
import { useSession } from "next-auth/react";
import axios from 'axios'
export default function Agent() {
    const { data: session, status } = useSession();
    const [agents,setAgentsData]=useState<any>([])
    const [isData,setIsData]=useState<boolean>(false)
    useEffect(()=>{
        async function fetchAgents(){
            try{
    const response= await axios.get('/api/agentForm')
    console.log(response.data)
    setAgentsData(response.data)
    setIsData(true)
            }
            catch(error:any){
             console.log(error.message)
            }
        }
        if(session?.user){
            fetchAgents()
        }
    },[session?.user])
  return (
     
    <div className='w-full min-h-screen'>
       {!isData ?<div>Loading....</div>:agents.length==0?<div>No Agents are Assigned</div>:
       <div className=" flex  md:w-3/4 w-full flex-wrap space-x-1 space-y-1">
        {  agents.map((agent:any,index:number)=>{
            return(
                <div className='p-2 w-[360px] h-auto rounded-md bg-blue-50 border border-blue-400 ' key={index}>
                    <div className='flex flex-col space-y-1.5'>
                    <h2 className='text-indigo-950'>{agent.userName}</h2>
                    <p className='text-base text-black/75'>{agent.mobile}</p>
                    <p className='text-base text-black/75'>{agent.email}</p>
                    </div>

                </div>
            )
        })

        }

       </div>
       }
      
    </div>
  )
}
