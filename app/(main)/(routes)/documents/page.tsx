"use client"
import Image from 'next/image'
import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { useMutation } from "convex/react"
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'

const Documents = () => {
  const { user } = useUser()
  // 10 minutes of tutorial timestamp
  const create = useMutation(api.documents.create)
  const onCreate = () => {
    const promise = create({title: "Untitled"})

    toast.promise(promise, {
      loading: "Creating a New Note...",
      success: "New Note Created",
      error: "Failed to create a new note"
    })
  }

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src={"/empty.png"} height={"300"} width={"300"} alt='empty' className='dark:hidden'/>
      <Image src={"/empty-dark.png"} height={"300"} width={"300"} alt='empty' className='hidden dark:block'/>
      <h2 className='text-lg font-medium'>Wellcome to {user?.firstName}&apos;s Potion</h2>
      <Button onClick={onCreate}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a Note
      </Button>
    </div>
  )
}

export default Documents
