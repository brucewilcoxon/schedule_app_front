import React from "react";
import { NavLink } from "react-router-dom";

const RefrigerantTab = () => {
  return (
    <div className="mt-6">
      <nav className="flex  w-full border-b justify-center">
        <NavLink
          id="RefrigerantTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[25%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[25%] text-center"
          }
          to="/refrigerant"
          end
        >
          ガス管理
        </NavLink>
        <NavLink
          id="RefrigerantTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[25%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[25%] text-center"
          }
          to="/refrigerant/company"
          end
        >
          会社
        </NavLink>
        <NavLink
          id="RefrigerantTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[25%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[25%] text-center"
          }
          to="/refrigerant/workplace"
          end
        >
          Workplace
        </NavLink>
        <NavLink
          id="RefrigerantTab"
          className={({ isActive }) =>
            isActive
              ? "text-black w-[25%] text-center border-b-2 pb-2 border-black"
              : "text-gray-400 w-[25%] text-center"
          }
          to="/refrigerant/document"
          end
        >
          ドキュメント
        </NavLink>
      </nav>
    </div>
  );
};

export default RefrigerantTab; 