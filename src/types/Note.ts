import { User } from "./user";

export interface Note {
  title: string;
  date: string;
  content: string;
  images?: string[];
}

export interface DeleteNote {
  id: number;
  title: string;
  content: string;
  date: string;
  images?: string[];
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
  images?: string[];
}

export interface Favorite {
  user_id: number;
  note_id: number;
}
