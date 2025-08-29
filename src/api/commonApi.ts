import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
    });
    return response.data;
  } catch (error) {
    console.error('Image upload error:', error);
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
  DEPARTURE: {
    LIST: "/api/departures",
    BASE: "/api/departure",
    RANKINGS: "/api/departures/rankings",
    STATUS: "/api/departures/status",
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
} as const;
