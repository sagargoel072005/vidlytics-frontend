import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  History as HistoryIcon,
  PlusCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-comparison", label: "New Comparison", icon: PlusCircle },
  { to: "/history", label: "History", icon: HistoryIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col font-['Inter',sans-serif]">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-200">
        <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center relative shrink-0">
          <div className="h-1.5 w-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
          <svg width="16" height="16" fill="#0D9488" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-slate-900 text-lg font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
          Vidlytics
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-[0.15em] text-slate-400 px-3 mb-2">
          MENU
        </p>

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname.includes(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                active
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          );
        })}

        <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-[0.15em] text-slate-400 px-3 mt-6 mb-2">
          ACCOUNT
        </p>

        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
            location.pathname.includes("/profile")
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
          }`}
        >
          <User size={18} strokeWidth={1.75} />
          Profile
        </Link>


      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
          <LogOut size={18} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
