import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import EventsAlertDialog from "./EventsAlertDialog";
import EditCalendarEventModal from "./EditCalendarEventModal";
import { CalendarType } from "../types/Calendar";
import { useGetUser } from "../queries/AuthQuery";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import ImageGallery from "./ImageGallery";
interface EventProps {
  event: CalendarType;
}

const Event: React.FC<EventProps> = ({ event }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: user } = useGetUser();


  const getStatusColor = (status: string, isDelayed: boolean): string => {
    if (isDelayed) {
      return "border-l-4 border-red-400 bg-red-50";
    }
    
    switch (status) {
      case "未開始":
        return "border-l-4 border-gray-400 bg-gray-50";
      case "作業中":
        return "border-l-4 border-blue-400 bg-blue-50";
      case "見積り保留中":
        return "border-l-4 border-yellow-400 bg-yellow-50";
      case "部品待ち保留中":
        return "border-l-4 border-orange-400 bg-orange-50";
      case "完了":
        return "border-l-4 border-green-400 bg-green-50";
      case "連絡済み":
        return "border-l-4 border-purple-400 bg-purple-50";
      default:
        return "border-l-4 border-gray-400 bg-gray-50";
    }
  };

  // Extract vehicle info value for display
  const getVehicleInfoValue = (): string => {
    return event.vehicle_info || event.repair_type || "スケジュール";
  };


  // Format creation date and time
  const formatCreationDateTime = (): string => {
    if (!event.created_at) return "";
    try {
      const createdDate = new Date(event.created_at);
      return format(createdDate, "M月d日 HH:mm", { locale: ja });
    } catch (error) {
      return "";
    }
  };

  const status = useMemo(() => event.status || "未開始", [event.status]);
  const eventIsDelayed = useMemo(() => event.is_delayed || false, [event.is_delayed]);
  const statusColor = useMemo(() => getStatusColor(status, eventIsDelayed), [status, eventIsDelayed]);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const clickModalOpen = () => {
    setModalOpen(true);
  };
  const clickModalClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      <div className={`flex p-2 justify-between rounded-md ${statusColor}`}>
        <div className="flex">
          <div className="flex flex-shrink-0 items-center justify-center w-8 h-8 bg-blue-500 rounded-lg mr-3 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            {event.is_absent && <p className="">欠席連絡</p>}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{getVehicleInfoValue()}</h3>
              <div className="flex items-center gap-1">
                <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                  status === "未開始" ? "bg-gray-100 text-gray-700 border border-gray-200" :
                  status === "作業中" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                  status === "見積り保留中" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                  status === "部品待ち保留中" ? "bg-orange-100 text-orange-700 border border-orange-200" :
                  status === "完了" ? "bg-green-100 text-green-700 border border-green-200" :
                  status === "連絡済み" ? "bg-purple-100 text-purple-700 border border-purple-200" :
                  "bg-gray-100 text-gray-700 border border-gray-200"
                }`}>
                  {status}
                </span>
                {eventIsDelayed && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full shadow-sm bg-red-100 text-red-700 border border-red-200">
                    ⇒
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2 mb-2">
              {event.workers && event.workers.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">作業員: {event.workers.join(', ')}</p>
                </div>
              )}
              {event.description && (
                <p className="text-sm text-gray-600 whitespace-pre-line break-all">{event.description}</p>
              )}
              {event.images && event.images.length > 0 && (
                <ImageGallery images={event.images} />
              )}
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {event.user.user_profile?.name}
              {event.created_at && (
                <span className="ml-2 text-xs text-gray-400">
                  ({formatCreationDateTime()})
                </span>
              )}
            </p>
          </div>
        </div>
        <div>
          {(user?.id === event.user.id || user?.role === 'manager') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  className="text-gray-600"
                  onSelect={openDialog}
                >
                  削除
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={clickModalOpen}
                  className="text-gray-600"
                >
                  編集
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <EventsAlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        eventId={event.id}
      />
      <EditCalendarEventModal
        modalOpen={modalOpen}
        clickModalClose={clickModalClose}
        calendarEvent={event}
      />
    </>
  );
};

export default Event;
