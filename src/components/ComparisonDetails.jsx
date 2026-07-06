import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, FileText } from "lucide-react";
import { BASE_URL } from "../utils/constant";
import ComparisonResult, { parseAIResult } from "../components/ComparisonResult";

const ComparisonDetails = () => {
  const { id } = useParams();

  const [comparison, setComparison] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(false);
  const [showTranscripts, setShowTranscripts] = useState(false);

  useEffect(() => {
    fetchComparison();
  }, [id]);

  const fetchComparison = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/history/${id}`, {
        withCredentials: true,
      });
      const comp = res.data.comparison;
      setComparison(comp);
      setAnalysis(parseAIResult(comp.aiResult));
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  if (error) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <p className="text-slate-900 dark:text-slate-100 font-medium mb-1">
          Comparison not found
        </p>
        <Link to="/history" className="text-teal-600 dark:text-teal-400 text-sm font-medium">
          Back to History
        </Link>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 rounded-full border-2 border-teal-200 border-t-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-['Inter',sans-serif]">
      <Link
        to="/history"
        className="inline-flex items-center gap-2 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium mb-4"
      >
        <ArrowLeft size={15} />
        Back to History
      </Link>

      <ComparisonResult
        comparison={comparison}
        analysis={analysis}
        comparisonId={comparison._id}
      />

      <div className="mt-6">
        <button
          onClick={() => setShowTranscripts((s) => !s)}
          className="inline-flex items-center gap-1.5 text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 font-medium mb-4"
        >
          <FileText size={14} />
          {showTranscripts ? "Hide Transcripts" : "Show Transcripts"}
        </button>

        {showTranscripts && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 font-['Space_Grotesk',sans-serif]">
                Transcript 1
              </h3>
              <textarea
                rows="14"
                readOnly
                value={comparison.transcript1}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-300 focus:outline-none resize-none"
              />
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 font-['Space_Grotesk',sans-serif]">
                Transcript 2
              </h3>
              <textarea
                rows="14"
                readOnly
                value={comparison.transcript2}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-300 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonDetails;