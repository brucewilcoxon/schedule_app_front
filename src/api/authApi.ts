import axios from "axios";
import { User, LoginCredentials } from "../types/user";
import { API_ROUTES, apiClient, setAuthToken } from "./commonApi";
import { performLogoutCleanup } from "../utils/logoutUtils";
axios.defaults.withCredentials = true;

export const getUser = async () => {
  const { data } = await apiClient.get<User>(API_ROUTES.USER.GET);
  return data;
};

export const login = async (values: LoginCredentials) => {
  const { data } = await apiClient.post(API_ROUTES.AUTH.LOGIN, values);
  
  // Store the token if login is successful
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

export const signUp = async (values: LoginCredentials) => {
  const { data } = await apiClient.post<User>(API_ROUTES.AUTH.REGISTER, values);
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post<User>(API_ROUTES.AUTH.LOGOUT);
  
  // Perform all logout cleanup operations
  performLogoutCleanup();
  
  return data;
};
