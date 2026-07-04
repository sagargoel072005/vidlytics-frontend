import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  TrendingUp,
  Layers,
  GitCompare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { BASE_URL } from "../utils/constant";
import ChatTab from "../components/ChatTab";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "transcript", label: "Transcript" },
  { key: "chat", label: "AI Chat" },
];

const ScoreRing = ({ score = 0 }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#0D9488"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
          {score}%
        </span>
        <span className="text-[10px] text-slate-400 font-['JetBrains_Mono',monospace]">
          SIMILARITY
        </span>
      </div>
    </div>
  );
};

const ComparisonDetails = () => {
  const { id } = useParams();

  const [comparison, setComparison] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/history/${id}`, {
        withCredentials: true,
      });

      const comp = res.data.comparison;
      setComparison(comp);

      const cleaned = comp.aiResult
        ?.replace("```json", "")
        ?.replace("```", "")
        ?.trim();

      setAnalysis(JSON.parse(cleaned));
    } catch (err) {
      console.log(err);
    }
  };

  if (!comparison || !analysis) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium mb-4"
      >
        <ArrowLeft size={15} />
        Back to History
      </Link>

      {/* Header card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif] mb-1 line-clamp-1">
              {comparison.video1Title || "Video 1"}
            </h1>
            <p className="text-teal-600 font-['JetBrains_Mono',monospace] text-xs mb-1">VS</p>
            <h2 className="text-lg font-semibold text-slate-700 line-clamp-1">
              {comparison.video2Title || "Video 2"}
            </h2>
          </div>

          <ScoreRing score={analysis.similarityScore || 0} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: "Similarity", value: `${analysis.similarityScore || 0}%` },
          { icon: Layers, label: "Common Topics", value: analysis?.commonTopics?.length || 0 },
          { icon: GitCompare, label: "Key Differences", value: analysis?.differences?.length || 0 },
          { icon: Clock, label: "Duration", value: comparison.totalDuration || "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-2xl p-5"
          >
            <div className="h-9 w-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-3">
              <Icon size={16} className="text-teal-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 font-['Space_Grotesk',sans-serif]">
              {value}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 font-['Space_Grotesk',sans-serif]">
              Common Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis?.commonTopics?.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1.5"
                >
                  <CheckCircle2 size={12} />
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4 font-['Space_Grotesk',sans-serif]">
              Key Differences
            </h3>
            <div className="space-y-4">
              {analysis?.differences?.map((diff, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-1">
                    <AlertCircle size={12} />
                    Video 1
                  </p>
                  <p className="text-sm text-slate-600 mb-3">{diff.transcript1}</p>

                  <p className="text-xs font-semibold text-teal-600 mb-1">Video 2</p>
                  <p className="text-sm text-slate-600">{diff.transcript2}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-teal-50/60 border border-teal-200 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-2 font-['Space_Grotesk',sans-serif]">
              AI Summary
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </div>
      )}

      {tab === "transcript" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-semibold text-slate-900 mb-3 font-['Space_Grotesk',sans-serif]">
              Transcript 1
            </h3>
            <textarea
              rows="14"
              readOnly
              value={comparison.transcript1}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 focus:outline-none resize-none"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="font-semibold text-slate-900 mb-3 font-['Space_Grotesk',sans-serif]">
              Transcript 2
            </h3>
            <textarea
              rows="14"
              readOnly
              value={comparison.transcript2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {tab === "chat" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <ChatTab videoId={id} />
        </div>
      )}
    </div>
  );
};

export default ComparisonDetails;
