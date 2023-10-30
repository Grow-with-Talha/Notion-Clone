"use client"

import { Doc } from "@/convex/_generated/dataModel"
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover"
import { useOrigin } from "@/hooks/use-origin"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Check, Copy, Globe } from "lucide-react"


interface PublishProps {
    initialData: Doc<"documents">
}

const Publish = ({initialData} : PublishProps) => {
    const origin = useOrigin();
    const update = useMutation(api.documents.update)

    const [copied, setCopied] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)
    
    const url = `${origin}/preview/${initialData._id}`
    
    const onPublish = () => {
        setisSubmitting(true)
        const promise = update({
            documentId: initialData._id,
            isPublished: true,
        })
        .finally(() => setisSubmitting(false))

        toast.promise(promise, {
            loading: "publishing this note...",
            success: "Note Published Successfully",
            error: "Failed to Publish Note",
        })
    }
    const onUnPublish = () => {
        setisSubmitting(true)
        const promise = update({
            documentId: initialData._id,
            isPublished: false,
        })
        .finally(() => setisSubmitting(false))

        toast.promise(promise, {
            loading: "Unpublishing this note...",
            success: "Note UnPublished Successfully",
            error: "Failed to UnPublish Note",
        })
    }

    const onCopy = () => {
        navigator.clipboard.writeText(url)

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"ghost"}>
            Publish
            {initialData.isPublished && <Globe className="text-sky-500 w-4 h-4 ml-2" /> }
        </Button>
      </PopoverTrigger>
    <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
            <div className="space-y-4 ">
                <div className="flex items-center gap-x-2">
                    <Globe className="text-sky-500 animate-pulse h-4 w-4 " />
                    <p className="text-xs font-medium text-sky-500 ">This Note is Live On Web</p>
                </div>
                <div className="flex items-center">
                    <input value={url} className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate" disabled />
                    <Button onClick={onCopy} disabled={copied} className="h-8 rounded-l-none">
                    {copied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                    </Button>
                </div>
                <Button size={"sm"} className="w-full text-xs" disabled={isSubmitting} onClick={onUnPublish}>
                    Un Publish
                </Button>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center">
                <Globe  className="h-8 w-8 text-muted-foreground mb-2"/>
                <p className="text-sm font-medium mb-2">Publish this Note</p>
                <span className="text-xs text-muted-foreground mb-4 ">Share your work with others</span>
                <Button disabled={isSubmitting} onClick={onPublish} className="w-full text-xs" size={"sm"} >
                    Publish
                </Button>
            </div>
        )}
    </PopoverContent>
    </Popover>
  )
}

export default Publish
