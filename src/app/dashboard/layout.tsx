import React from 'react'
import DashboardLayout from '@/component/dashboardLayout'
export default function Layout({children}:{children: React.ReactNode}) {
  return (
    <div className='w-full h-auto flex items-start justify-start min-h-screen'>
     <DashboardLayout/>
     <div className='w-full bg-gray-100/75 flex items-start p-1 justify-start '>
        {children}

     </div>
    </div>
  )
}
