import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 font-['Inter',sans-serif]">
      {sidebarOpen && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
