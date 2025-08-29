import React, { useState } from "react";
import { IntraClaimType } from "../types/IntraClaim";
import dayjs from "dayjs";
import { User } from "../types/user";
import MypageIntraModal from "./MypageIntraModal";

const IntraClaim = ({
  intraClaim,
  user,
}: {
  intraClaim: IntraClaimType;
  user: User;
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  if (intraClaim.status === "reject") {
    return null;
  }

  const isReceivingPendingClaim =
    intraClaim.status === "pending" && intraClaim.user.id !== user.id;

  return (
    <>
      <button
        className="w-full p-3 pr-6 rounded shadow-md bg-white hover:shadow-xl transition cursor-pointer"
        onClick={() => {
          if (isReceivingPendingClaim) {
            setOpen(true);
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <div>
            <p className="text-sm">
              {intraClaim.departure.start
                ? dayjs(intraClaim.departure.start).format("M/D")
                : "日付不明"}
            </p>
          </div>
          <div className="flex flex-col items-center text-xs">
            <p>
              {intraClaim.departure.start
                ? dayjs(intraClaim.departure.start).format("H:mm")
                : "日付不明"}
            </p>
            <p>l</p>
            <p>
              {intraClaim.departure.end
                ? dayjs(intraClaim.departure.end).format("H:mm")
                : "日付不明"}
            </p>
          </div>
          <div className="text-xs">
            {intraClaim.status === "pending" &&
              intraClaim.user.id === user.id && (
                <p className="">
                  {intraClaim.intra_user.user_profile?.name}さんに出艇依頼中です
                </p>
              )}
            {intraClaim.status === "pending" &&
              intraClaim.user.id !== user.id && (
                <p>
                  {intraClaim.user.user_profile?.name}
                  さんから出艇依頼が届いています
                </p>
              )}
            {intraClaim.status === "approve" &&
              intraClaim.user.id === user.id && (
                <p className="">
                  {intraClaim.intra_user.user_profile?.name}
                  さんとの出艇が確定しました
                </p>
              )}
            {intraClaim.status === "approve" &&
              intraClaim.user.id !== user.id && (
                <p className="">
                  {intraClaim.user.user_profile?.name}さんとの出艇が確定しました
                </p>
              )}
          </div>
        </div>
      </button>
      <MypageIntraModal
        open={open}
        handleClose={handleClose}
        intraClaim={intraClaim}
      />
    </>
  );
};

export default IntraClaim;
