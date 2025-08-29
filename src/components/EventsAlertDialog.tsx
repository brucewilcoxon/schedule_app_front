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
import { useDeleteCalendarEvent } from "../queries/CalenarQuery";
interface EventsAlertDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  eventId: number;
}
const EventsAlertDialog: React.FC<EventsAlertDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  eventId,
}) => {
  const deleteCalendarEvent = useDeleteCalendarEvent();

  const handleDeleteCalendarEvent = () => {
    deleteCalendarEvent.mutate(eventId);
  };
  return (
    <div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="w-[90%] rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className=" font-normal">
              本当に削除しますか?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCalendarEvent}>
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventsAlertDialog;
