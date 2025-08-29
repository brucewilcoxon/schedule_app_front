import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./routes/SignUp";
import Login from "./routes/Login";
import WindNoteList from "./routes/WindNoteList";
import WindCalendar from "./routes/WindCalendar";
import Departure from "./routes/Departure";
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
import MyPageDepartureList from "./components/MyPageDepartureList";
import MyPageNoteList from "./components/MyPageNoteList";
import MyPageQuestionList from "./components/MyPageQuestionList";
import MyPageAnswerList from "./components/MyPageAnswerList";
import MyPageProfile from "./routes/MyPageProfile";
import DepartureRanking from "./components/DepartureRanking";
import UserManagement from "./components/UserManagement";
import DepartureStatus from "./components/DepartureStatus";
import Refrigerant from "./routes/Refrigerant";
import RefrigerantHome from "./routes/RefrigerantHome";
import RefrigerantCompany from "./routes/RefrigerantCompany";
import RefrigerantWorkplace from "./routes/RefrigerantWorkplace";
import RefrigerantDocument from "./routes/RefrigerantDocument";
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
    <Meta />
    <BrowserRouter>
      <ToastContainer hideProgressBar={true} />
      <Routes>
        <Route index element={<App />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/windNote" element={<WindNoteList />} />
        <Route path="/windNote/:id" element={<WindNote />} />
        <Route path="/calendar" element={<WindCalendar />} />
        <Route path="/myPage" element={<MyPage />}>
          <Route path="intra" element={<IntraList />} />
          <Route path="note" element={<MyPageNoteList />} />
          <Route path="question" element={<MyPageQuestionList />} />
          <Route path="answer" element={<MyPageAnswerList />} />
          <Route path="departure" element={<MyPageDepartureList />} />
        </Route>
        <Route path="/myPage/profile" element={<MyPageProfile />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/departure" element={<Departure />} />
        <Route path="departure/status" element={<DepartureStatus />} />
        <Route path="departure/ranking" element={<DepartureRanking />} />
        <Route path="/question" element={<QuestionList />} />
        <Route path="/timeline" element={<NoteTimeline />} />
        <Route path="/question/:id/answer" element={<Answer />} />
        <Route path="/refrigerant" element={<Refrigerant />}>
          <Route index element={<RefrigerantHome />} />
          <Route path="company" element={<RefrigerantCompany />} />
          <Route path="workplace" element={<RefrigerantWorkplace />} />
          <Route path="document" element={<RefrigerantDocument />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
