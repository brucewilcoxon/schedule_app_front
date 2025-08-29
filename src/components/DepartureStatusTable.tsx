import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table";
import dayjs from "dayjs";
import { useGetDepartureStatus } from "../queries/DepartureQuery";

const DepartureStatusTable = () => {
  const isSunday = dayjs().day() === 5;
  console.log(isSunday);

  const { data: departureStatuses } = useGetDepartureStatus(isSunday);
  console.log(departureStatuses?.notified);
  return (
    <div className="px-3">
      {departureStatuses && (
        <>
          <h3>今週の未連絡の未出艇者</h3>
          <Table>
            <TableHeader className="bg-gray-400">
              <TableRow>
                <TableHead className="">名前</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departureStatuses?.no_notification ? (
                departureStatuses?.no_notification.map((noNotified) => (
                  <TableRow key={noNotified.id}>
                    <TableCell className="font-medium">
                      {noNotified.user_profile?.name}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="font-medium">
                    未連絡の未出艇者はいません
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <h3>今週の連絡があった未出艇者</h3>
          <Table>
            <TableHeader className="bg-gray-400">
              <TableRow>
                <TableHead className="">名前</TableHead>
                <TableHead>車両情報</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departureStatuses.notified.map((notified) =>
                notified.events.map((event, eventIndex) => (
                  <TableRow key={`${notified.user.id}-${event.id}`}>
                    <TableCell className="font-medium">
                      {eventIndex === 0 ? notified.user.user_profile?.name : ""}
                    </TableCell>
                    <TableCell>{event.vehicle_info || event.repair_type || ""}</TableCell>
                    <TableCell>{event.description || ""}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default DepartureStatusTable;
