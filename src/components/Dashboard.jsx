import { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import CompareForm from "./CompareForm";
import ProgressBar from "./ProgressBar";
import ResultCard from "./ResultCard";
import { addUser } from "../utils/authSlice";
import { BASE_URL } from "../utils/constant";

function Dashboard() {

  const dispatch = useDispatch();
const [progress,setProgress] =
useState(0);

const [result,setResult] =
useState(null);
  const user = useSelector(
    (store) => store.user.user
  );

  const fetchProfile = async () => {
    try {

      const res = await axios.get(
        `${BASE_URL}/profile/view`,
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data));

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    if (!user) {
      fetchProfile();
    }

  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="bg-white p-8 rounded-xl shadow">

            <h1 className="text-3xl font-bold mb-4">
              Welcome
            </h1>

            <p className="text-lg">
              {user?.firstName}
            </p>

            <p className="text-gray-500 mt-2">
              {user?.emailId}
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-xl">
                Comparisons
              </h2>

              <p className="text-4xl mt-3">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-xl">
                AI Chats
              </h2>

              <p className="text-4xl mt-3">
                0
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="font-bold text-xl">
                History
              </h2>

              <p className="text-4xl mt-3">
                0
              </p>
            </div>

          </div>

        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

  <div>

    <CompareForm
      setProgress={setProgress}
      setResult={setResult}
    />

    <ProgressBar
      progress={progress}
    />

    <ResultCard
      result={result}
    />

  </div>

  <div>

    {
      result?._id && (
        <ChatPanel
          videoId={result._id}
        />
      )
    }

  </div>

</div>
    </div>
  );
}

export default Dashboard;