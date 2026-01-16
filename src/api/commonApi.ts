import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes timeout for long operations like file uploads
});

// Function to set the authorization token
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
};

// Function to clear all authentication state
export const clearAuthState = () => {
  setAuthToken(null);
  
  // Clear all cookies
  const cookies = document.cookie.split(";");
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    const paths = ['/', '/api', '/sanctum'];
    const domains = ['', window.location.hostname, '.' + window.location.hostname];
    
    paths.forEach(path => {
      domains.forEach(domain => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`;
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=lax`;
      });
    });
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
};

// Store reference to auth state setter (will be set by AuthProvider)
let authStateSetter: ((user: any) => void) | null = null;
let authClearer: (() => void) | null = null;
let authNavigator: ((path: string) => void) | null = null;

export const setAuthStateCallbacks = (
  setUser: (user: any) => void,
  clearAuth: () => void,
  navigate: (path: string) => void
) => {
  authStateSetter = setUser;
  authClearer = clearAuth;
  authNavigator = navigate;
};

// Request interceptor: Add token to requests if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Token is already set via setAuthToken, but ensure it's always fresh
    const token = localStorage.getItem('auth_token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear all auth state
      clearAuthState();
      
      // Clear auth context if callbacks are set
      if (authClearer) {
        authClearer();
      }
      
      // Redirect to login if not already there
      const currentPath = window.location.pathname;
      const publicRoutes = ['/login', '/signUp'];
      if (!publicRoutes.includes(currentPath) && authNavigator) {
        authNavigator('/login');
      }
    }
    
    return Promise.reject(error);
  }
);

// Initialize token from localStorage if available (for initial requests)
// But note: AuthInitializer will verify this token before rendering
const token = localStorage.getItem('auth_token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Function to upload profile image
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await apiClient.post(API_ROUTES.USER.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      timeout: 300000, // 5 minutes timeout for file uploads
    });
    return response.data;
  } catch (error: any) {
    console.error('Image upload error:', error);
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('アップロードがタイムアウトしました。ファイルサイズが大きすぎるか、ネットワーク接続に問題がある可能性があります。');
    }
    
    throw error;
  }
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/login',
    LOGOUT: '/api/logout',
    REGISTER: '/api/register',
  },
  USER: {
    GET: '/api/user',
    PROFILE: '/api/profile',
    UPLOAD_IMAGE: '/api/profile/upload-image',
  },
  USERS: {
    INDEX: '/api/users',
    GRADE_FILTER: '/api/users/gradeFilter',
    STORE: '/api/users',
    UPDATE: (id: number) => `/api/users/${id}`,
    DELETE: (id: number) => `/api/users/${id}`,
  },
  ANSWER: {
    LIST: "/api/answers",
    BASE: "/api/answer",
  },
  CALENDAR: {
    LIST: "/api/calendar",
    CREATE: "/api/calendar",
    BASE: "/api/calendar",
  },
  INTRA_CLAIM: {
    LIST: "/api/intraClaims",
    BASE: "/api/intraClaim",
    APPROVE: "/api/approveClaim",
    REJECT: "/api/rejectClaim",
  },
  WIND_NOTE: {
    LIST: "/api/windNotes",
    BASE: "/api/windNote",
    FAVORITES: "/api/windNote",
    FAVORITE: "/api/windNote",
  },
  NOTIFICATION: {
    LIST: "/api/notifications",
    READ: "/api/notification",
    ALL_READ: "/api/notifications/read-all",
  },
  QUESTION: {
    LIST: "/api/questions",
    BASE: "/api/question",
  },
  GAS: {
    INDEX: '/api/gas',
    STORE: '/api/gas',
    UPDATE: (id: number) => `/api/gas/${id}`,
    DELETE: (id: number) => `/api/gas/${id}`,
  },
  PREFECTURES: {
    INDEX: '/api/prefectures',
  },
  REPAIR_TYPE_OPTION: {
    INDEX: '/api/repair-type-options',
    BASE: '/api/repair-type-options',
    UPDATE: (id: number) => `/api/repair-type-options/${id}`,
    DELETE: (id: number) => `/api/repair-type-options/${id}`,
  }
} as const;
