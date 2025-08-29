
import { NavLink, useLocation } from "react-router-dom";

const HeaderTab = () => {
  return (
    <div className="flex justify-center mb-3">
      <NavLink
        id="tab"
        className="p-1 border rounded-lg w-[30%] text-center"
        to="/windNote"
      >
        ノート
      </NavLink>
      <NavLink
        id="tab"
        className="p-1 border rounded-lg w-[30%] text-center ml-2"
        to="/question"
      >
        質問
      </NavLink>
    </div>
  );
};

export default HeaderTab;
