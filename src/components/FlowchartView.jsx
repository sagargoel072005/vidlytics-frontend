import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { AlertCircle } from "lucide-react";

let mermaidInitialized = false;

const initMermaid = (isDark) => {
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? "dark" : "default",
    fontFamily: "'Inter', sans-serif",
    securityLevel: "strict", 
  });
  mermaidInitialized = true;
};

const FlowchartView = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      setError("");

      const isDark = document.documentElement.classList.contains("dark");
      if (!mermaidInitialized) initMermaid(isDark);

      try {
        // unique id per render avoids collisions if the tab is toggled quickly
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid render failed:", err);
        if (!cancelled) setError("Couldn't render this flowchart.");
      }
    };

    if (chart) render();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
        <AlertCircle size={15} />
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="overflow-x-auto flex justify-center" />;
};

export default FlowchartView;