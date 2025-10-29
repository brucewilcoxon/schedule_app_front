import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreateModal from "./CreateModal";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileIcon from "@mui/icons-material/Person";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@/components/ui/dropdown-menu";
import { useLogout, useGetUser } from "../queries/AuthQuery";
import {
  useAllReadNotifications,
  useGetNotifications,
  useReadNotification,
} from "../queries/NotificationQuery";
import { ScrollArea } from "../@/components/ui/scroll-area";
import { NotificationItem } from "../types/Notification";
import IntraClaimModal from "./IntraClaimModal";
import { Button } from "../@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../@/components/ui/avatar";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import GasCreateModal from "./GasCreateModal";
import { GasType, GasProcessOption } from "../types/Gas";

interface NoteHeaderProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  // Gas management props
  gasTypes?: string[];
  prefectures?: string[];
  processOptions?: GasProcessOption[];
  onGasCreate?: (gasData: Omit<GasType, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

const NoteHeader = ({ 
  searchTerm = "", 
  setSearchTerm, 
  gasTypes = [], 
  prefectures = [], 
  processOptions = [], 
  onGasCreate 
}: NoteHeaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);
  const [intraClaimOpen, setIntraClaimOpen] = useState(false);
  const [gasCreateModalOpen, setGasCreateModalOpen] = useState(false);

  const readNotification = useReadNotification();
  const logoutOutMutation = useLogout();
  const { data: notifications } = useGetNotifications();
  const allReadNotifications = useAllReadNotifications();
  const { data: user } = useGetUser();

  const unreadNotifications = notifications?.filter(
    (notification: NotificationItem) => notification.read_at === null
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location.pathname]);

  const clickModalOpen = () => {
    if (currentLocation === "/gasManagement") {
      setGasCreateModalOpen(true);
    } else {
      setModalOpen(true);
    }
  };

  const clickModalClose = () => {
    setModalOpen(false);
  };

  const handleGasCreate = async (gasData: Omit<GasType, 'id' | 'created_at' | 'updated_at'>) => {
    if (onGasCreate) {
      try {
        await onGasCreate(gasData);
        setGasCreateModalOpen(false);
      } catch (error) {
        console.error("Failed to create gas record:", error);
      }
    }
  };

  const searchClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleClose = () => {
    setIntraClaimOpen(false);
  };

  return (
    <div className="sticky top-0 z-10 backdrop-blur-lg">
    <div>
      <div className="flex h-14 mb-3 p-2 gap-x-2 shadow-md  items-center justify-end relative">
        <div className="flex items-center absolute left-2 top-2">
          <Link to="/myPage/profile">
            <Button 
              className="w-10 h-10 p-0 bg-transparent text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-0 rounded-lg" 
              size="icon"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={
                    user?.user_profile?.profile_image 
                      ? `${process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000'}/${user.user_profile.profile_image}` 
                      : user?.user_profile?.gender === 'female' 
                        ? '/female.jpg' 
                        : '/male.jpg'
                  }
                  alt={user?.user_profile?.name || "Profile Image"}
                />
                <AvatarFallback className="text-xs">
                  {user?.user_profile?.name?.charAt(0) || <ProfileIcon className="text-sm" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </Link>
         </div>
        {["/question", "/timeLine", "/windNote"].includes(currentLocation) && (
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transform hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out" 
            onClick={searchClick}
          >
            <SearchIcon className="text-gray-600 hover:text-gray-800 transition-colors duration-200" />
          </button>
        )}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transform hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
          onClick={async () => {
            try {
              await logoutOutMutation.mutateAsync();
            } catch (error) {
              console.error("Logout failed:", error);
            }
          }}
        >
          <LogoutIcon className="text-gray-600 hover:text-red-500 transition-colors duration-200" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transform hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out">
              <NotificationsNoneIcon className="text-gray-600 hover:text-blue-500 transition-colors duration-200" />
              <span className="absolute bg-red-500 text-gray-100 px-[0.8] py-[0.8] text-xs font-bold rounded-full -top-1 -right-3 min-w-[1.5rem] flex justify-center items-center animate-pulse">
                {unreadNotifications?.length > 0 && unreadNotifications?.length}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <ScrollArea className=" h-48 w-64 rounded-md border">
              {notifications?.map((notification: NotificationItem) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="border-b"
                  onClick={() => {
                    readNotification.mutate(notification.id);
                    setSelectedNotification(notification);
                    
                    // Navigate based on notification type
                    if (notification.type === "calendar_created" || 
                        notification.type === "calendar_updated" || 
                        notification.type === "calendar_deleted") {
                      navigate("/calendar");
                    } else {
                      navigate("/calendar");
                    }
                  }}
                >
                  <div className="relative">
                    <div className="text-sm">
                      {/* Display different content based on notification type */}
                      {notification.type === "calendar_created" && (
                        <div>
                          <div className="font-semibold text-green-600">
                            📅 新しいスケジュール
                            {notification.updated_at && (
                              <span className="text-xs font-normal text-gray-500 ml-2">
                                ({format(new Date(notification.updated_at), "MM/dd HH:mm", { locale: ja })})
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700">{notification.data?.calendar?.vehicle_info || notification.data?.calendar?.repair_type || "スケジュール"}</div>
                          {notification.data?.calendar?.start && (
                            <div className="text-sm text-gray-500 mt-1">
                              開始日: {format(new Date(notification.data.calendar.start), "yyyy年MM月dd日(E)", { locale: ja })}
                            </div>
                          )}
                        </div>
                      )}
                      {notification.type === "calendar_updated" && (
                        <div>
                          <div className="font-semibold text-blue-600">
                            ✏️ スケジュール更新
                            {notification.updated_at && (
                              <span className="text-xs font-normal text-gray-500 ml-2">
                                ({format(new Date(notification.updated_at), "MM/dd HH:mm", { locale: ja })})
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700">{notification.data?.calendar?.vehicle_info || notification.data?.calendar?.repair_type || "スケジュール"}</div>
                          {notification.data?.calendar?.start && (
                            <div className="text-sm text-gray-500 mt-1">
                              開始日: {format(new Date(notification.data.calendar.start), "yyyy年MM月dd日(E)", { locale: ja })}
                            </div>
                          )}
                        </div>
                      )}
                      {notification.type === "calendar_deleted" && (
                        <div>
                          <div className="font-semibold text-red-600">
                            🗑️ スケジュール削除
                            {notification.updated_at && (
                              <span className="text-xs font-normal text-gray-500 ml-2">
                                ({format(new Date(notification.updated_at), "MM/dd HH:mm", { locale: ja })})
                              </span>
                            )}
                          </div>
                          <div className="text-gray-700">{notification.data?.calendar?.vehicle_info || notification.data?.calendar?.repair_type || "スケジュール"}</div>
                          {notification.data?.calendar?.start && (
                            <div className="text-sm text-gray-500 mt-1">
                              開始日: {format(new Date(notification.data.calendar.start), "yyyy年MM月dd日(E)", { locale: ja })}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Default case for other notification types */}
                      {!notification.type?.startsWith("calendar_") && (
                        <div>{notification.data?.comment || "通知"}</div>
                      )}
                    </div>
                    {!notification.read_at && (
                      <span className="absolute bg-red-500 -left-2 -top-1 rounded-sm w-2 h-2"></span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              <div className=" text-center text-gray-500">通知は以上です</div>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                onClick={() => allReadNotifications.mutate()}
              >
                全て既読にする
              </Button>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          className="text-white bg-gray-500 w-10 h-10 rounded-md mx-3 active:bg-gray-800 transform hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl"
          onClick={clickModalOpen}
        >
          <EditIcon className="transition-transform duration-200 hover:rotate-12" />
        </button>

        <CreateModal
          modalOpen={modalOpen}
          clickModalClose={clickModalClose}
          currentLocation={currentLocation}
        />
      </div>
      {searchOpen === true && (
        <div className=" text-center mb-2 mx-4">
          <input
            className="w-full h-10  bg-custom-white rounded-md border border-gray-700 px-2"
            placeholder="検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm?.(e.target.value)}
          />
        </div>
      )}
      <IntraClaimModal
        open={intraClaimOpen}
        handleClose={handleClose}
        notification={selectedNotification}
      />
      {gasCreateModalOpen && (
        <GasCreateModal
          modalOpen={gasCreateModalOpen}
          onClose={() => setGasCreateModalOpen(false)}
          onSubmit={handleGasCreate}
          gasTypes={gasTypes}
          prefectures={prefectures}
          processOptions={processOptions}
        />
      )}
    </div>
    </div>
  );
};

export default NoteHeader;
