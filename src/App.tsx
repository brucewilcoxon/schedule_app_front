import { useEffect } from "react";
import "./App.css";
import RequireAuth from "./components/RequireAuth";
import { clearAllAuthData } from "./utils/cookieUtils";

function App() {
  useEffect(() => {
    // Function to handle cleanup when browser/tab is closed
    // This ensures cookies are cleared even if user closes browser without clicking logout
    const handleBeforeUnload = () => {
      clearAllAuthData();
    };

    // Function to handle page unload (more reliable than beforeunload in some browsers)
    const handleUnload = () => {
      clearAllAuthData();
    };

    // Function to handle pagehide event (fires when page is being unloaded)
    // This is more reliable than beforeunload in mobile browsers
    const handlePageHide = () => {
      clearAllAuthData();
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  return (
    <RequireAuth>
      <div></div>
    </RequireAuth>
  );
}

export default App;
