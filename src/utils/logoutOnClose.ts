/**
 * Utility to handle automatic logout when browser tab/window is closed
 * Uses both pagehide and beforeunload events with fetch keepalive to ensure
 * logout API is called even after the tab closes
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const LOGOUT_ENDPOINT = '/api/logout';

let isSetup = false;
let logoutInProgress = false;

/**
 * Clears all cookies with different path and domain combinations
 * Note: This can only clear non-httpOnly cookies. Session cookies set by
 * the server with httpOnly=true cannot be cleared from JavaScript.
 */
const clearAllCookies = () => {
  try {
    const cookies = document.cookie.split(";");
    
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      if (!name) return;
      
      // Extract root domain for cross-subdomain cookie clearing
      const hostname = window.location.hostname;
      let rootDomain = '';
      
      // Try to extract root domain (e.g., api.mrservice.jp -> .mrservice.jp)
      const domainMatch = hostname.match(/\.([^.]+\.(?:jp|com|net|org|io|co))$/);
      if (domainMatch) {
        rootDomain = '.' + domainMatch[1];
      }
      
      // Clear cookie with different path and domain combinations
      const paths = ['/', '/api', '/sanctum'];
      const domains = ['', hostname, rootDomain].filter(Boolean);
      
      paths.forEach(path => {
        domains.forEach(domain => {
          // Try different SameSite and Secure combinations
          const combinations = [
            '', // No additional attributes
            '; secure',
            '; secure; samesite=none',
            '; secure; samesite=lax',
            '; secure; samesite=strict',
          ];
          
          combinations.forEach(attrs => {
            const domainPart = domain ? `; domain=${domain}` : '';
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domainPart}${attrs}`;
          });
        });
      });
    });
  } catch (error) {
    // Silently fail - some cookies may be httpOnly and cannot be cleared
    console.debug('Error clearing cookies:', error);
  }
};

/**
 * Clears all authentication-related storage
 */
const clearAuthStorage = () => {
  try {
    // Clear localStorage (auth_token)
    localStorage.removeItem('auth_token');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear cookies (only non-httpOnly ones)
    clearAllCookies();
  } catch (error) {
    console.debug('Error clearing auth storage:', error);
  }
};

/**
 * Calls the logout API endpoint
 */
const callLogoutAPI = (authToken: string) => {
  if (logoutInProgress) {
    return; // Prevent duplicate calls
  }
  
  logoutInProgress = true;
  const logoutUrl = `${API_BASE_URL}${LOGOUT_ENDPOINT}`;
  
  // Use fetch with keepalive to ensure request completes even after tab closes
  // This is critical because axios requests may be cancelled when tab closes
  // The keepalive flag ensures the browser queues the request even after tab closes
  fetch(logoutUrl, {
    method: 'POST',
    credentials: 'include', // Include cookies for CSRF token (if SameSite allows)
    keepalive: true, // Critical: ensures request completes after tab closes
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${authToken}`, // Bearer token works even without cookies
    },
    body: JSON.stringify({}), // Empty body
  }).catch((error) => {
    // Silently fail - tab is closing anyway
    // The backend will eventually clean up expired tokens
    console.debug('Logout API call failed (expected if tab closed):', error);
  });
};

/**
 * Handles logout when tab/window is being closed (pagehide event)
 */
const handlePageHide = (event: PageTransitionEvent) => {
  // Skip if page is being cached (back/forward navigation)
  if (event.persisted) {
    return;
  }

  // Only logout if user is authenticated
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) {
    return;
  }

  // Call logout API first (before clearing storage)
  // This ensures the server can process the logout
  callLogoutAPI(authToken);

  // Clear storage after initiating API call
  // This is optimistic cleanup - server will handle the rest
  clearAuthStorage();
};

/**
 * Handles logout when tab/window is being closed (beforeunload event)
 * This is a fallback for browsers that don't reliably fire pagehide
 */
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  // Only logout if user is authenticated
  const authToken = localStorage.getItem('auth_token');
  if (!authToken) {
    return;
  }

  // Call logout API
  callLogoutAPI(authToken);

  // Clear storage
  clearAuthStorage();
};

/**
 * Sets up the logout handler for browser tab/window close
 * Should be called once when the app initializes
 */
export const setupLogoutOnClose = () => {
  // Prevent multiple setups
  if (isSetup) {
    return;
  }

  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !('addEventListener' in window)) {
    return;
  }

  // Use both pagehide (preferred) and beforeunload (fallback) for maximum compatibility
  // pagehide is more reliable on mobile browsers
  window.addEventListener('pagehide', handlePageHide);
  
  // beforeunload as fallback (though less reliable, especially on mobile)
  // Note: Some browsers may show a confirmation dialog, but modern browsers
  // only show it if preventDefault() is called, which we don't do
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  isSetup = true;
};

