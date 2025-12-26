import axios from "axios";
import { User, LoginCredentials } from "../types/user";
import { API_ROUTES, apiClient, setAuthToken } from "./commonApi";
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
  
  // Clear all cookies after logout with proper path and domain handling
  const clearAllCookies = () => {
    const cookies = document.cookie.split(";");
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Clear cookie with different path and domain combinations
      const paths = ['/', '/api', '/sanctum'];
      const domains = ['', window.location.hostname, '.' + window.location.hostname];
      
      paths.forEach(path => {
        domains.forEach(domain => {
          // Clear with different expiration methods
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=lax`;
        });
      });
    });
  };
  
  clearAllCookies();
  
  // Clear localStorage and sessionStorage (but keep auth_token for now as it's handled by setAuthToken)
  sessionStorage.clear();
  
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
