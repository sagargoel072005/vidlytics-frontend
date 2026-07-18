import { useEffect, useRef, useState } from "react";
import { Sparkles, Link2, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import ComparisonResult, { parseAIResult } from "../components/ComparisonResult";

const HOW_IT_WORKS = [
  { n: 1, text: "We extract transcripts from both videos" },
  { n: 2, text: "AI analyzes and compares the content" },
  { n: 3, text: "Get insights, similarities, differences and summary" },
];

const Dashboard = () => {
  const [video1, setVideo1] = useState("");
  const [video2, setVideo2] = useState("");

  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");

  const [comparison, setComparison] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const abortRef = useRef(null);
  const streamedLenRef = useRef(0);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const fetchComparisonResult = async (comparisonId) => {
    try {
      const res = await axios.get(`${BASE_URL}/history/${comparisonId}`, {
        withCredentials: true,
      });
      const comp = res.data.comparison;
      setComparison(comp);
      setAnalysis(parseAIResult(comp.aiResult));
    } catch (err) {
      console.log(err);
      setError("Comparison completed, but the result couldn't be loaded. Please check the History page.");

    }
  };

  const listenForProgress = (jobId) => {
    streamedLenRef.current = 0;
    const controller = new AbortController();
    abortRef.current = controller;

    axios
      .get(`${BASE_URL}/${jobId}/progress`, {
        withCredentials: true,
        responseType: "text",
        signal: controller.signal,

        onDownloadProgress: (progressEvent) => {
          const fullText =
            progressEvent.event?.target?.responseText ??
            progressEvent.currentTarget?.responseText ??
            "";

          const newChunk = fullText.slice(streamedLenRef.current);
          streamedLenRef.current = fullText.length;

          newChunk
            .split("\n\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("data:"))
            .forEach((line) => {
              try {
                const data = JSON.parse(line.replace("data:", "").trim());
                setProgress(data.progress);
                setMessage(data.message);

                if (data.progress >= 100) {
                  controller.abort();
                  setComparing(false);
                  if (data.comparisonId) {
                    fetchComparisonResult(data.comparisonId);
                  } else {
                    setError("The comparison finished successfully, but the result is not available yet. Please check the History section.");
                  }
                }
              } catch (e) {
                
              }
            });
        },
      })
      .catch((err) => {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") return;
        console.log(err);
        setComparing(false);
        setError("Connection to the progress stream was lost. Please try again.");
      });
  };

  const compareVideos = async () => {
    setError("");
    setComparison(null);
    setAnalysis(null);
    setProgress(0);
    setMessage("Starting comparison...");
    setComparing(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/comparision`,
        { video1, video2 },
        { withCredentials: true }
      );
      listenForProgress(res.data.jobId);
    } catch (err) {
      console.log(err);
      setComparing(false);
     setError("Unable to start the comparison. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
          New Comparison
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Paste two YouTube video links to compare and analyze.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:shadow-none">
          <div className="space-y-2 mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Video 1
            </label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={video1}
                onChange={(e) => setVideo1(e.target.value)}
                placeholder="Paste YouTube video link here..."
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all"
              />
              {video1 && (
                <button
                  onClick={() => setVideo1("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center my-6">
            <span className="text-xs font-['JetBrains_Mono',monospace] tracking-widest text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-4 py-1.5">
              VS
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Video 2
            </label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={video2}
                onChange={(e) => setVideo2(e.target.value)}
                placeholder="Paste YouTube video link here..."
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all"
              />
              {video2 && (
                <button
                  onClick={() => setVideo2("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <button
            onClick={compareVideos}
            disabled={!video1 || !video2 || comparing}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-linear-to-r from-teal-600 to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Sparkles size={18} />
            {comparing ? "Comparing..." : "Compare Videos"}
          </button>

          {error && <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>}

          {progress > 0 && progress < 100 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">{message}</span>
                <span className="font-['JetBrains_Mono',monospace] text-teal-600 dark:text-teal-400">
                  {progress}%
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-teal-50/60 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-3xl p-7">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5 font-['Space_Grotesk',sans-serif]">
            How it works?
          </h3>

          <ol className="relative space-y-6 before:absolute before:left-3.75 before:top-2 before:bottom-2 before:w-px before:bg-teal-200 dark:before:bg-teal-800">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="flex gap-4 relative">
                <span className="h-8 w-8 shrink-0 rounded-full bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-semibold font-['JetBrains_Mono',monospace] z-10">
                  {step.n}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-300 pt-1.5">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Result below — full width, jaise image me hai */}
      {progress === 100 && comparison && (
        <div className="mt-8">
          <ComparisonResult
            comparison={comparison}
            analysis={analysis}
            comparisonId={comparison._id}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;