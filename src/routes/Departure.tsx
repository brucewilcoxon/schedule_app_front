import React from "react";
import NoteHeader from "../components/NoteHeader";
import DepartureTab from "../components/DepartureTab";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import RefrigerantUsageList from "../components/RefrigerantUsageList";

const Departure = () => {
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        {/* <DepartureTab /> */}
        <RefrigerantUsageList />
      </RequireAuth>
    </Layout>
  );
};

export default Departure;
