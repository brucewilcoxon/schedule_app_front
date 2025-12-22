// import { Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { CreateHeaderModalProps } from "../types/ModalProps";
import CreateQuestion from "./CreateQuestion";
import CreateNote from "./CreateNote";
import CreateCalendarEvent from "./CreateCalendarEvent";
import { Dialog, DialogContent } from "../@/components/ui/dialog";

const CreateModal: React.FC<CreateHeaderModalProps> = ({
  modalOpen,
  clickModalClose,
  currentLocation,
}) => {
  const renderContent = () => {
    switch (currentLocation) {
      case "/windNote":
        return (
          <CreateNote
            currentLocation={currentLocation}
            modalOpen={modalOpen}
            clickModalClose={clickModalClose}
          />
        );
      case "/question":
        return (
          <CreateQuestion
            currentLocation={currentLocation}
            modalOpen={modalOpen}
            clickModalClose={clickModalClose}
          />
        );
      case "/calendar":
        return (
          <CreateCalendarEvent
            currentLocation={currentLocation}
            modalOpen={modalOpen}
            clickModalClose={clickModalClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Dialog open={modalOpen} onOpenChange={clickModalClose}>
        <DialogContent className="max-w-[375px] xs:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
          {renderContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateModal;
