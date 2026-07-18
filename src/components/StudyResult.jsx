import { useState } from "react";
import { FileText, ListChecks, Workflow, BookMarked, Download, Loader2 } from "lucide-react";
import mermaid from "mermaid";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QuizTab from "./QuizTab";
import FlowchartView from "./FlowchartView";

// Builds a plain-text/markdown study sheet from the parsed AI result and
// triggers a browser download — no backend call needed.
const downloadStudyNotes = (study, analysis) => {
  const lines = [];
  const title = study?.videoTitle || "Study Notes";

  lines.push(`# ${title}`, "");

  if (analysis?.notes?.summary) {
    lines.push("## Summary", analysis.notes.summary, "");
  }

  if (analysis?.notes?.sections?.length) {
    lines.push("## Notes", "");
    analysis.notes.sections.forEach((section) => {
      lines.push(`### ${section.heading}`);
      (section.points || []).forEach((point) => lines.push(`- ${point}`));
      lines.push("");
    });
  }

  if (analysis?.keyTerms?.length) {
    lines.push("## Key Terms", "");
    analysis.keyTerms.forEach((item) => {
      lines.push(`**${item.term}** — ${item.definition}`);
    });
    lines.push("");
  }

  if (analysis?.quiz?.length) {
    lines.push("## Quiz", "");
    analysis.quiz.forEach((q, i) => {
      lines.push(`${i + 1}. ${q.question}`);
      (q.options || []).forEach((opt, j) => {
        const marker = j === q.correctIndex ? "[correct]" : "";
        lines.push(`   - ${opt} ${marker}`.trimEnd());
      });
      if (q.explanation) lines.push(`   _${q.explanation}_`);
      lines.push("");
    });
  }

  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^\w\- ]/g, "").trim() || "study-notes"}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// Renders notes + key terms + quiz + the mermaid flowchart into an
// offscreen container, then captures it into a paginated PDF. Runs entirely
// in the browser — no backend call, no server-side PDF rendering needed.
const downloadStudyPDF = async (study, analysis) => {
  const title = study?.videoTitle || "Study Notes";

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "760px";
  container.style.padding = "32px";
  container.style.background = "#ffffff";
  container.style.color = "#0f172a";
  container.style.fontFamily = "'Inter', Arial, sans-serif";

  const esc = (s = "") =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let html = `<h1 style="font-size:22px;margin:0 0 4px;">${esc(title)}</h1>`;

  if (analysis?.notes?.summary) {
    html += `<p style="font-size:13px;color:#475569;line-height:1.6;margin:0 0 20px;">${esc(
      analysis.notes.summary
    )}</p>`;
  }

  if (analysis?.notes?.sections?.length) {
    html += `<h2 style="font-size:16px;margin:20px 0 10px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Notes</h2>`;
    analysis.notes.sections.forEach((section) => {
      html += `<h3 style="font-size:14px;margin:14px 0 6px;">${esc(section.heading)}</h3>`;
      html += `<ul style="margin:0 0 8px;padding-left:20px;">`;
      (section.points || []).forEach((point) => {
        html += `<li style="font-size:12.5px;line-height:1.6;color:#334155;">${esc(point)}</li>`;
      });
      html += `</ul>`;
    });
  }

  // Mermaid flowchart — render to SVG and inline it directly into the PDF content.
  if (analysis?.mermaidFlowchart) {
    try {
      if (!mermaid.__pdfInit) {
        mermaid.initialize({ startOnLoad: false, theme: "default", securityLevel: "strict" });
        mermaid.__pdfInit = true;
      }
      const { svg } = await mermaid.render(`mermaid-pdf-${Date.now()}`, analysis.mermaidFlowchart);
      html += `<h2 style="font-size:16px;margin:24px 0 10px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Flowchart</h2>`;
      html += `<div style="margin:10px 0;">${svg}</div>`;
    } catch (err) {
      console.error("Mermaid render failed for PDF:", err);
    }
  }

  if (analysis?.keyTerms?.length) {
    html += `<h2 style="font-size:16px;margin:24px 0 10px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Key Terms</h2>`;
    analysis.keyTerms.forEach((item) => {
      html += `<p style="font-size:12.5px;line-height:1.6;margin:0 0 8px;"><strong>${esc(
        item.term
      )}</strong> — ${esc(item.definition)}</p>`;
    });
  }

  if (analysis?.quiz?.length) {
    html += `<h2 style="font-size:16px;margin:24px 0 10px;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Quiz</h2>`;
    analysis.quiz.forEach((q, i) => {
      html += `<p style="font-size:12.5px;font-weight:600;margin:14px 0 4px;">${i + 1}. ${esc(
        q.question
      )}</p>`;
      html += `<ul style="margin:0 0 4px;padding-left:20px;">`;
      (q.options || []).forEach((opt, j) => {
        const isCorrect = j === q.correctIndex;
        html += `<li style="font-size:12px;line-height:1.6;color:${
          isCorrect ? "#0d9488" : "#334155"
        };font-weight:${isCorrect ? "600" : "400"};">${esc(opt)}${
          isCorrect ? " ✓" : ""
        }</li>`;
      });
      html += `</ul>`;
      if (q.explanation) {
        html += `<p style="font-size:11.5px;color:#64748b;font-style:italic;margin:0 0 10px;">${esc(
          q.explanation
        )}</p>`;
      }
    });
  }

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${title.replace(/[^\w\- ]/g, "").trim() || "study-notes"}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
};
// same pattern as ComparisonResult.jsx, normalize both into a plain object.
export const parseStudyResult = (raw) => {
  if (!raw) return null;
  if (typeof raw === "object") return raw;

  const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback for responses with a conversational preamble before the
    // actual JSON object (e.g. "Here's your study kit: {...}").
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      console.error("Failed to parse study aiResult: no JSON object found");
      return null;
    }
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (err) {
      console.error("Failed to parse study aiResult:", err);
      return null;
    }
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
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const handlePdfDownload = async () => {
    setGeneratingPdf(true);
    try {
      await downloadStudyPDF(study, analysis);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setGeneratingPdf(false);
    }
  };

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
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif] line-clamp-2">
            {study?.videoTitle || "Untitled video"}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => downloadStudyNotes(study, analysis)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-700 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <Download size={14} />
              Markdown
            </button>
            <button
              onClick={handlePdfDownload}
              disabled={generatingPdf}
              className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {generatingPdf ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {generatingPdf ? "Generating..." : "PDF"}
            </button>
          </div>
        </div>
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