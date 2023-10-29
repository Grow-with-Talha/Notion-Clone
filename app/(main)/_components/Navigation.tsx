"use client"
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, ElementRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { toast } from 'sonner'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { useMutation } from "convex/react"
import UserItems from './user-item'
import { api } from '@/convex/_generated/api'
import Item from './Item'
import DocumentList from './Document-list'
import { useSearch } from '@/hooks/use-search'
import { useSettings } from '@/hooks/use-settings'
import TrashBar from './Trash-Bar'
import Navbar from './Navbar'

const Navigation = () => {
  const pathName = usePathname();
  const params = useParams()
  const search = useSearch();
  const settings = useSettings();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const create = useMutation(api.documents.create)
  const isResizinref = useRef(false);
  const sidebarref = useRef<ElementRef<"aside">>(null);
  const navbarref = useRef<ElementRef<"div">>(null);
  const [isresetting, setisResetting] = useState(false);
  const [isCollapsed, setisCollapsed] = useState(isMobile);

  useEffect(() => {
    if(isMobile){
      collapse()
    } else{
      resetWidth()
    }
  }, [isMobile])

  useEffect(() => {
    if(isMobile) {
      collapse
    }
  }, [pathName, isMobile])

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizinref.current = true
    document.addEventListener("mousemove", handlemousemove)
    document.addEventListener("mouseup", handlemouseup)
  }

  const handlemousemove = (event: MouseEvent) => {
    if(!isResizinref.current) return;
    let newWidth = event.clientX;

    if(newWidth < 240 ) newWidth = 240;
    if(newWidth > 480) newWidth = 480;

    if(sidebarref.current && navbarref.current) {
      sidebarref.current.style.width = `${newWidth}px`
      navbarref.current.style.setProperty("left", `${newWidth}px`)
      navbarref.current.style.setProperty("width", `calc(100% - ${newWidth}px)`)
    }
  }
  const handlemouseup = () => {
    isResizinref.current = false;
    document.removeEventListener('mousemove', handlemousemove)
    document.removeEventListener('mouseup', handlemouseup)
  }

  const resetWidth = () => {

    if(sidebarref.current && navbarref.current){
      setisCollapsed(false)
      setisResetting(true)

      sidebarref.current.style.width = isMobile ? "100%" : "240px"
      navbarref.current.style.setProperty("width",
      isMobile ? "0" : "calc(100% - 240px)"
      )
      navbarref.current.style.setProperty(
      "left",
      isMobile ? "100%" : "240px"
      );
      setTimeout(() => {
        setisResetting(false)
      }, 300);
    }
  }

  const collapse = () => {
    if(sidebarref.current && navbarref.current) {
      setisCollapsed(true)
      setisResetting(true)

      sidebarref.current.style.width = "0"
      navbarref.current.style.setProperty("width", "100%")
      navbarref.current.style.setProperty("left", "0")

      setTimeout(() => {
        setisResetting(false)
      }, 300);

    }
  }

  const handleCreate = () => {
    const promise = create({title: "untitled"});

    toast.promise(promise, {
      loading: "Creating a New Note...",
      success: "New Note Created",
      error: "Failed to create a new note"
    })

  }

  return (
    <>
    <aside ref={sidebarref} className={cn(
      'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
      isresetting && "transition-all ease-in-out duration-300",
      isMobile && "w-0"
      )}>
      <div
       role='button'
       onClick={collapse}
       className={cn(
        'w-6 h-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
        isMobile && "opacity-100"
       )}
      >
        
        <ChevronsLeft className='h-6 w-6' />
      </div>
      <div>
        <UserItems />
        <Item label='Search' icon={Search} isSearch onClick={search.onOpen} />
        <Item label='Settings' icon={Settings} onClick={settings.onOpen} />
        <Item onClick={handleCreate} label={"New Page"} icon={PlusCircle} /> 
      </div>
      <div className='mt-4 '>
        <DocumentList />
        <Item onClick={handleCreate} label='Create New Note' icon={Plus} />
        <Popover>
          <PopoverTrigger className='w-full mt-4'>
            <Item label='Trash' icon={Trash}  />
          </PopoverTrigger>
          <PopoverContent side={isMobile ? "bottom" : "right"} className='p-0 w-72'>
            <TrashBar />
          </PopoverContent>
        </Popover>
      </div>
      <div
        onMouseDown={handleMouseDown}
        onClick={resetWidth}
        className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
      />
    </aside>
    <div ref={navbarref} className={cn(
      "absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]",
      isresetting && "transition-all ease-in-out duration-300",
      isMobile && 'left-0 w-full'
    )}>
      {!!params.documentid ? (
        <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
      ) : (
      <nav className='bg-transparent px-3 py-2 w-full'>
        {isCollapsed && <MenuIcon onClick={resetWidth} role='button' className='h-6 w-6 text-muted-foreground' />}
      </nav>
      )}
    </div>
    </>
  )
}

export default Navigation
