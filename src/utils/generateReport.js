import jsPDF from "jspdf";

export const generateComparisonPDF = (comparison, analysis) => {
  if (!analysis) return;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 60;

  const addText = (text, size = 11, color = "#334155", bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(String(text ?? "—"), pageWidth - margin * 2);
    lines.forEach((line) => {
      if (y > 780) {
        doc.addPage();
        y = 60;
      }
      doc.text(line, margin, y);
      y += size * 1.4;
    });
  };

  const divider = () => {
    y += 6;
    doc.setDrawColor("#E2E8F0");
    doc.line(margin, y, pageWidth - margin, y);
    y += 18;
  };

  // Header
  addText("Vidlytics — Comparison Report", 18, "#0F172A", true);
  y += 4;
  addText(
    `Generated on ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
    9,
    "#94A3B8"
  );
  divider();

  // Videos
  addText("Video 1", 10, "#0D9488", true);
  addText(comparison?.video1Title || comparison?.video1, 11);
  y += 6;
  addText("Video 2", 10, "#0D9488", true);
  addText(comparison?.video2Title || comparison?.video2, 11);
  divider();

  // Score
  const rawScore = analysis.similarityScore;
  const score =
    typeof rawScore === "string" ? parseInt(rawScore.replace("%", ""), 10) : rawScore;
  addText(`Similarity Score: ${Number.isFinite(score) ? score : "—"}%`, 13, "#0F172A", true);
  divider();

  // Common topics
  addText("Common Topics", 12, "#0F172A", true);
  y += 2;
  if (analysis.commonTopics?.length) {
    analysis.commonTopics.forEach((t) => addText(`• ${t}`, 10.5));
  } else {
    addText("None identified", 10.5, "#94A3B8");
  }
  divider();

  // Differences
  addText("Key Differences", 12, "#0F172A", true);
  y += 2;
  if (analysis.differences?.length) {
    analysis.differences.forEach((d, i) => {
      addText(`${i + 1}. Video 1: ${d.transcript1}`, 10);
      addText(`   Video 2: ${d.transcript2}`, 10);
      y += 4;
    });
  } else {
    addText("None identified", 10.5, "#94A3B8");
  }
  divider();

  // Summary
  addText("AI Summary", 12, "#0F172A", true);
  y += 2;
  addText(analysis.summary, 10.5);

  const filename = `vidlytics-report-${comparison?._id || Date.now()}.pdf`;
  doc.save(filename);
};