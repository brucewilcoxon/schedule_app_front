import axios from "axios";
import { DeleteNote, Favorite, Note, NoteWithFavorites } from "../types/Note";
import { API_ROUTES, apiClient } from "./commonApi";

export const getNotes = async (useId?: number) => {
  const { data } = await apiClient.get<NoteWithFavorites[]>(
    API_ROUTES.WIND_NOTE.LIST,
    {
      params: {
        user_id: useId,
      },
    }
  );
  return data;
};
export const createNote = async (values: Note) => {
  const { data } = await apiClient.post<Note>(API_ROUTES.WIND_NOTE.BASE, {
    title: values.title,
    content: values.content,
    date: values.date,
  });
  return data;
};

export const showNote = async (id: number) => {
  const { data } = await apiClient.get<NoteWithFavorites>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}`
  );
  return data;
};

export const updateNote = async ({
  id,
  values,
}: {
  id: number;
  values: Note;
}) => {
  const { data } = await apiClient.put<Note>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}`,
    values
  );
  return data;
};
export const deleteNote = async (id: number) => {
  const { data } = await apiClient.delete<DeleteNote>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}`
  );
  return data;
};

export const getFavorites = async (id: number) => {
  const { data } = await apiClient.get<Favorite[]>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}/favorites`
  );
  return data;
};

export const checkFavorite = async (id: number) => {
  const { data } = await apiClient.get<Favorite>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}/favorite`
  );
  return data;
};

export const updateFavorite = async (id: number) => {
  const { data } = await apiClient.put<Favorite>(
    `${API_ROUTES.WIND_NOTE.BASE}/${id}/favorite`
  );
  return data;
};
