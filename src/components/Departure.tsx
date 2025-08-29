import React from "react";
import { DepartureType } from "../types/Departure";
import dayjs from "dayjs";
import { TableCell, TableRow } from "../@/components/ui/table";

const Departure = ({ departure }: { departure: DepartureType }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {dayjs(departure.start).format("M/D")}
      </TableCell>
      <TableCell>{dayjs(departure.start).format("H:mm")}</TableCell>
      <TableCell>{dayjs(departure.end).format("H:mm")}</TableCell>
    </TableRow>
  );
};

export default Departure;
