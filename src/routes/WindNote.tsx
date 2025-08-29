import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useShowNote, useUpdateFavorite } from "../queries/NoteQuery";
import { Note, NoteWithFavorites } from "../types/Note";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import AnserModal from "../components/AnswerModal";
import QuestionAlertDialog from "../components/QuestionAlertDialog";
import NoteAlertDialog from "../components/DeleteAlertDialog";
import EditNoteModal from "../components/EditNoteModal";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import CircularProgress from "@mui/material/CircularProgress";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import dayjs from "dayjs";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

const WindNote = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnswerOpen, setIsAnswerOpen] = useState(false);
  const { id } = useParams();
  const noteId = Number(id);
  const { data: note, isFetching } = useShowNote(noteId);
  const { data: user } = useGetUser();
  const updateFavorite = useUpdateFavorite();
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

  if (!note || !user) {
    return <div>読み込み中...</div>;
  }
  const handleFavoriteClick = () => {
    updateFavorite.mutate(note.id);
  };
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <HeaderTab />
        <div className=" p-2 mb-[100px]">
          <div className="flex p-2 items-start justify-between">
            <div>
              <h1 className="font-bold text-lg">{note.title}</h1>
              <p className="whitespace-pre-line break-all">{note.content}</p>
            </div>
            {user?.id === note.user.id && (
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
          <div className="flex items-center justify-end space-x-3 text-gray-500">
            <p>{dayjs(note.date).format("YYYY年M月D日")}</p>
            <div className="flex items-center">
              {/* <Avatar sx={{ height: "25px", width: "25px" }} /> */}
              <p className="text-gray-500">{note.user?.user_profile?.name}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleFavoriteClick}
                disabled={updateFavorite.isLoading}
              >
                {isFetching || updateFavorite.isLoading ? (
                  <CircularProgress size={24} />
                ) : note.is_favorited ? (
                  <FavoriteIcon className="text-red-500 mr-1" />
                ) : (
                  <FavoriteBorderIcon className="mr-1" />
                )}
              </button>
              <p className="w-[1em]">{note.favorites_count}</p>
              <button>
                <BookmarkBorderIcon />
              </button>
            </div>
          </div>
        </div>
        <NoteAlertDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          noteId={noteId}
        />
        <EditNoteModal
          modalOpen={modalOpen}
          clickModalClose={clickModalClose}
          note={note}
        />
      </RequireAuth>
    </Layout>
  );
};

export default WindNote;
