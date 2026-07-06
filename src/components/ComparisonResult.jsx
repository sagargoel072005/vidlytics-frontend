import {
  TrendingUp,
  Layers,
  GitCompare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
} from "lucide-react";
import ChatTab from "./ChatTab";

export const parseAIResult = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  try {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse aiResult:", err);
    return null;
  }
};

export const parseScore = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const n = parseInt(value.replace("%", ""), 10);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
};

export const extractYouTubeId = (url = "") => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
};

const VideoPreview = ({ url, title, duration, channel }) => {
  const videoId = extractYouTubeId(url);
  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <div className="relative h-16 w-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title || "video thumbnail"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Play size={18} className="text-slate-400" />
          </div>
        )}
        {duration && (
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-['JetBrains_Mono',monospace] px-1.5 py-0.5 rounded">
            {duration}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
          {title || "Untitled video"}
        </p>
        {channel && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Channel: {channel}
          </p>
        )}
      </div>
    </div>
  );
};

export const ScoreRing = ({ score = 0 }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-slate-100 dark:text-slate-700"
          strokeWidth="10"
        />
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
        <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
          {score}%
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-['JetBrains_Mono',monospace]">
          SIMILARITY
        </span>
      </div>
    </div>
  );
};

const ComparisonResult = ({ comparison, analysis, comparisonId }) => {
  if (!analysis) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
        <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
          Result not available
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This comparison doesn't have a saved result yet — it may still be
          processing or the AI step failed. Try running the comparison again.
        </p>
      </div>
    );
  }

  const score = parseScore(analysis.similarityScore);

  return (
    <div className="font-['Inter',sans-serif]">
      {/* Header card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:shadow-none">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <VideoPreview
              url={comparison?.video1}
              title={comparison?.video1Title}
              duration={comparison?.video1Duration}
              channel={comparison?.video1Channel}
            />

            <span className="text-xs font-['JetBrains_Mono',monospace] tracking-widest text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-3 py-1.5 shrink-0">
              VS
            </span>

            <VideoPreview
              url={comparison?.video2}
              title={comparison?.video2Title}
              duration={comparison?.video2Duration}
              channel={comparison?.video2Channel}
            />
          </div>

          <ScoreRing score={score} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: TrendingUp, label: "Similarity", value: `${score}%` },
          { icon: Layers, label: "Common Topics", value: analysis?.commonTopics?.length || 0 },
          { icon: GitCompare, label: "Key Differences", value: analysis?.differences?.length || 0 },
          { icon: Clock, label: "Duration", value: comparison?.totalDuration || "—" },
        ].map(({ icon: Icon, label, value }) => (
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

      {/* Topics / differences / summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 font-['Space_Grotesk',sans-serif]">
            Common Topics
          </h3>
          <div className="flex flex-wrap gap-2">
            {analysis?.commonTopics?.map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-3 py-1.5"
              >
                <CheckCircle2 size={12} />
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 font-['Space_Grotesk',sans-serif]">
            Key Differences
          </h3>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {analysis?.differences?.map((diff, i) => (
              <div
                key={i}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  <AlertCircle size={12} />
                  Video 1
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                  {diff.transcript1}
                </p>

                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 mb-1">
                  Video 2
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {diff.transcript2}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-teal-50/60 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 font-['Space_Grotesk',sans-serif]">
            AI Summary
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {comparisonId && (
          <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
                <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
                Ask AI about this comparison
              </h3>
            </div>
            <ChatTab videoId={comparisonId} showHeader={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonResult;