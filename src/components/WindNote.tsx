import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { NoteWithFavorites } from "../types/Note";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import EditNoteModal from "./EditNoteModal";
import DeleteAlertDialog from "./DeleteAlertDialog";
import { Link } from "react-router-dom";
import { User } from "../types/user";
import dayjs from "dayjs";
import { useUpdateFavorite } from "../queries/NoteQuery";
import CircularProgress from "@mui/material/CircularProgress";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const WindNote = ({
  note,
  user,
  isFetching,
}: {
  note: NoteWithFavorites;
  user?: User;
  isFetching: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const updateFavorite = useUpdateFavorite();
  const handleFavoriteClick = () => {
    updateFavorite.mutate(note.id);
  };

  return (
    <>
      <div className="border-b p-2 py-4">
        <div className="flex justify-between items-stretch">
          <Link to={`/windNote/${note.id}`}>
            <h1 className="font-bold text-lg">{note.title}</h1>
            <p>
              {note.content.length > 15
                ? `${note.content.slice(0, 15)}...`
                : note.content}
            </p>
          </Link>
          {user?.id === note.user?.id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button>
                  <MoreHorizIcon className="text-gray-600" />
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
      <DeleteAlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        noteId={note.id}
      />
      <EditNoteModal
        modalOpen={modalOpen}
        clickModalClose={clickModalClose}
        note={note}
      />
    </>
  );
};

export default WindNote;
