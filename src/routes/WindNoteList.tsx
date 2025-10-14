import React, { useState, useMemo, useEffect } from "react";
import WindNote from "../components/WindNote";
import { useNotes } from "../queries/NoteQuery";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import { NoteWithFavorites } from "../types/Note";

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

const WindNoteList = () => {
  const { data: notes, isLoading, isFetching } = useNotes();
  const { data: user } = useGetUser();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filter notes based on search term
  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    if (!debouncedSearchTerm.trim()) return notes;
    
    return notes.filter((note: NoteWithFavorites) =>
      note.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [notes, debouncedSearchTerm]);

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <HeaderTab />
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {filteredNotes?.map((note) => (
                <WindNote
                  key={note.id}
                  note={note}
                  user={user}
                  isFetching={isFetching}
                />
              ))}
            </>
          )}
        </div>
      </RequireAuth>
    </Layout>
  );
};

export default WindNoteList;
