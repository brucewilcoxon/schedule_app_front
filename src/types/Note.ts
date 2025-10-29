import { number } from "zod";
import { User } from "./user";

export interface Note {
  title: string;
  date: string;
  content: string;
}

export interface DeleteNote {
  id: number;
  title: string;
  content: string;
  date: string;
}
export interface NoteWithFavorites {
  id: number;
  user: User;
  title: string;
  content: string;
  date: string;
  is_favorited: boolean;
  favorites_count: number;
  note_favorites: Favorite[];
}

export interface Favorite {
  user_id: number;
  note_id: number;
}
