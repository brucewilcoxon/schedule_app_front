import { API_ROUTES } from "../api/commonApi";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Clears all authentication-related storage (localStorage, sessionStorage, cookies)
 */
const clearAuthStorage = () => {
  // Clear auth token from localStorage
  localStorage.removeItem('auth_token');
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear all cookies with different path and domain combinations
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
};


/**
 * Handles logout when browser tab is closed
 * @param event - The PageTransitionEvent from pagehide event
 */
const handleTabClose = (event: PageTransitionEvent) => {
  // Check if user is authenticated
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return;
  }
  
  // If event.persisted is true, the page is being cached (back/forward navigation)
  // We don't want to logout in this case
  if (event.persisted) {
    return;
  }
  
  // Store token before clearing storage (needed for API call)
  const authToken = token;
  
  // Clear storage immediately (synchronous operation)
  clearAuthStorage();
  
  // Call logout API with stored token (asynchronous, but will complete with keepalive)
  const logoutUrl = `${API_BASE_URL}${API_ROUTES.AUTH.LOGOUT}`;
  fetch(logoutUrl, {
    method: 'POST',
    credentials: 'include', // Include cookies
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
    keepalive: true, // Critical: ensures request completes even after tab closes
  }).catch((error) => {
    // Silently fail - tab is closing anyway
    console.debug('Logout API call failed on tab close:', error);
  });
};

/**
 * Initializes the logout handler for tab close events
 * Should be called once when the app initializes
 */
export const setupLogoutOnClose = () => {
  // Use pagehide event instead of beforeunload for better mobile browser support
  // pagehide fires in more scenarios and is more reliable
  window.addEventListener('pagehide', handleTabClose);
  
  // Return cleanup function (though it's unlikely to be needed)
  return () => {
    window.removeEventListener('pagehide', handleTabClose);
  };
};

