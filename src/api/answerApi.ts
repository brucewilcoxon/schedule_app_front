import axios from "axios";
import { WindAnswer, WindIdAnswer } from "../types/Question";
import { API_ROUTES, apiClient } from "./commonApi";

export const getAnswers = async (userId?: number) => {
  const { data } = await apiClient.get<WindIdAnswer[]>(API_ROUTES.ANSWER.LIST, {
    params: {
      user_id: userId,
    },
  });
  return data;
};

export const createAnswer = async ({
  question_id,
  values,
}: {
  question_id: number;
  values: WindAnswer;
}) => {
  const { data } = await apiClient.post<WindAnswer>(API_ROUTES.ANSWER.BASE, {
    question_id: question_id,
    content: values.content,
  });
  return data;
};

export const updateAnswer = async ({
  id,
  values,
}: {
  id: number;
  values: WindAnswer;
}) => {
  const { data } = await apiClient.put<WindAnswer>(
    `${API_ROUTES.ANSWER.BASE}/${id}`,
    values
  );
  return data;
};

export const deleteAnswer = async (id: number) => {
  const { data } = await apiClient.delete<WindAnswer>(
    `${API_ROUTES.ANSWER.BASE}/${id}`
  );
  return data;
};
