"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react"
import { useUser } from "@clerk/clerk-react";
import { ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import React from "react";

interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}
const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  documentIcon,
  active,
  expanded,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) => {
  const create = useMutation(api.documents.create)
  const Archive = useMutation(api.documents.Archive)
  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if(!id) return;

    const promise = Archive({id})
    toast.promise(promise, {
      loading: "Deleting the Note.....",
      success: "Note Deleted Succesfully.",
      error: "failed to move to trash",
    })
  }
  const { user } = useUser()
  const router = useRouter()
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
      event.stopPropagation()
      onExpand?.()
  }
  
  const onCreate =  (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    if(!id) {return}
    const promise = create({ title: "untitled", parentDocument: id}).then((documentId) => {
      if(!expanded) {
        onExpand?.()
      }
      // router.push(`/documents/${documentId}`)
    })
    toast.promise(promise, {
      loading: "Creating a new note....",
      success: "New Note Created!!!",
      error: "Failed to create a new Note!!"
    })
  }
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
  

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div role="button" className="bg-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1" onClick={handleExpand}>
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
            {documentIcon}
        </div>
      ) : (
          <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ">
            <span className="text-xs">⌘</span>k
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
              <div role="button" >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground"  />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 " align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last Edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div role="button" onClick={ onCreate } className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};


Item.Skeleton = function ItemSkeleton ({level} : { level: number}) {
  return (
    <div style={{
      paddingLeft: level ? `${(level * 12) + 25}px` : "12px"  }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4 " />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  )
}

export default Item;
