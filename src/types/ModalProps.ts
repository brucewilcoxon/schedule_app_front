export interface CreateNoteModalProps {
  open: boolean;
  handleClose: () => void;
}

export interface CreateHeaderModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  currentLocation: string;
  initialDate?: string;
}

export interface EditModalProps {
  modalOpen: boolean;
  clickModalClose: () => void;
  currentLocation: string;
}
