import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../@/components/ui/dialog";
import { Button } from "../@/components/ui/button";
import {
  useIntraApproveClaim,
  useRejectIntraClaim,
} from "../queries/IntraClaimQuery";
import { IntraClaimType } from "../types/IntraClaim";

interface MypageIntraModalProps {
  open: boolean;
  handleClose: () => void;
  intraClaim: IntraClaimType;
}
const MypageIntraModal: React.FC<MypageIntraModalProps> = ({
  open,
  handleClose,
  intraClaim,
}) => {
  const approveIntraClaim = useIntraApproveClaim();
  const rejectIntraClaim = useRejectIntraClaim();
  const handleApproveIntraClaim = () => {
    approveIntraClaim.mutate(intraClaim.id);
    handleClose();
  };
  const handleRejectIntraClaim = () => {
    rejectIntraClaim.mutate(intraClaim.id);
    handleClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>イントラ依頼が届いています</DialogTitle>
          <DialogDescription>
            <div className=" justify-center space-x-4 mt-4">
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

export default MypageIntraModal;
