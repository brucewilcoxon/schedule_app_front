import React from "react";
import RequireAuth from "./RequireAuth";
import NoteHeader from "./NoteHeader";
import { NavLink } from "react-router-dom";
import DepartureTable from "./DepartureTable";
import Button from "./Button";
import Footer from "./Footer";
import DepartureTab from "./DepartureTab";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table";
import { useGetDepartureRankings } from "../queries/DepartureQuery";
import { DepartureRankingType } from "../types/Departure";
import Layout from "./Layout";

const DepartureRanking = () => {
  const { data: departureRankings } = useGetDepartureRankings();
  return (
    <Layout>
      <NoteHeader />
      <div className="p-3">
        <DepartureTab />
        <Table>
          <TableHeader className="bg-gray-300">
            <TableRow>
              <TableHead className="w-[100px]">順位</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>出艇回数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departureRankings?.map(
              (ranking: DepartureRankingType, index: number) => (
                <TableRow key={ranking.user.id}>
                  <TableCell>{index + 1}位</TableCell>
                  <TableCell>{ranking.user.user_profile?.name}</TableCell>
                  <TableCell>{ranking.departures_count}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
};

export default DepartureRanking;
