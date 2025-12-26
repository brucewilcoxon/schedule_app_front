import axios from "axios";
import { User, LoginCredentials } from "../types/user";
import { API_ROUTES, apiClient, setAuthToken } from "./commonApi";
import { clearAllAuthData } from "../utils/cookieUtils";
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
  
  // Clear the auth token
  setAuthToken(null);
  
  // Clear all authentication data (cookies, localStorage, sessionStorage)
  clearAllAuthData();
  
  // Clear any potential authentication headers
  if (apiClient.defaults.headers.common['Authorization']) {
    delete apiClient.defaults.headers.common['Authorization'];
  }
  
  // Clear XSRF token from axios defaults
  if (apiClient.defaults.headers.common['X-XSRF-TOKEN']) {
    delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
  }
  
  return data;
};
