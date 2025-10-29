import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { WindAnswer, WindIdAnswer } from "../types/Question";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { Link } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import { useGetUser } from "../queries/AuthQuery";
import AnswerDeleteAlertDialog from "./AnswerDeleteAlertDialog";
import EditAnswerModal from "./EditAnswerModal";
dayjs.extend(relativeTime);
dayjs.locale("ja");
interface AnswerProps {
  answer: WindIdAnswer;
}

const Answer: React.FC<AnswerProps> = ({ answer }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const clickModalOpen = () => {
    setModalOpen(true);
  };
  const clickModalClose = () => {
    setModalOpen(false);
  };

  const { data: user } = useGetUser();

  const relativeTimeFromNow = dayjs(answer.created_at).fromNow();
  return (
    <div className="border-b p-2 py-4">
      <div className="flex justify-between">
        <div className="bg-red-600 rounded-lg w-[17%] items-center my-auto">
          <p className="text-white text-sm text-center">
            {relativeTimeFromNow}
          </p>
        </div>
        {user?.id === answer.user?.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <MoreHorizIcon className="text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem className="text-gray-600" onSelect={openDialog}>
                削除
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={clickModalOpen}
                className="text-gray-600"
              >
                編集
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="px-3 my-5">
        <h1 className="whitespace-pre-line break-all">{answer.content}</h1>
      </div>
      <div className="flex items-center justify-end space-x-3">
        <p className="text-gray-500 w-[50%]">
          {dayjs(answer.created_at).format("YYYY年MM月DD日HH:mm")}
        </p>
      </div>
      <AnswerDeleteAlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        answerId={answer.id}
      />
      <EditAnswerModal
        modalOpen={modalOpen}
        clickModalClose={clickModalClose}
        answer={answer}
      />
    </div>
  );
};

export default Answer;
