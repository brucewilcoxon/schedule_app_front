import axios from "axios";

// Normalize API base URL to handle various input formats
const normalizeApiBaseUrl = (url: string | undefined): string => {
  if (!url) {
    return 'http://127.0.0.1:8000';
  }
  
  // Remove any trailing slashes, colons, or whitespace
  let normalized = url.trim().replace(/[/:]+$/, '');
  
  // If it doesn't start with http:// or https://, add http://
  if (!normalized.match(/^https?:\/\//)) {
    // If it starts with a protocol-like pattern, keep it, otherwise add http://
    if (!normalized.includes('://')) {
      normalized = `http://${normalized}`;
    }
  }
  
  // Remove any trailing path segments that might cause issues
  normalized = normalized.split('/').slice(0, 3).join('/');
  
  return normalized;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.REACT_APP_API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 300000, // 5 minutes timeout for long operations like file uploads
});

// Add request interceptor to validate and log URLs
apiClient.interceptors.request.use(
  (config) => {
    // Ensure the URL is properly constructed
    if (config.url) {
      // If the URL doesn't start with /, it might be malformed
      if (!config.url.startsWith('/')) {
        console.warn('API URL does not start with /:', config.url);
      }
      
      // Log the full URL for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        const fullUrl = config.baseURL + config.url;
        console.log('API Request:', config.method?.toUpperCase(), fullUrl);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors better
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error information
    if (error.config) {
      const fullUrl = error.config.baseURL + error.config.url;
      console.error('API Error:', {
        method: error.config.method?.toUpperCase(),
        url: fullUrl,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);

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

// Initialize token from localStorage if available
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
    LIST: "/api/calendars",
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
