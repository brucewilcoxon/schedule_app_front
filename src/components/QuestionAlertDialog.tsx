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
import { useDeleteQuestion } from "../queries/QuestionQuery";
import { useNavigate } from "react-router-dom";

interface QuestionAlertDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  questionId: number;
}

const QuestionAlertDialog: React.FC<QuestionAlertDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  questionId,
}) => {
  const navigate = useNavigate();

  const deleteQuestion = useDeleteQuestion(navigate);

  const handleDeleteNote = () => {
    deleteQuestion.mutate(questionId);
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

export default QuestionAlertDialog;
