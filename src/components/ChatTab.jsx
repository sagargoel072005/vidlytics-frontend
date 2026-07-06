import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const ChatTab = ({ videoId, showHeader = true }) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHistory = async () => {
    const res = await axios.get(`${BASE_URL}/chat/history/${videoId}`, {
      withCredentials: true,
    });

    setHistory(res.data.history);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/chat/ask/question`,
        { videoId, question },
        { withCredentials: true }
      );

      setQuestion("");
      await getHistory();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="font-['Inter',sans-serif]">
      {showHeader && (
        <div className="flex items-center gap-2 mb-5">
          <div className="h-8 w-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 flex items-center justify-center">
            <Sparkles size={14} className="text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
            Ask AI about this comparison
          </h3>
        </div>
      )}

      <div className="space-y-3 mb-5 max-h-96 overflow-y-auto pr-1">
        {history.length === 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            No questions yet — ask anything about these videos.
          </p>
        )}

        {history.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 ml-auto"
                : "bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 text-slate-700 dark:text-slate-200"
            }`}
          >
            <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-wide text-slate-400 dark:text-slate-500 mb-1">
              {msg.role === "user" ? "YOU" : "AI"}
            </p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askQuestion()}
          placeholder="Ask anything about these videos..."
          className="w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-900/30 transition-all"
        />
        <button
          onClick={askQuestion}
          disabled={loading || !question.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
};

export default ChatTab;