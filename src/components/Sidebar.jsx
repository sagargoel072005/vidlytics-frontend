import { Link } from "react-router-dom";

function Sidebar(){

  return (

    <div className="w-64 bg-slate-900 text-white h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        Vidlytics
      </h1>

      <div className="space-y-5">

        <Link
          to="/dashboard"
          className="block hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/history"
          className="block hover:text-blue-400"
        >
          History
        </Link>

      </div>

    </div>

  );
}

export default Sidebar;