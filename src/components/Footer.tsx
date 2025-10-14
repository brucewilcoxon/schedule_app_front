import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

const Footer = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md bg-white backdrop-blur-md border-t sticky bottom-0 z-10 shadow-lg">
      <div className="flex justify-between items-center px-3 py-1">
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-700 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-white bg-gradient-to-br shadow-xl shadow-blue-500/40 border border-blue-400/30 animate-pulse"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`
          }
          to="/calendar"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-1 rounded-full transition-all duration-700 ${
                isActive 
                  ? "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-xl shadow-blue-500/50 animate-bounce relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer"
                  : "hover:bg-gray-100 hover:shadow-lg"
              }`}>
                <CalendarMonthOutlinedIcon style={{ fontSize: 24 }} />
              </div>
              {/* <p className="text-xs font-bold tracking-wide">スケジュール</p> */}
            </div>
          )}
        </NavLink>
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-700 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-white bg-gradient-to-br shadow-xl shadow-green-500/40 border border-green-400/30 animate-pulse"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`
          }
          to="/gasManagement"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-1 rounded-full transition-all duration-700 ${
                isActive 
                  ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 shadow-xl shadow-green-500/50 animate-bounce relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer"
                  : "hover:bg-gray-100 hover:shadow-lg"
              }`}>
                <LocalGasStationIcon style={{ fontSize: 24 }} />
              </div>
              {/* <p className="text-xs font-bold tracking-wide">ガス管理</p> */}
            </div>
          )}
        </NavLink>
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-700 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-white bg-gradient-to-br shadow-xl shadow-purple-500/40 border border-purple-400/30 animate-pulse"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`
          }
          to="/windNote"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-1 rounded-full transition-all duration-700 ${
                isActive 
                  ? "bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-600 shadow-xl shadow-purple-500/50 animate-bounce relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer"
                  : "hover:bg-gray-100 hover:shadow-lg"
              }`}>
                <EditNoteOutlinedIcon style={{ fontSize: 24 }} />
              </div>
              {/* <p className="text-xs font-bold tracking-wide">ノート</p> */}
            </div>
          )}
        </NavLink>
       
        {/* More menu button (fourth button) */}
        <div className="relative flex-1" ref={menuRef}>
          <button
            id="footer-more"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-full relative flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-700 ease-out transform hover:scale-105 hover:rotate-1 ${
              isMenuOpen
                ? "text-white bg-gradient-to-br shadow-xl shadow-orange-500/40 border border-orange-400/30 animate-pulse"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-1 rounded-full transition-all duration-700 ${
                isMenuOpen 
                  ? "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-600 shadow-xl shadow-orange-500/50 animate-bounce relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer"
                  : "hover:bg-gray-100 hover:shadow-lg"
              }`}>
                <SettingsIcon style={{ fontSize: 24 }} />
              </div>
              {/* <p className="text-xs font-bold tracking-wide">メニュー</p> */}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-14 left-1/3 -translate-x-1/2 w-44 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-20 p-2 space-y-2">
              <NavLink
                to="/userManagement"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-[#662EAF]/10 text-[#662EAF]" : "hover:bg-gray-50"
                  }`
                }
              >
                <PeopleAltOutlinedIcon fontSize="small" />
                <span className="text-sm">ユーザー管理</span>
              </NavLink>
              <NavLink
                to="/myPage/note"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-[#662EAF]/10 text-[#662EAF]" : "hover:bg-gray-50"
                  }`
                }
              >
                <PermIdentityOutlinedIcon fontSize="small" />
                <span className="text-sm">マイページ</span>
              </NavLink>
            </div>
          )}
        </div>
       
        {/* <NavLink
          id="footer1"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-[#662EAF] bg-[#662EAF]/10 shadow-lg shadow-[#662EAF]/20 border border-[#662EAF]/20 animate-pulse"
                : "text-gray-600 hover:text-[#662EAF] hover:bg-[#662EAF]/5"
            }`
          }
          to="/windNote"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? "bg-gradient-to-br from-[#662EAF]/30 to-[#662EAF] shadow-lg shadow-[#662EAF]/30 animate-bounce" 
                  : "hover:bg-gradient-to-br hover:from-[#662EAF]/20 hover:to-[#662EAF]/20 hover:shadow-lg"
              }`}>
                <EditNoteOutlinedIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide">ノート</p>
            </div>
          )}
        </NavLink> */}
        {/* <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:-rotate-1 ${
              isActive
                ? "text-[#662EAF] bg-[#662EAF]/10 shadow-lg shadow-[#662EAF]/20 border border-[#662EAF]/20 animate-pulse"
                : "text-gray-600 hover:text-[#662EAF] hover:bg-[#662EAF]/5"
            }`
          }
          to="/userManagement"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? "bg-gradient-to-br from-[#662EAF]/30 to-[#662EAF] shadow-lg shadow-[#662EAF]/30 animate-bounce" 
                  : "hover:bg-gradient-to-br hover:from-[#662EAF]/20 hover:to-[#662EAF]/20 hover:shadow-lg"
              }`}>
                <PeopleAltOutlinedIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide" >ユーザー管理</p>
            </div>
          )}
        </NavLink>
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-[#662EAF] bg-[#662EAF]/10 shadow-lg shadow-[#662EAF]/20 border border-[#662EAF]/20 animate-pulse"
                : "text-gray-600 hover:text-[#662EAF] hover:bg-[#662EAF]/5"
            }`
          }
          to="/myPage/intra"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? "bg-gradient-to-br from-[#662EAF]/30 to-[#662EAF] shadow-lg shadow-[#662EAF]/30 animate-bounce" 
                  : "hover:bg-gradient-to-br hover:from-[#662EAF]/20 hover:to-[#662EAF]/20 hover:shadow-lg"
              }`}>
                <PermIdentityOutlinedIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide">マイページ</p>
            </div>
          )}
        </NavLink> */}
      </div>
    </div>
  );
};

export default Footer;
