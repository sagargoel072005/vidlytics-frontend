import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { BASE_URL } from "../utils/constant";
import { setUser } from "../utils/authSlice";

// Waveform bars — static Tailwind classes (height + color) per bar, no inline style
const WAVEFORM = [
  { h: "h-9", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-16", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-7", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-20", c: "bg-gradient-to-t from-rose-500 to-rose-400" },
  { h: "h-12", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-24", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-8", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-18", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-11", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-15", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-22", c: "bg-gradient-to-t from-rose-500 to-rose-400" },
  { h: "h-6", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-14", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-19", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-10", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-24", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-8", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-16", c: "bg-gradient-to-t from-rose-500 to-rose-400" },
  { h: "h-12", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
  { h: "h-20", c: "bg-gradient-to-t from-teal-600 to-teal-400" },
];

// Cycle of static Tailwind arbitrary-property classes for staggered delay
const DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:60ms]",
  "[animation-delay:120ms]",
  "[animation-delay:180ms]",
  "[animation-delay:240ms]",
];

const TIMECODES = ["00:00", "01:15", "02:30", "03:45", "05:00"];

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(setUser(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Something went wrong"
      );
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-125 h-125 rounded-full blur-[140px] bg-teal-200/40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-125 h-125 rounded-full blur-[140px] bg-rose-200/30 pointer-events-none" />

      <div className="w-full max-w-300 min-h-170 bg-white rounded-4xl overflow-hidden border border-slate-200 shadow-[0_30px_80px_rgba(15,23,42,0.08)] grid lg:grid-cols-2 relative z-10">
        {/* LEFT — FORM */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center font-['Inter',sans-serif]">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-12 w-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center relative">
              <div className="h-2 w-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-pulse" />
              <svg width="20" height="20" fill="#0D9488" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-slate-900 text-xl font-semibold tracking-tight font-['Space_Grotesk',sans-serif]">
              Vidlytics
            </span>
            <span className="text-[10px] tracking-[0.2em] text-teal-600 font-['JetBrains_Mono',monospace] border border-teal-200 bg-teal-50 rounded px-2 py-1 ml-1">
              REC
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-3 font-['Space_Grotesk',sans-serif] leading-[1.1]">
            Resume where
            <br />
            you left off.
          </h1>
          <p className="text-slate-500 mb-10">
            Sign in to pick your analysis back up — every
            transcript and insight, right where you paused.
          </p>

          <div className="space-y-5">
            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@studio.com"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 text-xs font-['JetBrains_Mono',monospace] transition-colors"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm pt-1">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input type="checkbox" className="accent-teal-600 h-4 w-4 rounded" />
                Remember me
              </label>

              <button className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-linear-to-r from-teal-600 to-teal-500 text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Log in
            </button>

            {error && (
              <div
                className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">OR</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={() => (window.location.href = `${BASE_URL}/auth/google`)}
              className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.52 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.86c2.26-2.08 3.59-5.15 3.59-8.8z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.92l-3.86-2.98c-1.07.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.24v3.07C3.2 21.3 7.26 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.37-2.29V6.64H1.24A11.9 11.9 0 0 0 0 12c0 1.93.46 3.75 1.24 5.36l4.03-3.07z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.26 0 3.2 2.7 1.24 6.64l4.03 3.07C6.22 6.86 8.87 4.75 12 4.75z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-slate-500 pt-2">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT — TIMELINE / SIGNATURE VISUAL */}
        <div className="hidden lg:flex flex-col justify-center px-14 py-16 relative bg-linear-to-br from-teal-50 via-white to-rose-50/40 border-l border-slate-200 overflow-hidden">
          {/* Grid backdrop */}
          <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(rgba(13,148,136,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.08)_1px,transparent_1px)] bg-size-[48px_48px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-105 h-105 rounded-full blur-[100px] bg-teal-200/30 pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 font-['Space_Grotesk',sans-serif] leading-tight">
              AI-Powered
              <br />
              Video Insights
            </h2>
            <p className="text-slate-500 max-w-sm mb-14">
              Drop in a video, get the transcript, comparisons and
              key moments back in seconds.
            </p>

            {/* Waveform */}
            <div className="flex items-end gap-0.75 h-24 mb-3">
              {WAVEFORM.map((bar, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full waveform-bar ${bar.h} ${bar.c} ${DELAYS[i % DELAYS.length]}`}
                />
              ))}
            </div>

            {/* Timeline / scrubber */}
            <div className="relative h-0.75 bg-slate-200 rounded-full mb-2">
              <div className="absolute inset-y-0 left-0 w-[42%] bg-teal-600 rounded-full" />
              <div className="absolute -top-1.25 left-[42%] w-3 h-3 rounded-full bg-teal-600 shadow-[0_0_12px_rgba(13,148,136,0.5)] playhead" />
            </div>
            <div className="flex justify-between text-[11px] font-['JetBrains_Mono',monospace] text-slate-400 mb-14">
              {TIMECODES.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>

            {/* Insight chips */}
            <div className="flex flex-wrap gap-3">
              {["Smart comparison", "Detailed summaries", "Key topics tagged"].map(
                (label) => (
                  <span
                    key={label}
                    className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Only fonts + custom keyframes live here — Tailwind alone can't define
          new @keyframes without a config file, everything else above is classes only */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes waveformPulse {
          0%, 100% { transform: scaleY(1); opacity: 0.85; }
          50% { transform: scaleY(1.12); opacity: 1; }
        }
        .waveform-bar {
          transform-origin: bottom;
          animation: waveformPulse 2.4s ease-in-out infinite;
        }

        @keyframes playheadDrift {
          0%, 100% { left: 42%; }
          50% { left: 58%; }
        }
        .playhead {
          animation: playheadDrift 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .waveform-bar, .playhead {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
