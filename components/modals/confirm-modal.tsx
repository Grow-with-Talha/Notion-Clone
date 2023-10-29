"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface confirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
}

const ConfirmModal = ({ children, onConfirm} : confirmModalProps) => {
    const handleConfirm = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        onConfirm();
    }
  return (
    <AlertDialog>
        <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
            {children}
        </AlertDialogTrigger>


        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                Are you Absoloutely Sure?
                </AlertDialogTitle>
            <AlertDialogDescription>
                This Action cannot be Undone.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirm}>
                    Confirm
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
};

export default ConfirmModal;
