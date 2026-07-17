import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  History as HistoryIcon,
  BookOpen,
  User,
  LogOut,
  X,
} from "lucide-react";
import { logoutAPI } from "../services/authService";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/study", label: "Study Mode", icon: BookOpen },
  { to: "/history", label: "History", icon: HistoryIcon },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/");
    }
  };

  const handleNavClick = () => {
    // mobile pe link click hote hi sidebar band ho jaye
    if (window.innerWidth < 1024) onClose?.();
  };

  return (
    <>
      {/* Mobile backdrop — sirf jab sidebar open ho aur mobile screen ho */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col font-['Inter',sans-serif] z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between gap-3 px-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center relative shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
              <svg width="16" height="16" fill="#0D9488" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-slate-900 dark:text-slate-100 text-lg font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
              Vidlytics
            </span>
          </div>

          {/* Close button — sirf mobile pe dikhega */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-rose-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-[0.15em] text-slate-400 dark:text-slate-500 px-3 mb-2">
            MENU
          </p>

          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.includes(to);
            return (
              <Link
                key={to}
                to={to}
                onClick={handleNavClick}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
                  active
                    ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent"
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            );
          })}

          <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-[0.15em] text-slate-400 dark:text-slate-500 px-3 mt-6 mb-2">
            ACCOUNT
          </p>

          <Link
            to="/profile"
            onClick={handleNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
              location.pathname.includes("/profile")
                ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent"
            }`}
          >
            <User size={18} strokeWidth={1.75} />
            Profile
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;