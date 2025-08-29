import React, { useState } from "react";
import { User } from "../types/user";
import { useOutletContext } from "react-router-dom";
// import { useGetDepartures } from "../queries/DepartureQuery";
import { Button } from "../@/components/ui/button";
import Departure from "./Departure";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table";
import { useGetDepartures } from "../queries/DepartureQuery";

type DepartureListContextType = { user: User };

const MyPageDepartureList = () => {
  const nowYear = new Date().getFullYear().toString();
  const nowMonth = (new Date().getMonth() + 1).toString();
  const [year, setYear] = useState(nowYear);
  const [month, setMonth] = useState(nowMonth);
  const [date, setDate] = useState("");
  const [page, setPage] = useState("1");
  const { user } = useOutletContext<DepartureListContextType>();
  const {
    data: departures,
    isLoading,
    error,
  } = useGetDepartures(user.id, year, month, date);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading departures</div>;

  return (
    <div className="px-4 mt-2 space-y-2">
      <div className="flex justify-center space-x-5">
        <button
          className={`p-1 border rounded-lg w-[30%] text-center ${
            year === nowYear && month === nowMonth && "bg-gray-500 text-white"
          }`}
          onClick={() => {
            setYear(nowYear);
            setMonth(nowMonth);
          }}
        >
          今月
        </button>
        <button
          className={`p-1 border rounded-lg w-[30%] text-center ${
            year === "" && "bg-gray-500 text-white"
          }`}
          onClick={() => {
            setYear("");
            setMonth("");
          }}
        >
          すべて
        </button>
      </div>

      <div className="">
        <div className="text-right">
          {year === "" ? (
            <>
              <p>全ての出艇回数: {departures?.departures.length}回</p>
              <p>全ての出艇時間: {departures?.total_time}</p>
            </>
          ) : (
            <>
              <p>
                {nowMonth}月の出艇回数: {departures?.departures.length}回
              </p>
              <p>
                {nowMonth}月の出艇時間: {departures?.total_time}
              </p>
            </>
          )}
        </div>
        <Table>
          <TableHeader className=" bg-gray-300">
            <TableRow>
              <TableHead className="">日付</TableHead>
              <TableHead className="">開始</TableHead>
              <TableHead>終了</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departures?.departures.map((departure) => (
              <Departure key={departure.id} departure={departure} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyPageDepartureList;
