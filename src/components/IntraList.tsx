import React from "react";
import { useGetIntraClaims } from "../queries/IntraClaimQuery";
import IntraClaim from "./IntraClaim";
import { User } from "../types/user";
import { useOutletContext } from "react-router-dom";
type IntraListContextType = { user: User };

const IntraList = () => {
  const { data: intraClaims } = useGetIntraClaims();
  const { user } = useOutletContext<IntraListContextType>();

  return (
    <div className="px-4">
      <p className="text-gray-400 mb-2">出艇前のイントラが表示されます</p>
      <div className="space-y-2">
        {intraClaims?.map((intraClaim) => (
          <IntraClaim key={intraClaim.id} intraClaim={intraClaim} user={user} />
        ))}
      </div>
    </div>
  );
};

export default IntraList;
