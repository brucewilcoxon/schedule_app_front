/**
 * Utility functions for managing cookies
 */

/**
 * Clears all cookies by setting them to expire in the past
 * This function attempts to clear cookies with various path and domain combinations
 */
export const clearAllCookies = () => {
  // Get all cookies
  const cookies = document.cookie.split(";");
  
  // Common cookie names that might be used for authentication
  const commonCookieNames = [
    'XSRF-TOKEN',
    'laravel_session',
    'windap_session',
    'remember_web',
    'remember_token',
    'session',
    'auth',
    'sanctum_token'
  ];
  
  // Combine existing cookies with common cookie names
  const allCookieNames = new Set<string>();
  
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name) {
      allCookieNames.add(name);
    }
  });
  
  commonCookieNames.forEach(name => allCookieNames.add(name));
  
  // Paths and domains to try
  const paths = ['/', '/api', '/sanctum'];
  const domains = ['', window.location.hostname, '.' + window.location.hostname];
  
  // Clear each cookie with different path and domain combinations
  allCookieNames.forEach(name => {
    paths.forEach(path => {
      domains.forEach(domain => {
        // Try different cookie attribute combinations
        const cookieOptions = [
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`,
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure`,
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=strict`,
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; secure; samesite=lax`,
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; samesite=strict`,
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}; samesite=lax`,
        ];
        
        cookieOptions.forEach(option => {
          document.cookie = option;
        });
      });
    });
  });
};

/**
 * Clears all authentication-related data including cookies, localStorage, and sessionStorage
 */
export const clearAllAuthData = () => {
  // Clear all cookies
  clearAllCookies();
  
  // Clear localStorage (especially auth_token)
  localStorage.removeItem('auth_token');
  
  // Clear sessionStorage
  sessionStorage.clear();
};

