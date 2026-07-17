import { useState } from "react";
import { FileText, ListChecks, Workflow, BookMarked } from "lucide-react";
import QuizTab from "./QuizTab";
import FlowchartView from "./FlowchartView";

// aiResult can come back as a real object or as a "```json {...}```" string —
// same pattern as ComparisonResult.jsx, normalize both into a plain object.
export const parseStudyResult = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  try {
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Failed to parse study aiResult:", err);
    return null;
  }
};

const TABS = [
  { key: "notes", label: "Notes", icon: FileText },
  { key: "quiz", label: "Quiz", icon: ListChecks },
  { key: "flowchart", label: "Flowchart", icon: Workflow },
  { key: "terms", label: "Key Terms", icon: BookMarked },
];

const StudyResult = ({ study, analysis }) => {
  const [tab, setTab] = useState("notes");

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
        <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
          Study kit not available
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          This session doesn't have saved results yet — it may still be
          processing or the AI step failed. Try again.
        </p>
      </div>
    );
  }

  return (
    <div className="font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 mb-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif] line-clamp-2">
          {study?.videoTitle || "Untitled video"}
        </h1>
        {analysis?.notes?.summary && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {analysis.notes.summary}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t.key
                  ? "border-teal-600 text-teal-700 dark:text-teal-400"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "notes" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-6">
          {analysis?.notes?.sections?.length ? (
            analysis.notes.sections.map((section, i) => (
              <div key={i}>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 font-['Space_Grotesk',sans-serif]">
                  {section.heading}
                </h3>
                <ul className="space-y-1.5 list-disc list-inside">
                  {section.points?.map((point, j) => (
                    <li key={j} className="text-sm text-slate-600 dark:text-slate-300">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">No notes available.</p>
          )}
        </div>
      )}

      {tab === "quiz" && <QuizTab questions={analysis?.quiz || []} />}

      {tab === "flowchart" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          {analysis?.mermaidFlowchart ? (
            <FlowchartView chart={analysis.mermaidFlowchart} />
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              No flowchart available for this video.
            </p>
          )}
        </div>
      )}

      {tab === "terms" && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          {analysis?.keyTerms?.length ? (
            <dl className="grid sm:grid-cols-2 gap-4">
              {analysis.keyTerms.map((item, i) => (
                <div
                  key={i}
                  className="border border-slate-200 dark:border-slate-700 rounded-xl p-4"
                >
                  <dt className="text-sm font-semibold text-teal-700 dark:text-teal-400 mb-1">
                    {item.term}
                  </dt>
                  <dd className="text-sm text-slate-600 dark:text-slate-300">
                    {item.definition}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">
              No key terms extracted for this video.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyResult;