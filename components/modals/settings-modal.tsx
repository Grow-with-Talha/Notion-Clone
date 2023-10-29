"use client";

import { Dialog, DialogContent, DialogHeader,  } from "../ui/dialog";
import { useSettings } from "@/hooks/use-settings";
import { Label } from "../ui/label";
import { ModeToggle } from "../mode-toggle";



const SettingsModal = () => {
    const settings = useSettings();

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose} >
        <DialogContent>
            <DialogHeader className="border-b pb-3">
                <h2 className="text-lg font-medium">My Settings</h2>
            </DialogHeader>
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-1">
                    <Label>
                        Appereance
                    </Label>
                    <span className="text-sm text-muted-foreground">
                        Costomize how Potion looks On your Device.
                    </span>
                </div>
                <ModeToggle />
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
