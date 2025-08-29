import React from "react";
import Question from "../components/Question";
import { useQuestions } from "../queries/QuestionQuery";
import { WindIdQuestion, WindQuestion } from "../types/Question";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

const QuestionList = () => {
  const { data: user } = useGetUser();
  const { data: questions } = useQuestions() as {
    data: WindIdQuestion[] | undefined;
  };
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <HeaderTab />
        <div>
          {questions?.map((question) => (
            <Question key={question.id} question={question} user={user} />
          ))}
        </div>
      </RequireAuth>
    </Layout>
  );
};

export default QuestionList;
