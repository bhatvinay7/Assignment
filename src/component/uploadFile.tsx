'use client'
import React, { useState,useEffect } from "react";
import axios from '@/lib/axios'
// import { setTimeout } from "timers/promises";
export default function UploadFile() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFile,setIsFile]=useState<boolean>(false);
    const [responseData, setResponse] = useState<{ message: string }>({ message: "" })
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Allow only XML and CSV files
            const allowedTypes = ["text/xml", "application/xml", "text/csv"];

            if (!allowedTypes.includes(file.type)) {
                setErrorMessage("Only XML and CSV files are allowed.");
                setSelectedFile(null);
                return;
            }

            setSelectedFile(file);
            setUploadProgress(0);
            setErrorMessage("");
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

       
        setIsFile(!isFile);
    };

    useEffect(()=>{
        async function uploadFile(){
            try{
                const formData = new FormData();
                if (selectedFile) {
                    formData.append("file", selectedFile);
                }
                else{
                    return
                }
                const response=await axios.post('http://localhost:3000/api/uploadFile',formData,{headers: { "Content-Type": "multipart/form-data" }})
                setResponse(response.data)
            }
            catch(error:any){
                console.log(error?.message)
            }
            finally{
                setIsFile(!isFile)
                setTimeout(() => {
                    setResponse({ message: "" });
                }, 5000);
            }
        }
        if(isFile){
            uploadFile()
        }
    },[isFile])

    return (
        <div className='w-[320px] sm:w-[420px] h-32'>
            {responseData?.message && <p className="text-green-600 text-center p-2 ">{responseData?.message}</p>}
            <div className="p-6 border-dashed border-2 relative ring-4 h-full ring-blue-300/25 border-purple-500 bg-white rounded-lg text-center">
                <label className="cursor-pointer">
                    <p className="text-gray-700">Click or Drag a file to upload</p>
                    <input type="file" className="hidden" accept=".xml,.csv" onChange={handleFileChange} />
                </label>

                {errorMessage && <p className="text-red-500 mt-2 font-mono ">{errorMessage}</p>}

                {selectedFile && (
                    <div className="mt-4 text-gray-800  ">
                        <p className="font-medium relative ">{selectedFile.name}</p>

                    </div>
                )}


                {uploadProgress > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded h-2">
                        <div
                            className="h-2 bg-green-500 rounded"
                            
                            ></div>
                    </div>
                )}
                {selectedFile && (
                                    <div className=" w-full text-gray-800 absolute -bottom-14 right-0.5 flex justify-center ">
                                       
                                        <button
                                        type="button"
                                            onClick={handleUpload}
                                            className="bg-blue-600 text-white px-4 w-full py-2 rounded-full border-2 border-gray-400 hover:bg-blue-500"
                                        >
                                            Upload
                                        </button>
                                    </div>
                                )}
            </div>
        </div>
    );
}
