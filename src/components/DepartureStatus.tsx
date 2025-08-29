import React, { useState } from "react";
import NoteHeader from "./NoteHeader";
import DepartureTab from "./DepartureTab";
import dayjs from "dayjs";
import RequireAuth from "./RequireAuth";
import Layout from "./Layout";
import DepartureStatusTable from "./DepartureStatusTable";
import Button from "./Button";
import DepartureChartDrawer from "./DepartureChartDrawer";

dayjs.locale("ja");

const DepartureStatus = () => {
  const [chartOpen, setChartOpen] = useState(false);

  const clickChartOpen = () => {
    setChartOpen(true);
  };
  const clickChartClose = () => {
    setChartOpen(false);
  };

  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
        <DepartureTab />
        <div className="px-3 my-3">
          <Button
            className="w-full bg-custom-gray mt-3 text-white"
            text="チャート"
            onClick={clickChartOpen}
          />
        </div>
        <DepartureStatusTable />
        <DepartureChartDrawer open={chartOpen} handleClose={clickChartClose} />
      </RequireAuth>
    </Layout>
  );
};

export default DepartureStatus; 