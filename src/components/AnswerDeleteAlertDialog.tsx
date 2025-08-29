import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../@/components/ui/alert-dialog";
import { useDeleteAnswer } from "../queries/AnswerQuery";
import { useNavigate } from "react-router-dom";
interface AnswerAlertDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  answerId: number;
}
const AnswerDeleteAlertDialog: React.FC<AnswerAlertDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  answerId,
}) => {
  const navigate = useNavigate();

  const deleteAnswer = useDeleteAnswer(navigate);

  const handleDeleteAnswer = () => {
    deleteAnswer.mutate(answerId);
    setIsDialogOpen(false);
  };
  return (
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
          <AlertDialogAction onClick={handleDeleteAnswer}>
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AnswerDeleteAlertDialog;
