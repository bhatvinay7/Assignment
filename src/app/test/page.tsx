'use client'
import  React from 'react'
import axios from '@/lib/axios'
import {useEffect,useState} from 'react'
export default function Test() {
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/signup");
        console.log(response.data);
      } catch (error: any) {
        console.log(error.response?.data || "Error occurred");
      }
    }
  
    fetchData(); // Call the function here
  }, []);
  return (
    <div>
      <h1>Hiii</h1>
    </div>
  )
}
