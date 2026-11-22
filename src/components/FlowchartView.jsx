// import { useEffect, useRef, useState } from "react";
// import mermaid from "mermaid";
// import { AlertCircle } from "lucide-react";

// let mermaidInitialized = false;

// const initMermaid = (isDark) => {
//   mermaid.initialize({
//     startOnLoad: false,
//     theme: isDark ? "dark" : "default",
//     fontFamily: "'Inter', sans-serif",
//     securityLevel: "strict", 
//   });
//   mermaidInitialized = true;
// };

// const FlowchartView = ({ chart }) => {
//   const containerRef = useRef(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     let cancelled = false;

//     const render = async () => {
//       setError("");

//       const isDark = document.documentElement.classList.contains("dark");
//       if (!mermaidInitialized) initMermaid(isDark);

//       try {
//         // unique id per render avoids collisions if the tab is toggled quickly
//         const id = `mermaid-${Date.now()}`;
//         const { svg } = await mermaid.render(id, chart);
//         if (!cancelled && containerRef.current) {
//           containerRef.current.innerHTML = svg;
//         }
//       } catch (err) {
//         console.error("Mermaid render failed:", err);
//         if (!cancelled) setError("Couldn't render this flowchart.");
//       }
//     };

//     if (chart) render();

//     return () => {
//       cancelled = true;
//     };
//   }, [chart]);

//   if (error) {
//     return (
//       <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
//         <AlertCircle size={15} />
//         {error}
//       </div>
//     );
//   }




import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { AlertCircle } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "strict",
  fontFamily: "'Inter', sans-serif",
  flowchart: {
    useMaxWidth: true,
    htmlLabels: false,
  },
});


const cleanMermaid = (text = "") => {
  let diagram = String(text)
    .replace(/```mermaid/gi, "")
    .replace(/```/g, "")
    .trim();

  // Convert multiline node labels into valid quoted labels
  diagram = diagram.replace(
    /([A-Za-z0-9_]+)([\[{])([\s\S]*?)([\]}])/g,
    (match, id, open, label, close) => {
      const cleanLabel = label
        .replace(/\s*\n\s*/g, " ")
        .replace(/"/g, "'")
        .trim();

      return `${id}${open}"${cleanLabel}"${close}`;
    }
  );

  return diagram;
};

const FlowchartView = ({ chart }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      setError("");

      if (!chart || !containerRef.current) return;

      const diagram = cleanMermaid(chart);

      try {
        // Validate Mermaid syntax before rendering
        await mermaid.parse(diagram);

        const id = `mermaid-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`;

        const { svg } = await mermaid.render(id, diagram);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid render failed:", err);
        console.error("Generated Mermaid code:", diagram);

        if (!cancelled) {
          setError("Couldn't render this flowchart. The generated diagram contains invalid Mermaid syntax.");
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
        <AlertCircle size={15} className="mt-0.5 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto flex justify-center"
    />
  );
};

export default FlowchartView;


//   return <div ref={containerRef} className="overflow-x-auto flex justify-center" />;
// };

// export default FlowchartView;
