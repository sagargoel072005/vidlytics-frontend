import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const QuizTab = ({ questions = [] }) => {
  // answers[i] = selected option index, or undefined if unanswered
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
        <p className="text-sm text-slate-400">No quiz questions available for this video.</p>
      </div>
    );
  }

  const selectAnswer = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  const score = submitted
    ? questions.reduce(
        (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
        0
      )
    : null;

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {submitted && (
        <div className="bg-teal-50/60 dark:bg-teal-900/10 border border-teal-200 dark:border-teal-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your score</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-['Space_Grotesk',sans-serif]">
              {score} / {questions.length}
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 bg-white dark:bg-slate-800 border border-teal-200 dark:border-teal-700 px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw size={14} />
            Retake
          </button>
        </div>
      )}

      {questions.map((q, qIndex) => {
        const selected = answers[qIndex];
        const isCorrect = selected === q.correctIndex;

        return (
          <div
            key={qIndex}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {qIndex + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options?.map((option, optIndex) => {
                const isSelected = selected === optIndex;
                const showCorrect = submitted && optIndex === q.correctIndex;
                const showWrong = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={optIndex}
                    onClick={() => selectAnswer(qIndex, optIndex)}
                    disabled={submitted}
                    className={`w-full flex items-center justify-between text-left text-sm px-4 py-3 rounded-xl border transition-colors ${
                      showCorrect
                        ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400"
                        : showWrong
                        ? "border-rose-400 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                        : isSelected
                        ? "border-teal-400 bg-teal-50/60 dark:bg-teal-900/10 text-slate-700 dark:text-slate-200"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-teal-300"
                    } disabled:cursor-default`}
                  >
                    <span>{option}</span>
                    {showCorrect && <CheckCircle2 size={16} />}
                    {showWrong && <XCircle size={16} />}
                  </button>
                );
              })}
            </div>

            {submitted && q.explanation && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                {q.explanation}
              </p>
            )}
          </div>
        );
      })}

      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="w-full bg-linear-to-r from-teal-600 to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transition-all"
        >
          {allAnswered ? "Submit Quiz" : `Answer all ${questions.length} questions`}
        </button>
      )}
    </div>
  );
};

export default QuizTab;