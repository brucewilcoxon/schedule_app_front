import axios from "axios";
import { User, LoginCredentials } from "../types/user";
import { API_ROUTES, apiClient, setAuthToken, clearAuthState } from "./commonApi";
axios.defaults.withCredentials = true;

/**
 * Get current authenticated user from the API.
 * This is the SINGLE SOURCE OF TRUTH for authentication state.
 */
export const getUser = async (): Promise<User> => {
  const { data } = await apiClient.get<User>(API_ROUTES.USER.GET);
  return data;
};

/**
 * Login and store the token.
 * The token will be verified by AuthInitializer on next render.
 */
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

/**
 * Logout and clear all authentication state.
 * The AuthContext will be updated via the 401 interceptor or explicit clear.
 */
export const logout = async () => {
  try {
    // Call logout endpoint to invalidate token on server
    await apiClient.post<User>(API_ROUTES.AUTH.LOGOUT);
  } catch (error) {
    // Even if logout fails, clear local state
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local auth state
    clearAuthState();
  }
};
