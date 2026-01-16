import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./routes/SignUp";
import Login from "./routes/Login";
import WindNoteList from "./routes/WindNoteList";
import WindCalendar from "./routes/WindCalendar";
import Meta from "./components/Meta";
import NoteTimeline from "./routes/NoteTimeline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionList from "./routes/QuestionList";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import Answer from "./routes/AnswerList";
import WindNote from "./routes/WindNote";
import { MyPage } from "./routes/MyPage";
import IntraList from "./components/IntraList";
import MyPageNoteList from "./components/MyPageNoteList";
import MyPageQuestionList from "./components/MyPageQuestionList";
import MyPageAnswerList from "./components/MyPageAnswerList";
import MyPageProfile from "./routes/MyPageProfile";
import UserManagement from "./components/UserManagement";
import Refrigerant from "./routes/Refrigerant";
import RefrigerantHome from "./routes/RefrigerantHome";
import RefrigerantCompany from "./routes/RefrigerantCompany";
import RefrigerantWorkplace from "./routes/RefrigerantWorkplace";
import RefrigerantDocument from "./routes/RefrigerantDocument";
import GasManagement from "./components/GasManagement";
import RepairTypeOptionManagement from "./components/RepairTypeOptionManagement";
import { AuthProviderWrapper } from "./components/AuthProviderWrapper";
import RequireAuth from "./components/RequireAuth";
import RequireManager from "./components/RequireManager";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProviderWrapper>
        <Meta />
        <ToastContainer hideProgressBar={true} />
        <Routes>
          <Route index element={<Navigate to="/calendar" replace />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/windNote" element={<RequireAuth><WindNoteList /></RequireAuth>} />
          <Route path="/windNote/:id" element={<RequireAuth><WindNote /></RequireAuth>} />
          <Route path="/calendar" element={<RequireAuth><WindCalendar /></RequireAuth>} />
          <Route path="/myPage" element={<RequireAuth><MyPage /></RequireAuth>}>
            <Route path="intra" element={<IntraList />} />
            <Route path="note" element={<MyPageNoteList />} />
            <Route path="question" element={<MyPageQuestionList />} />
            <Route path="answer" element={<MyPageAnswerList />} />
          </Route>
          <Route path="/myPage/profile" element={<RequireAuth><MyPageProfile /></RequireAuth>} />
          <Route path="/userManagement" element={<RequireManager><UserManagement /></RequireManager>} />
          <Route path="/question" element={<RequireAuth><QuestionList /></RequireAuth>} />
          <Route path="/timeline" element={<RequireAuth><NoteTimeline /></RequireAuth>} />
          <Route path="/question/:id/answer" element={<RequireAuth><Answer /></RequireAuth>} />
          <Route path="/refrigerant" element={<RequireAuth><Refrigerant /></RequireAuth>}>
            <Route index element={<RefrigerantHome />} />
            <Route path="company" element={<RefrigerantCompany />} />
            <Route path="workplace" element={<RefrigerantWorkplace />} />
            <Route path="document" element={<RefrigerantDocument />} />
          </Route>
          <Route path="/gasManagement" element={<RequireAuth><GasManagement /></RequireAuth>} />
          <Route path="/repairTypeManagement" element={<RequireManager><RepairTypeOptionManagement /></RequireManager>} />
        </Routes>
      </AuthProviderWrapper>
    </BrowserRouter>
  </QueryClientProvider>
);
