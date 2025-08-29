import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../@/components/ui/alert-dialog";
import { useDeleteNote } from "../queries/NoteQuery";
import { useNavigate } from "react-router-dom";

interface NoteAlertDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  noteId: number;
}

const DeleteAlertDialog: React.FC<NoteAlertDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  noteId,
}) => {
  const navigate = useNavigate();

  const deleteNote = useDeleteNote(navigate);

  const handleDeleteNote = () => {
    deleteNote.mutate(noteId);
    setIsDialogOpen(false);
  };
  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className=" font-normal">
              本当に削除しますか？
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteAlertDialog;
