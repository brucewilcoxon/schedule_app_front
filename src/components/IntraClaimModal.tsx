import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../@/components/ui/dialog";
import { NotificationItem } from "../types/Notification";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { Button } from "../@/components/ui/button";
import {
  useIntraApproveClaim,
  useRejectIntraClaim,
} from "../queries/IntraClaimQuery";

interface IntraClaimModalProps {
  open: boolean;
  handleClose: () => void;
  notification?: NotificationItem | null;
}

const IntraClaimModal: React.FC<IntraClaimModalProps> = ({
  open,
  handleClose,
  notification,
}) => {
  const description = notification?.data?.departure?.description;

  // 日時をフォーマット
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const start = notification?.data?.departure?.start
    ? dayjs(notification.data.departure.start).format("M月D日 H時mm分")
    : undefined;
  const end = notification?.data?.departure?.end
    ? dayjs(notification.data.departure.end).format("M月D日 H時mm分")
    : undefined;

  const approveIntraClaim = useIntraApproveClaim();
  const rejectIntraClaim = useRejectIntraClaim();
  const handleApproveIntraClaim = () => {
    if (notification) {
      approveIntraClaim.mutate(notification.data.intraClaim.id);
    }
    handleClose();
  };
  const handleRejectIntraClaim = () => {
    if (notification) {
      rejectIntraClaim.mutate(notification.data.intraClaim.id);
    }
    handleClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5 mt-3 font-bold">
            {notification?.data?.departure?.user?.user_profile?.name ||
              "不明なユーザー"}
            さんからイントラ依頼が届いています
          </DialogTitle>
          <DialogDescription className="space-y-6">
            <div className="flex justify-center">
              <div className=" h-10 items-center w-[50%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                {start ? start : "日付不明"}
              </div>
              <div className="h-10 items-center w-[50%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50">
                {end ? end : "日付不明"}
              </div>
            </div>
            <div className="h-10 items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50">
              {description ? description : "詳細はありません"}
            </div>
            <div className=" justify-center space-x-4">
              <Button
                variant="reject"
                className="w-[40%]"
                onClick={() => handleRejectIntraClaim()}
              >
                取り下げる
              </Button>
              <Button
                className="w-[40%]"
                onClick={() => handleApproveIntraClaim()}
              >
                イントラする
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default IntraClaimModal;
