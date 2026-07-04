import { useEffect, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const ChatTab = ({ videoId }) => {
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
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center">
          <Sparkles size={14} className="text-teal-600" />
        </div>
        <h3 className="font-semibold text-slate-900 font-['Space_Grotesk',sans-serif]">
          Ask AI about this comparison
        </h3>
      </div>

      <div className="space-y-3 mb-5 max-h-96 overflow-y-auto pr-1">
        {history.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">
            No questions yet — ask anything about these videos.
          </p>
        )}

        {history.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user"
                ? "bg-slate-50 border border-slate-200 text-slate-700 ml-auto"
                : "bg-teal-50 border border-teal-200 text-slate-700"
            }`}
          >
            <p className="text-[11px] font-['JetBrains_Mono',monospace] tracking-wide text-slate-400 mb-1">
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
          className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
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
