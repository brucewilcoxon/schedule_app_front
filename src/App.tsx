import "./App.css";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <RequireAuth>
      <div></div>
    </RequireAuth>
  );
}

export default App;
