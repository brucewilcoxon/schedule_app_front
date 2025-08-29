import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
// import { useGetDepartures } from "../queries/DepartureQuery";
import { format, parseISO, subHours } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import DepartureEventModal from "./DepartureEventModal";
import { DepartureType, DepartureWithTotalTime } from "../types/Departure";
import { EventInput } from "@fullcalendar/core";
import { useGetDepartures } from "../queries/DepartureQuery";
import dayjs from "dayjs";
import DepartureStyleWrapper from "./DepartureStyleWrapper";

const DepartureTable = () => {
  const [open, setOpen] = useState(false);
  const [selectedDepartureId, setSelectedDepartureId] = useState<number>();
  const { data } = useGetDepartures();
  const resources = data?.departures?.map((departure: DepartureType) => ({
    id: departure.user?.id?.toString() ?? "",
    title: departure.user?.user_profile?.name || "Unknown",
  }));

  const events = data?.departures?.map((departure: DepartureType) => ({
    id: departure.id?.toString(),
    resourceId: departure.user?.id?.toString() ?? "",
    start: departure.start,
    end: departure.end,
    title: departure.intraUser?.user_profile?.name || "",
    backgroundColor: departure.intra_user_id ? "#8EAAE5" : "#FF6347",
    extendedProps: {
      user: departure.user,
    },
  }));

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedDepartureId(Number(clickInfo.event.id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="">
      <div className="px-3">
        <DepartureStyleWrapper>
          <FullCalendar
            headerToolbar={{ start: "prev", center: "title", end: "next" }}
            plugins={[resourceTimeGridPlugin]}
            initialView="resourceTimeGrid"
            resources={resources}
            height="70vh"
            events={events}
            initialDate={dayjs().format("YYYY-MM-DD")}
            slotMinTime="07:00:00"
            slotMaxTime="17:00:00"
            allDaySlot={false}
            locale="ja"
            contentHeight="auto"
            schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            eventClick={handleEventClick}
          />
        </DepartureStyleWrapper>
      </div>
      {selectedDepartureId && (
        <DepartureEventModal
          open={open}
          handleClose={handleClose}
          departureId={selectedDepartureId}
        />
      )}

      {/* total_time を表示
      {totalTime && (
        <div className="mt-4 text-center">
          <h3>Total Time: {totalTime}</h3>
        </div>
      )} */}
    </div>
  );
};

export default DepartureTable;
