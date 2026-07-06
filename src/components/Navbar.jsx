import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { logoutAPI } from "../services/authService";
import { useDarkMode } from "../hooks/useDarkMode";

const Navbar = ({ onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dark, setDark] = useDarkMode();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user);
  const name = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Account";

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  const handleProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleNotifToggle = () => {
    setNotifOpen((o) => !o);
    if (!notifOpen) markAllRead();
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 font-['Inter',sans-serif]">
      <button
        onClick={onToggleSidebar}
        className="text-slate-400 hover:text-teal-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <button
          onClick={() => setDark((d) => !d)}
          className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition-all"
        >
          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>



        {/* Account dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold font-['Space_Grotesk',sans-serif] text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
              {name}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg py-1 z-20">
              <button
                onClick={handleProfile}
                className="w-full text-left px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;