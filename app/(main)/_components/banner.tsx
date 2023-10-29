"use client";

import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/modals/confirm-modal";


interface BannerProps {
    documentId: Id<"documents">
}

const Banner = ({
    documentId
} : BannerProps) => {
  const router = useRouter()
  const remove = useMutation(api.documents.remove)
  const restore = useMutation(api.documents.restore)

  const onRemove = () => {
    const promise = remove({
      id: documentId,
    })    
    toast.promise(promise, {
      loading: "Removing the Note permanntly",
      success: "Note Removed Permanentely",
      error: "failed to delete Note"
    })
    router.push("/documents")
  }
  const onRestore = () => {
    const promise = restore({
      id: documentId,
    })

    toast.promise(promise, {
      loading: "Restoring the Note...",
      success: "Note Restored succesfully",
      error: "failed to Restore Note",
    })
  }

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center justify-center gap-x-2">
      <p>
        This Page is in the Trash
      </p>
      <Button onClick={onRestore} variant={"outline"} size={"sm"} className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
      <Button variant={"outline"} size={"sm"} className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal">
        Delete Page forever
      </Button>
      </ConfirmModal>
    </div>
  )
}

export default Banner
