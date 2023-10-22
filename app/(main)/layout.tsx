"use client";

import { ReactNode } from 'react'
import { useConvexAuth } from "convex/react"
import { Spinner } from '@/components/spinner';
import { redirect } from 'next/navigation';
import Navigation from './_components/Navigation';
const MainLayout = ({ children} : { children: ReactNode}) => {
  const {isLoading, isAuthenticated} = useConvexAuth()


  if(isLoading){
    return (
        <div className='h-full flex items-center justify-center'>
            <Spinner size={"icon"} />
        </div>
    )
  }

  if(!isAuthenticated) {
    return redirect("/")
  }
    return (
    <div className='flex h-full dark:bg-[#1f1f1f]'>
        <Navigation />
        <main className='flex-1 h-full overflow-y-auto'>
      {children}
        </main>
    </div>
  )
}

export default MainLayout
