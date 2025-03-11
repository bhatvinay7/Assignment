"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import axios from "@/lib/axios";
export default function page() {
  const router = useRouter();
  const [responseData, setResponseData] = useState<any>();
  const [isResponseData, setIsresponseData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/uploadFile");
        setResponseData(response.data);
        setIsresponseData(true);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 place-content-start gap-2 p-4">
    {!isResponseData && (
      <div className="text-xl md:text-2xl col-span-full text-blue-950 mt-4">
        No  Agent  Details Found!
      </div>
    )}
     {responseData && <h1 className="text-2xl md:text-3xl text-center col-span-full text-blue-900 md:text-start m-2 p-2">Agent Information</h1>}
    {responseData?.map((agent: any, index: number) => (
      <div key={index} className=" max-w-[360px] bg-pink-100/60 h-fit rounded-md p-2">
        <div className="flex items-center space-x-2">

        <span className="font-medium text-base">Email:</span>
        <h2 className="text-indigo-950 p-2">{agent.userName}</h2>

        </div>
  
        <div className="flex items-center space-x-2">
          <span className="font-medium text-base">Email:</span>
          <p className="text-slate-700">{agent.email}</p> 
        </div>
  
        <div className="flex items-center space-x-2">
          <span className="font-medium text-base">Mobile:</span>
          <p className="text-slate-700">{agent.mobile}</p>
        </div>
  
        <div className="mt-2 flex flex-wrap gap-2">
          {agent.fileUrls.map((url: string, index: number) => (
            <a key={index} href={url} download>
              <button type="button" className="px-4 py-1 text-base bg-blue-500/75 text-white rounded">
                Download <FontAwesomeIcon className="ml-1 text-sm " icon={faArrowDown} />
              </button>
            </a>
          ))}
        </div>
      </div>
    ))}
  </div>
  
  );
}
