import axios from "axios";
import { WindIdQuestion, WindQuestion } from "../types/Question";
import { API_ROUTES, apiClient } from "./commonApi";

export const getQuestions = async (userId?: number) => {
  const { data } = await apiClient.get<WindIdQuestion[]>(
    API_ROUTES.QUESTION.LIST,

    {
      params: {
        user_id: userId,
      },
    }
  );
  return data;
};

export const createQuestion = async (values: WindQuestion) => {
  const { data } = await apiClient.post<WindQuestion>(
    API_ROUTES.QUESTION.BASE,
    {
      content: values.content,
    }
  );
  return data;
};

export const showQuestion = async (id: number) => {
  const { data } = await apiClient.get<WindIdQuestion>(
    `${API_ROUTES.QUESTION.BASE}/${id}`
  );
  return data;
};

export const updateQuestion = async ({
  id,
  values,
}: {
  id: number;
  values: WindQuestion;
}) => {
  const { data } = await apiClient.put<WindQuestion>(
    `${API_ROUTES.QUESTION.BASE}/${id}`,
    values
  );
  return data;
};

export const deleteQuestion = async (id: number) => {
  const { data } = await apiClient.delete<WindIdQuestion>(
    `${API_ROUTES.QUESTION.BASE}/${id}`
  );
  return data;
};
