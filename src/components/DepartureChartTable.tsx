import React, { FC } from "react";
import { TableCell, TableRow } from "../@/components/ui/table";
import dayjs from "dayjs";
import { DepartureType } from "../types/Departure";
interface DepartureProps {
  departure: DepartureType;
}
const DepartureChartTable: FC<DepartureProps> = ({ departure }) => {
  return (
    <TableRow key={departure.id}>
      <TableCell className="font-medium">
        {departure.user?.user_profile?.name}
      </TableCell>
      <TableCell>{dayjs(departure.start).format("H:mm")}</TableCell>
      <TableCell>{dayjs(departure.end).format("H:mm")}</TableCell>
      <TableCell>{departure.intraUser?.email}</TableCell>
    </TableRow>
  );
};

export default DepartureChartTable;
