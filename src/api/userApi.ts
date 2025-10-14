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
  role: string;
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
  role: string;
}) => {
  // Only include password in the request if it's provided and not empty
  const updateData = { ...userData };
  if (!updateData.password || updateData.password.trim() === '') {
    delete updateData.password;
  }
  
  const { data } = await apiClient.put<User>(API_ROUTES.USERS.UPDATE(userData.id), updateData);
  return data;
};

export const deleteUser = async (userId: number) => {
  console.log('API deleteUser called with userId:', userId);
  console.log('API route:', API_ROUTES.USERS.DELETE(userId));
  try {
    const { data } = await apiClient.delete(API_ROUTES.USERS.DELETE(userId));
    console.log('API deleteUser success:', data);
    return data;
  } catch (error) {
    console.error('API deleteUser error:', error);
    
    // Type guard to check if error has response property (Axios error)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      console.error('API error response:', axiosError.response);
      console.error('API error status:', axiosError.response?.status);
      console.error('API error data:', axiosError.response?.data);
    } else {
      console.error('Unknown error type:', error);
    }
    throw error;
  }
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
