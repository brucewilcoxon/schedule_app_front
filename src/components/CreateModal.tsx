// import { Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import { CreateHeaderModalProps } from "../types/ModalProps";
import CreateQuestion from "./CreateQuestion";
import { Button } from "../@/components/ui/button";
import CreateNote from "./CreateNote";
import CreateCalendarEvent from "./CreateCalendarEvent";
import { Dialog, DialogContent } from "../@/components/ui/dialog";
import CreateDepartureModal from "./CreateDepartureModal";

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
      case "/departure":
        return (
          <CreateDepartureModal
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
        <DialogContent>{renderContent()}</DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateModal;
