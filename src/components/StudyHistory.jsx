import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Eye,
  Video,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { extractYouTubeId } from "./ComparisonResult";

const StudyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const getHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/study/history`, {
        withCredentials: true,
      });
      setHistory(res.data.history || []);
    } catch (err) {
      console.log(err);
      setError("Couldn't load your study history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudySession = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${BASE_URL}/study/${id}`, {
        withCredentials: true,
      });
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.log(err);
      setError("Couldn't delete that session. Please try again.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
            Study History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Every study kit you've generated, in one place.
          </p>
        </div>
        {!loading && (
          <button
            onClick={getHistory}
            className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.05)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-4">
              <BookOpen size={22} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
              No study sessions yet
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Generate your first study kit to see it appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 dark:text-slate-500 font-['JetBrains_Mono',monospace] text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="py-4 px-6">Video</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const hasResult = !!item.aiResult;

                return (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 dark:border-slate-700/60 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          {extractYouTubeId(item.videoUrl) ? (
                            <img
                              src={`https://img.youtube.com/vi/${extractYouTubeId(
                                item.videoUrl
                              )}/hqdefault.jpg`}
                              alt="thumbnail"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Video size={14} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        <p className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1 min-w-0">
                          {item.videoTitle || item.videoUrl}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {hasResult ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-teal-600 bg-teal-50 border-teal-200 dark:text-teal-400 dark:bg-teal-900/30 dark:border-teal-800">
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/30 dark:border-amber-800">
                          Processing
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-['JetBrains_Mono',monospace] text-xs">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/study/${item._id}`}
                          className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye size={13} />
                          View
                        </Link>

                        {confirmId === item._id ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => deleteStudySession(item._id)}
                              disabled={deletingId === item._id}
                              className="text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1.5 rounded-lg disabled:opacity-50"
                            >
                              {deletingId === item._id ? "..." : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1.5"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(item._id)}
                            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudyHistory;