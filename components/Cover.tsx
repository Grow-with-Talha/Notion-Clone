"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

const Cover = ({ url, preview } : CoverProps) => {
  const { edgestore } = useEdgeStore()
  const coverImage = useCoverImage()
  const removecoverImage = useMutation(api.documents.removeCoverImage)
  const params = useParams()

  const onRemoveImage = async () => {
    if(url) {
      await edgestore.publicFiles.delete({
        url: url
      })
    }
    removecoverImage({
      id: params.documentid as Id<"documents">,
    })

  }
  return (
    <div className={cn("relative w-full h-[35vh] group",
    !url && 'h-[12vh]',
    url && "bg-muted"
    )}>
      {!!url && (
        <Image src={url} fill className="object-cover" alt="cover"/>
      )}
      {url && !preview &&(
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button onClick={() => coverImage.onReplace(url)} variant={"outline"} size={"sm"} className="text-muted-foreground text-xs">
            <ImageIcon className="h-4 w-4 mr-2"/>
            Change Cover Image
          </Button>
          <Button onClick={onRemoveImage} variant={"outline"} size={"sm"} className="text-muted-foreground text-xs">
            <X className="h-4 w-4 mr-2"/>
            Remove
          </Button>

        </div>
      )}
    </div>
  )
}

export default Cover


Cover.Skeleton = function CoverSkeleton () {
  return(
    <Skeleton className="w-full h-[12vh]" />
  )
}
