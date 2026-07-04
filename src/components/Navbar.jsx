import { useState } from "react";
import { Menu, Bell, Sun, Moon, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

const Navbar = ({ onToggleSidebar }) => {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useSelector((store) => store.user);
  const name = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Account";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 font-['Inter',sans-serif]">
      <button
        onClick={onToggleSidebar}
        className="text-slate-400 hover:text-teal-600 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-5">
        <button
          onClick={() => setDark((d) => !d)}
          className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
        >
          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button className="relative h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 transition-colors"
          >
            <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold font-['Space_Grotesk',sans-serif] text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {name}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20">
              <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">
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
