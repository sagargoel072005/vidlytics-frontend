import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Link2, X, AlertCircle, BookOpen } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const HOW_IT_WORKS = [
  { n: 1, text: "We extract the transcript from the video" },
  { n: 2, text: "AI turns it into notes, a quiz, and a flowchart" },
  { n: 3, text: "Study, quiz yourself, and ask follow-up questions" },
];

const NewStudy = () => {
  const navigate = useNavigate();

  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const eventSourceRef = useRef(null);

  const startStudySession = async () => {
    setError("");
    setProgress(0);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/study`,
        { videoUrl },
        { withCredentials: true }
      );

      const { jobId, studyId } = res.data;

      const eventSource = new EventSource(`${BASE_URL}/${jobId}/progress`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setProgress(data.progress);
        setMessage(data.message);

        if (data.progress === 100) {
          eventSource.close();
          setLoading(false);

          const finalId = data.studyId || studyId;
          if (finalId) {
            navigate(`/study/${finalId}`);
          } else {
            setError("Session finished but we couldn't find its id. Check History.");
          }
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setLoading(false);
        setError("Lost connection while tracking progress. Please retry.");
      };
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(
        err?.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
          Study Mode
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Paste a YouTube video link and turn it into notes, a quiz, and a flowchart.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Video link
            </label>
            <div className="relative">
              <Link2
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste YouTube video link here..."
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all disabled:opacity-60"
              />
              {videoUrl && !loading && (
                <button
                  onClick={() => setVideoUrl("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-3">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={startStudySession}
            disabled={!videoUrl || loading}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-linear-to-r from-teal-600 to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Sparkles size={18} />
            {loading ? "Building your study kit..." : "Generate Study Kit"}
          </button>

          {loading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {message || "Starting..."}
                </span>
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

        <div className="bg-teal-50/60 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-3xl p-7">
          <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 flex items-center justify-center mb-4">
            <BookOpen size={16} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5 font-['Space_Grotesk',sans-serif]">
            How it works?
          </h3>

          <ol className="relative space-y-6 before:absolute before:left-3.75 before:top-2 before:bottom-2 before:w-px before:bg-teal-200 dark:before:bg-teal-800">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="flex gap-4 relative">
                <span className="h-8 w-8 shrink-0 rounded-full bg-white dark:bg-slate-800 border border-teal-300 dark:border-teal-700 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm font-semibold font-['JetBrains_Mono',monospace] z-10">
                  {step.n}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 pt-1.5">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default NewStudy;