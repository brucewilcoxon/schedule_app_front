import WindNote from "../components/WindNote";
import { useNotes } from "../queries/NoteQuery";
import NoteHeader from "../components/NoteHeader";
import HeaderTab from "../components/HeaderTab";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

const WindNoteList = () => {
  const { data: notes, isLoading, isFetching } = useNotes();
  const { data: user } = useGetUser();
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <HeaderTab />
        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {notes?.map((note) => (
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
