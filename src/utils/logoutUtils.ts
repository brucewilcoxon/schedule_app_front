import { apiClient, setAuthToken, API_ROUTES } from "../api/commonApi";
import { QueryClient } from "react-query";

/**
 * Clears all cookies with different path and domain combinations
 */
export const clearAllCookies = () => {
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

/**
 * Force clears specific cookie names that might have been missed
 */
export const forceClearCookies = () => {
  const cookieNames = [
    'XSRF-TOKEN',
    'laravel_session',
    'windap_session',
    'remember_web',
    'remember_token',
    'session',
    'auth'
  ];
  
  cookieNames.forEach(name => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/api`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/sanctum`;
  });
};

/**
 * Clears authentication headers from axios client
 */
export const clearAuthHeaders = () => {
  if (apiClient.defaults.headers.common['Authorization']) {
    delete apiClient.defaults.headers.common['Authorization'];
  }
  
  if (apiClient.defaults.headers.common['X-XSRF-TOKEN']) {
    delete apiClient.defaults.headers.common['X-XSRF-TOKEN'];
  }
};

/**
 * Performs all synchronous logout cleanup operations
 * This can be called from beforeunload event where async operations may not complete
 */
export const performLogoutCleanup = (queryClient?: QueryClient) => {
  // Clear the auth token
  setAuthToken(null);
  
  // Clear all cookies
  clearAllCookies();
  forceClearCookies();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear authentication headers
  clearAuthHeaders();
  
  // Clear React Query cache if available
  if (queryClient) {
    queryClient.clear();
    queryClient.invalidateQueries("user");
  }
};

/**
 * Sends logout request using fetch with keepalive or navigator.sendBeacon for use in beforeunload event
 * This ensures the request is sent even when the page is closing
 */
export const sendLogoutBeacon = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
  const logoutUrl = `${API_BASE_URL}${API_ROUTES.AUTH.LOGOUT}`;
  
  // Get CSRF token from cookies if available
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  
  // Prepare headers for fetch
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (csrfToken) {
    headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
  }
  
  // Try fetch with keepalive first (better Laravel compatibility with headers)
  if (typeof fetch !== 'undefined') {
    try {
      fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include',
        keepalive: true,
        headers: headers,
        body: JSON.stringify({}),
      }).catch(() => {
        // Ignore errors during page unload
      });
      return; // Return early if fetch is available
    } catch (e) {
      // Fall through to sendBeacon
    }
  }
  
  // Fallback to sendBeacon (works even when page is unloading, but limited header support)
  if (navigator.sendBeacon) {
    try {
      // sendBeacon works best with FormData or Blob
      const formData = new FormData();
      if (csrfToken) {
        formData.append('_token', decodeURIComponent(csrfToken));
      }
      
      navigator.sendBeacon(logoutUrl, formData);
    } catch (e) {
      // Ignore errors during page unload
    }
  }
};

