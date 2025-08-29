import axios from "axios";
import { Profile, User } from "../types/user";
import { API_ROUTES, apiClient } from "./commonApi";

export const getSeniorUsers = async () => {
  const { data } = await apiClient.get<User[]>(API_ROUTES.USERS.GRADE_FILTER);
  return data;
};

export const getUsers = async () => {
  const { data } = await apiClient.get<User[]>(API_ROUTES.USERS.INDEX);
  return data;
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
  gender: string;
  age: string;
  introduction?: string;
}) => {
  const { data } = await apiClient.post<User>(API_ROUTES.USERS.STORE, userData);
  return data;
};

export const updateUser = async (userData: {
  id: number;
  email: string;
  password?: string;
  name: string;
  gender: string;
  age: string;
  introduction?: string;
}) => {
  const { data } = await apiClient.put<User>(API_ROUTES.USERS.UPDATE(userData.id), userData);
  return data;
};

export const deleteUser = async (userId: number) => {
  const { data } = await apiClient.delete(API_ROUTES.USERS.DELETE(userId));
  return data;
};

export const createUserProfile = async (values: Profile) => {
  const { data } = await apiClient.post<Profile>(API_ROUTES.USER.PROFILE, {
    name: values.name,
    gender: values.gender,
    age: values.age,
    introduction: values.introduction,
    profile_image: values.profile_image,
  });
  return data;
};
