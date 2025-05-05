import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiRequest } from "@/lib/queryClient";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentId: number;
  studentName: string;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  studentId,
  studentName
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Delete student mutation
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", `/api/students/${studentId}`);
      return response.json();
    },
    onSuccess: () => {
      setIsDeleting(false);
      onConfirm();
    },
    onError: (error: Error) => {
      setIsDeleting(false);
      console.error("Error deleting student:", error);
    },
  });

  // Confirm deletion handler
  const handleDelete = () => {
    setIsDeleting(true);
    mutation.mutate();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4 text-destructive">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <AlertDialogTitle className="text-center">Delete Student Record</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete the record for <span className="font-semibold">{studentName}</span>? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-center gap-2">
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
