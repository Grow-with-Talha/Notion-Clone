import { Doc } from '@/convex/_generated/dataModel'
import React, { ElementRef, useRef, useState } from 'react'
import { ImageIcon, SmileIcon, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import TextareaAutoSize from "react-textarea-autosize"
import IconPicker from './icon-picker';
import { Button } from './ui/button';
import { api } from '@/convex/_generated/api';



interface ToolbarProps {
    initialData: Doc<"documents">;
    preview?: boolean;
}
const Toolbar = ({ initialData, preview } : ToolbarProps) => {
    const inputRef = useRef<ElementRef<"textarea">>(null)
    const [isEditing, setisEditing] = useState(false)
    const [value, setValue] = useState(initialData.title)

    const update = useMutation(api.documents.update)
    const RemoveIcon = useMutation(api.documents.removeIcon)

    const EnableInput = () => {
        if(preview) return;

        setisEditing(true);
        setTimeout(() => {
            setValue(initialData.title);
                inputRef.current?.focus()
        }, 0);
    }

    const DisableInput = () => {
        setisEditing(false)
    }
    const onInput = (value: string) => {
        setValue(value);
        update({
            documentId: initialData._id,
            title: value || "untitled",
        })
    }
    
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.key === "Enter") {
            event.preventDefault();
            DisableInput()
        }
    }
    
    const onIconSelect = (icon: string) => {
        update({
            documentId: initialData._id,
            icon: icon,
        })
    }

    const onRemoveIcon = () => {
        RemoveIcon({
            id: initialData._id
        })
    }
    
    
    
    
  return (
    <div className='pl-[54px] group relative'>
        {!!initialData.icon && !preview && (
            <div className='flex items-center gap-x-2 group/icon pt-6'>
                <IconPicker onChange={onIconSelect}>
                    <p className='text-6xl hover:opacity-75 transition'>{initialData.icon}</p>
                </IconPicker>
                <Button onClick={onRemoveIcon} className='rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs' variant={"outline"} size={'icon'}>
                    <X className='h-4 w-4'/>
                </Button>
            </div>
        )}
        {!!initialData.icon && preview && (
            <p className='text-6xl pt-6'>
                {initialData.icon}
            </p>
        )}
        <div className='opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4'>
            {!initialData.icon && !preview && (
                <IconPicker onChange={onIconSelect} asChild>
                    <Button className='text-muted-foreground text-xs' variant={'outline'} size={'sm'}>
                        <SmileIcon className='h-4 w-4 mr-2' />
                        Add Icon
                    </Button>
                </IconPicker>
            )}
            {!initialData.coverImage && !preview && (
                <Button onClick={() => {}} variant={"outline"} size={"sm"} className='text-muted-foreground text-xs'>
                    <ImageIcon  className='h-4 w-4 mr-2'/>
                    Add Cover
                </Button>
            )}
            
        </div>
        {isEditing && !preview ? (
                <TextareaAutoSize
                    ref={inputRef}
                    onBlurCapture={DisableInput}
                    onKeyDown={onKeyDown}
                    value={value}
                    onChange={(e) => onInput(e.target.value)}
                    className='text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none'
                    />
            ) : (
                <div onClick={EnableInput} className='pb-[11.5px] text-5xl break-words text-[#3f3f3f] dark:text-[#cfcfcf] font-bold'>
                    {initialData.title}
                </div>
            )}
    </div>
  )
}

export default Toolbar