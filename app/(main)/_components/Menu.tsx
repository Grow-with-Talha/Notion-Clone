"use client"

import { Id } from "@/convex/_generated/dataModel"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/clerk-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface MenuProps {
    documentid: Id<"documents">
}
const Menu = ({ documentid } : MenuProps) => {
    const router = useRouter()
    const { user } = useUser()
    const document = useQuery(api.documents.getById, {
        documentId: documentid as Id<"documents">,
    })

    const archive = useMutation(api.documents.Archive)
    const onArchive = () => {
        const promise = archive({ id: documentid})

        toast.promise(promise, {
            loading: "Moving to Trash...",
            success: "Moved Note to Trash successfully.",
            error: "Failed to Move Note to Trash."
        })
        router.push("/documents")
    }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"}>
            <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" alignOffset={8} forceMount>
        <DropdownMenuItem onClick={onArchive}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
            Last Edited By: {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Menu

Menu.Skeleton = function MenuSkeleton () {
    return(
        <Skeleton className="h-10 w-10" />
    )
}