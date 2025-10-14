import React, { useState, useMemo, useEffect } from "react";
import Question from "../components/Question";
import { useQuestions } from "../queries/QuestionQuery";
import { WindIdQuestion} from "../types/Question";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const QuestionList = () => {
  const { data: user } = useGetUser();
  const { data: questions } = useQuestions() as {
    data: WindIdQuestion[] | undefined;
  };
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter questions based on search term
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    if (!debouncedSearchTerm.trim()) return questions;
    
    return questions.filter((question) =>
      question.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [questions, debouncedSearchTerm]);

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <HeaderTab />
        <div>
          {filteredQuestions?.map((question) => (
            <Question key={question.id} question={question} user={user} />
          ))}
        </div>
      </RequireAuth>
    </Layout>
  );
};

export default QuestionList;
