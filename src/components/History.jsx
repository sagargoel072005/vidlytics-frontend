import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Eye, Video } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const scoreColor = (score) => {
  if (score >= 75) return "text-teal-600 bg-teal-50 border-teal-200";
  if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-rose-600 bg-rose-50 border-rose-200";
};

const History = () => {
  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    const res = await axios.get(`${BASE_URL}/history`, {
      withCredentials: true,
    });

    setHistory(res.data.history);
  };

  const deleteComparison = async (id) => {
    await axios.delete(`${BASE_URL}/history/${id}`, {
      withCredentials: true,
    });

    getHistory();
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
          Comparison History
        </h1>
        <p className="text-slate-500 mt-1">
          Every video comparison you've run, in one place.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.05)] overflow-hidden">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-4">
              <Video size={22} className="text-teal-600" />
            </div>
            <p className="text-slate-900 font-medium mb-1">No comparisons yet</p>
            <p className="text-slate-500 text-sm">
              Run your first comparison to see it appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 font-['JetBrains_Mono',monospace] text-[11px] tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">Comparison</th>
                <th className="py-4 px-6">Similarity</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 px-6">
                    <p className="text-slate-900 font-medium line-clamp-1">
                      {item.video1}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                      vs {item.video2}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    {item.similarityScore != null ? (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreColor(
                          item.similarityScore
                        )}`}
                      >
                        {item.similarityScore}%
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-500 font-['JetBrains_Mono',monospace] text-xs">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/history/${item._id}`}
                        className="flex items-center gap-1.5 text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye size={13} />
                        View
                      </Link>
                      <button
                        onClick={() => deleteComparison(item._id)}
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
