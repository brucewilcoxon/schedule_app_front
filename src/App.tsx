import "./App.css";
import RequireAuth from "./components/RequireAuth";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { performLogoutCleanup, sendLogoutBeacon } from "./utils/logoutUtils";

function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Send logout request using beacon (works even when page is closing)
      sendLogoutBeacon();
      
      // Perform synchronous cleanup operations
      performLogoutCleanup(queryClient);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [queryClient]);

  return (
    <RequireAuth>
      <div></div>
    </RequireAuth>
  );
}

export default App;
