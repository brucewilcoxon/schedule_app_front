import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalGasStationOutlinedIcon from "@mui/icons-material/LocalGasStationOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

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
    <div className="w-full max-w-md bg-gradient-to-r from-cyan-400/90 via-blue-500/90 to-blue-700/90 backdrop-blur-md border-t sticky bottom-0 z-10 shadow-lg">
      <div className="flex justify-between items-center px-3 py-2">
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:rotate-1 ${
              isActive
                ? "text-white bg-white/20 shadow-lg shadow-white/20 border border-white/20 animate-pulse"
                : "text-white hover:text-white hover:bg-white/10"
            }`
          }
          to="/calendar"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? "bg-white/20 shadow-lg shadow-white/30 animate-bounce"
                  : "hover:bg-white/20 hover:shadow-lg"
              }`}>
                <CalendarMonthOutlinedIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide">スケジュール</p>
            </div>
          )}
        </NavLink>
        <NavLink
          id="footer"
          className={({ isActive }) =>
            `relative flex-1 flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:-rotate-1 ${
              isActive
                ? "text-white bg-white/20 shadow-lg shadow-white/20 border border-white/20 animate-pulse"
                : "text-white hover:text-white hover:bg-white/10"
            }`
          }
          to="/departure"
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center space-y-1">
              <div className={`p-2 rounded-full transition-all duration-500 ${
                isActive 
                  ? "bg-white/20 shadow-lg shadow-white/30 animate-bounce" 
                  : "hover:bg-white/20 hover:shadow-lg"
              }`}>
                <LocalGasStationOutlinedIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide">ガス管理</p>
            </div>
          )}
        </NavLink>
        {/* More menu button (third button) */}
        <div className="relative flex-1" ref={menuRef}>
          <button
            id="footer-more"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`w-full relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-500 ease-out transform hover:scale-105 hover:rotate-1 ${
              isMenuOpen
                ? "text-white bg-white/20 shadow-lg shadow-white/20 border border-white/20"
                : "text-white hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="p-2 rounded-full transition-all duration-500 hover:bg-white/20 hover:shadow-lg">
                <MoreHorizIcon className="text-lg" />
              </div>
              <p className="text-xs font-bold tracking-wide">メニュー</p>
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-44 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-20 p-2 space-y-2">
              <NavLink
                to="/windNote"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-[#662EAF]/10 text-[#662EAF]" : "hover:bg-gray-50"
                  }`
                }
              >
                <EditNoteOutlinedIcon fontSize="small" />
                <span className="text-sm">ノート</span>
              </NavLink>
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
