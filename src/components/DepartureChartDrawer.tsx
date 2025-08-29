import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
} from "../@/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../@/components/ui/table";
import Button from "./Button";
import { useGetDepartures } from "../queries/DepartureQuery";
import dayjs from "dayjs";
import DepartureChartTable from "./DepartureChartTable";

type DepartureChartDrawerProps = {
  open: boolean;
  handleClose: () => void;
};

const DepartureChartDrawer: React.FC<DepartureChartDrawerProps> = ({
  open,
  handleClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<"today" | "tomorrow">("today");
  const [dateParams, setDateParams] = useState<{
    year: string;
    month: string;
    date: string;
  }>({
    year: dayjs().format("YYYY"),
    month: dayjs().format("MM"),
    date: dayjs().format("DD"),
  });

  const {
    data: departures,
    isError,
    isLoading,
  } = useGetDepartures(
    undefined,
    dateParams.year,
    dateParams.month,
    dateParams.date
  );
  console.log(departures);

  useEffect(() => {
    const today = dayjs();
    const targetDate = selectedTab === "today" ? today : today.add(1, "day");
    setDateParams({
      year: targetDate.format("YYYY"),
      month: targetDate.format("MM"),
      date: targetDate.format("DD"),
    });
  }, [selectedTab]);

  const handleDrawerChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
  };

  const handleTabChange = (value: "today" | "tomorrow") => {
    setSelectedTab(value);
  };

  return (
    <Drawer open={open} onOpenChange={handleDrawerChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription>
            <div>
              <Tabs
                value={selectedTab}
                onValueChange={(value) =>
                  handleTabChange(value as "today" | "tomorrow")
                }
              >
                <TabsList className="w-full">
                  <TabsTrigger value="today" className="w-[50%]">
                    今日
                  </TabsTrigger>
                  <TabsTrigger value="tomorrow" className="w-[50%]">
                    明日
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="today">
                  {isLoading ? (
                    <p>読み込み中...</p>
                  ) : isError ? (
                    <p>データの取得に失敗しました。</p>
                  ) : departures && departures.departures.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-gray-300">
                        <TableRow>
                          <TableHead className="w-[100px]">名前</TableHead>
                          <TableHead>開始</TableHead>
                          <TableHead>終了</TableHead>
                          <TableHead>イントラ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departures.departures.map((departure) => (
                          <DepartureChartTable key={departure.id} departure={departure} />
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>出発データがありません。</p>
                  )}
                </TabsContent>

                <TabsContent value="tomorrow">
                  {isLoading ? (
                    <p>読み込み中...</p>
                  ) : isError ? (
                    <p>データの取得に失敗しました。</p>
                  ) : departures && departures.departures.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-gray-300">
                        <TableRow>
                          <TableHead className="w-[100px]">名前</TableHead>
                          <TableHead>開始</TableHead>
                          <TableHead>終了</TableHead>
                          <TableHead>イントラ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departures.departures.map((departure) => (
                          <DepartureChartTable key={departure.id} departure={departure} />
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p>出発データがありません。</p>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button
              className="w-full bg-custom-gray mt-3 text-white"
              text="キャンセル"
              onClick={handleClose}
            />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DepartureChartDrawer;
