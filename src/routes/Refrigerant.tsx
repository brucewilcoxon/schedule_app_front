import React from "react";
import NoteHeader from "../components/NoteHeader";
import RefrigerantTab from "../components/RefrigerantTab";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import { Outlet } from "react-router-dom";

const Refrigerant = () => {
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <RefrigerantTab />
        <Outlet />
      </RequireAuth>
    </Layout>
  );
};

export default Refrigerant; 