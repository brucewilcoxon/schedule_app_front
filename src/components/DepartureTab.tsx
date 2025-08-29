import React from "react";
import { NavLink } from "react-router-dom";

const DepartureTab = () => {
  return (
    <div className="mt-6">
      <nav className="flex  w-full border-b justify-center">
        <NavLink
          id="DepartureTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[30%] text-center"
          }
          to="/departure"
          end
        >
          出艇
        </NavLink>
        <NavLink
          id="DepartureTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[30%] text-center"
          }
          to="/departure/status"
          end
        >
          ステータス
        </NavLink>
        <NavLink
          id="DepartureTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[30%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[30%] text-center"
          }
          to="/departure/ranking"
          end
        >
          ランキング
        </NavLink>
      </nav>
    </div>
  );
};

export default DepartureTab;
