import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Eye, Video, BarChart3, TrendingUp, Clock, Download } from "lucide-react";
import { generateComparisonPDF } from "../utils/generateReport";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { extractYouTubeId, parseAIResult, parseScore } from "./ComparisonResult";

const scoreColor = (score) => {
  if (score >= 75)
    return "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800";
  if (score >= 50)
    return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800";
  return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800";
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const getHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/history`, {
        withCredentials: true,
      });
      setHistory(res.data.history);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const downloadReport = (item) => {
  const analysis = parseAIResult(item.aiResult);
  generateComparisonPDF(item, analysis);
};
  const deleteComparison = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/history/${id}`, {
        withCredentials: true,
      });
      getHistory();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  const scoredHistory = history.map((h) => {
    const analysis = parseAIResult(h.aiResult);
    const score = analysis ? parseScore(analysis.similarityScore) : null;
    return { ...h, _score: score };
  });

  const totalComparisons = scoredHistory.length;

  const avgSimilarity = totalComparisons
    ? Math.round(
        scoredHistory.reduce((sum, h) => sum + (h._score || 0), 0) /
          totalComparisons
      )
    : 0;

  const totalVideos = totalComparisons * 2;

  const totalMinutes = history.reduce(
    (sum, h) => sum + (h.durationMinutes || 0),
    0
  );
  const totalHours = (totalMinutes / 60).toFixed(1);

  const STATS = [
    { icon: BarChart3, label: "Total Comparisons", value: totalComparisons },
    { icon: TrendingUp, label: "Avg. Similarity Score", value: `${avgSimilarity}%` },
    { icon: Video, label: "Total Videos Analyzed", value: totalVideos },
    { icon: Clock, label: "Total Hours Processed", value: totalHours },
  ];

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
          Comparison History
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Every video comparison you've run, in one place.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5"
          >
            <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-3">
              <Icon size={16} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
              {value}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:shadow-none overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
          </div>
        ) : scoredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center mb-4">
              <Video size={22} className="text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
              No comparisons yet
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Run your first comparison to see it appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 dark:text-slate-500 font-['JetBrains_Mono',monospace] text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <th className="py-4 px-6">Comparison</th>
                <th className="py-4 px-6">Similarity</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scoredHistory.map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-slate-100 dark:border-slate-700/50 last:border-0 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                        {extractYouTubeId(item.video1) ? (
                          <img
                            src={`https://img.youtube.com/vi/${extractYouTubeId(item.video1)}/hqdefault.jpg`}
                            alt="thumbnail"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Video size={14} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1">
                          {item.video1Title || item.video1}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 line-clamp-1">
                          vs {item.video2Title || item.video2}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {item._score != null ? (
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${scoreColor(item._score)}`}
                      >
                        {item._score}%
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-['JetBrains_Mono',monospace] text-xs">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                  </td>
<td className="py-4 px-6">
  <div className="flex items-center justify-end gap-2">
    <Link
      to={`/history/${item._id}`}
      className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 hover:text-teal-700 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200 dark:border-teal-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
    >
      <Eye size={13} />
      View
    </Link>
    <button
      onClick={() => downloadReport(item)}
      disabled={!parseAIResult(item.aiResult)}
      title={!parseAIResult(item.aiResult) ? "Report not ready" : "Download report"}
      className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      <Download size={14} />
    </button>
    <button
      onClick={() => deleteComparison(item._id)}
      className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
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