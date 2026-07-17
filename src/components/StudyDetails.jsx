import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { BASE_URL } from "../utils/constant";
import StudyResult, { parseStudyResult } from "./StudyResult";
import ChatTab from "./ChatTab";

const StudyDetails = () => {
  const { id } = useParams();

  const [study, setStudy] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    fetchStudy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStudy = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${BASE_URL}/study/${id}`, {
        withCredentials: true,
      });

      const session = res.data.studySession;
      setStudy(session);
      setAnalysis(parseStudyResult(session.aiResult));
    } catch (err) {
      console.log(err);
      setError(
        err?.response?.data?.message ||
          "Couldn't load this study session. It may not exist or you don't have access."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  if (error || !study) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
          {error || "Study session not found"}
        </p>
        <button
          onClick={fetchStudy}
          className="mt-4 inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium"
        >
          <RefreshCw size={14} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <Link
        to="/study/history"
        className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium mb-4"
      >
        <ArrowLeft size={15} />
        Back to Study History
      </Link>

      <StudyResult study={study} analysis={analysis} />

      <div className="mt-6">
        <button
          onClick={() => setShowChat((s) => !s)}
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium mb-4"
        >
          {showChat ? "Hide Chat" : "Ask AI about this video"}
        </button>

        {showChat && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <ChatTab videoId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyDetails;