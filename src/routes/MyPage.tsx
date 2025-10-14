import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../@/components/ui/avatar";
import NoteHeader from "../components/NoteHeader";
import { Button } from "../@/components/ui/button";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useGetUser } from "../queries/AuthQuery";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";

export function MyPage() {
  const { data: user } = useGetUser();
  const [open, setOpen] = useState(false);
  console.log(user?.user_profile?.profile_image);
  const close = () => {
    setOpen(false);
  };
  return (
    <Layout>
      <RequireAuth>
        <NoteHeader />
       
        <div className="mt-6">
          <nav className="flex  w-full border-b justify-center">
            {/* <NavLink
              id="MyPageTab"
              className={({ isActive }) =>
                isActive
                  ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
                  : "text-gray-400 w-[30%] text-center"
              }
              to="intra"
            >
              イントラ
            </NavLink> */}
            <NavLink
              id="MyPageTab"
              className={({ isActive }) =>
                isActive
                  ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
                  : "text-gray-400 w-[30%] text-center"
              }
              to="note"
            >
              ノート
            </NavLink>
            <NavLink
              id="MyPageTab"
              className={({ isActive }) =>
                isActive
                  ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
                  : "text-gray-400 w-[30%] text-center"
              }
              to="question"
            >
              質問
            </NavLink>
            <NavLink
              id="MyPageTab"
              className={({ isActive }) =>
                isActive
                  ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
                  : "text-gray-400 w-[30%] text-center"
              }
              to="answer"
            >
              回答
            </NavLink>
          </nav>
          <Outlet context={{ user }} />
        </div>
      </RequireAuth>
    </Layout>
  );
}
