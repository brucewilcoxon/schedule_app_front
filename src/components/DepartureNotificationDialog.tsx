import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../@/components/ui/alert-dialog";
import { NotificationItem } from "../types/Notification";
import { useIntraApproveClaim } from "../queries/IntraClaimQuery";

interface DepartureNotificationDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  notification?: NotificationItem | null;
}

const DepartureNotificationDialog: React.FC<
  DepartureNotificationDialogProps
> = ({ isDialogOpen, setIsDialogOpen, notification }) => {
  const approveIntraClaim = useIntraApproveClaim();
  const handleDepartureApprove = () => {
    if (notification) {
      approveIntraClaim.mutate(notification.data.intraClaim.id);
    }
  };
  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className=" font-normal">
              イントラしますか？
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              依頼を拒否する
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDepartureApprove()}>
              イントラする
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartureNotificationDialog;
