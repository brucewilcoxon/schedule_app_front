import React, { useState } from "react";
import { WindAnswer, WindIdAnswer, WindIdQuestion } from "../types/Question";
import { useParams } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import AnserModal from "../components/AnswerModal";
import { useShowQuestion } from "../queries/QuestionQuery";
import Answer from "../components/Answer";
import QuestionAlertDialog from "../components/QuestionAlertDialog";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import EditQuestionModal from "../components/EditQuestionModal";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("ja");
const AnswerList = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);
  const { id } = useParams();
  const questionId = Number(id);
  const { data: question, isLoading } = useShowQuestion(questionId);
  const { data: user } = useGetUser();
  const answers = question?.answers;

  const clickModalOpen = () => {
    setModalOpen(true);
  };
  const clickModalClose = () => {
    setModalOpen(false);
  };
  const openDialog = () => {
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const clickAnswerOpen = () => {
    setIsAnswerOpen(true);
  };
  const clickAnswerClose = () => {
    setIsAnswerOpen(false);
  };

  const relativeTimeFromNow = dayjs(question?.created_at).fromNow();

  if (!question) return <div>Loading...</div>;

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <HeaderTab />
        <div className="border-b-2 pt-4 pb-2 px-2">
          <div className="flex justify-between">
            <div className="bg-red-600 rounded-lg w-[17%] items-center my-auto">
              <p className="text-white text-sm text-center">
                {relativeTimeFromNow}
              </p>
            </div>
            {user?.id === question?.user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <MoreHorizIcon className=" text-gray-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem
                    className="text-gray-600"
                    onSelect={openDialog}
                  >
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
            <p className="whitespace-pre-line break-all">{question?.content}</p>
          </div>
          <div className=" flex justify-end px-2 text-gray-500 space-x-3">
            <p>{dayjs(question?.created_at).format("YYYY年MM月DD日HH:mm")}</p>
            <div className="flex">
              <p>回答数</p>
              <p>{question?.answers.length}</p>
            </div>
            <button
              className="flex text-gray-500 font-nomal ml-3"
              onClick={clickAnswerOpen}
            >
              <p className="mr-1">回答する</p>
              <ChatBubbleOutlineIcon />
            </button>
          </div>
          <p className="text-gray-600">回答</p>
        </div>
        {answers?.map((answer) => <Answer key={answer.id} answer={answer} />)}
        <AnserModal
          modalOpen={isAnswerOpen}
          clickModalClose={clickAnswerClose}
          question_id={questionId}
        />
        <QuestionAlertDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          questionId={questionId}
        />
        <EditQuestionModal
          modalOpen={modalOpen}
          clickModalClose={clickModalClose}
          question={question}
        />
      </RequireAuth>
    </Layout>
  );
};

export default AnswerList;
