import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";
import Backdrop from "../components/Backdrop";

// Gold trophy illustration (pure SVG)
const TrophyArt = () => (
  <svg viewBox="0 0 64 64" className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 drop-shadow-[0_6px_14px_rgba(232,181,125,0.35)]" aria-hidden="true">
    <defs>
      <linearGradient id="qh-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f6d3a6" />
        <stop offset="100%" stopColor="#d39557" />
      </linearGradient>
    </defs>
    <path d="M14 10 H50 V24 C50 34 42 41 32 41 C22 41 14 34 14 24 Z" fill="url(#qh-gold)" />
    <path d="M14 14 H6 V20 C6 27 11 31 17 31" fill="none" stroke="url(#qh-gold)" strokeWidth="4" />
    <path d="M50 14 H58 V20 C58 27 53 31 47 31" fill="none" stroke="url(#qh-gold)" strokeWidth="4" />
    <rect x="28" y="40" width="8" height="10" fill="url(#qh-gold)" />
    <rect x="19" y="50" width="26" height="6" rx="2" fill="url(#qh-gold)" />
    <path d="M32 16 L34.6 21.6 L40.6 22.2 L36 26.2 L37.4 32 L32 29 L26.6 32 L28 26.2 L23.4 22.2 L29.4 21.6 Z" fill="#2a2238" />
  </svg>
);

const RING_COLORS = { attempted: "#e8b57d", solved: "#5fd38d" };

// Status ring around the question label:
// "none" -> grey track only, "attempted" -> full gold ring, "solved" -> full green ring
const StatusRing = ({ status, label, delay = 0 }) => {
  const r = 40;
  const c = 2 * Math.PI * r;
  const visible = status !== "none";

  return (
    <div className="relative w-20 h-20 sm:w-28 sm:h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
        {/* base track: always visible, like an untouched question */}
        <circle cx="50" cy="50" r={r} fill="none" stroke="#2c3245" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={RING_COLORS[status] || RING_COLORS.attempted}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={visible ? 0 : c}
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: `${delay}ms`,
            filter: status === "solved" ? "drop-shadow(0 0 6px rgba(95,211,141,0.45))" : "none",
          }}
          className="transition-[stroke-dashoffset,stroke,opacity,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-exo font-bold text-lg sm:text-2xl text-[#f3f4f8]">
        {label}
      </span>
    </div>
  );
};

const QuestionHub = () => {
  const [accuracy, setAccuracy] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // fetch questions from backend
  useEffect(() => {
    const getQuestions = async () => {
      try {
        const response = await api.get(`/problems/accuracy`);
        setAccuracy(response.data);
      } catch (error) {
        void (0);
      }
    };
    getQuestions();
  }, []);

  // fetch this user's submissions to know which questions were attempted / solved
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const getHistory = async () => {
      try {
        const res = await api.get(`/user/gethistory`);
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch {
        void (0);
      }
    };
    getHistory();
  }, []);

  const getStatus = (problem_id) => {
    if (problem_id == null) return "none";
    const subs = history.filter((s) => String(s.problem_id) === String(problem_id));
    const solved =
      !!localStorage.getItem(`solved_${problem_id}`) ||
      subs.some((s) => String(s.result || "").toLowerCase().includes("accepted"));
    if (solved) return "solved";
    return subs.length > 0 ? "attempted" : "none";
  };

  // mapping to code editor
  const handleQuestionClick = (problem_id) => {
    if (problem_id) {
      navigate("/codeeditor", { state: { problem_id } });
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-x-hidden font-poppins">
      <Backdrop tone="dusk" />

      {/* Navbar */}
      <nav className="relative z-20 shrink-0">
        <Navbar />
      </nav>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center py-8 sm:py-10">
        {/* Heading (centered) + Timer */}
        <div className="relative shrink-0 w-full flex flex-col md:flex-row items-center justify-center gap-3">
          <div className="ncc-rise flex items-center gap-3 sm:gap-5">
            <div className="ncc-pop ncc-wiggle-hover cursor-default" style={{ "--d": "150ms" }}>
              <TrophyArt />
            </div>
            <div>
              <h1 className="font-exo font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-wide text-[#f3f4f8]">
                QUESTION HUB
              </h1>
              <p className="mt-1 text-sm sm:text-lg text-[#c9cde0]">
                Choose a question <span className="text-[#b9a8e6]">to start coding</span>
              </p>
            </div>
          </div>
          <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
            <Timer />
          </div>
        </div>

        {/* Grid: compact 2x2, sized from viewport height like the reference */}
        <div className="w-full max-w-2xl mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => {
            const accString = accuracy[index]?.accuracy || "0%";
            const acc = Math.round(parseFloat(accString.replace("%", "")));
            const isHovered = hoveredCard === index;
            const status = getStatus(accuracy[index]?.problem_id);
            const isSolved = status === "solved";

            return (
              <div
                key={index}
                className={`ncc-rise relative flex flex-col items-center gap-3 sm:gap-4 px-3 sm:px-6 py-4 sm:py-6 rounded-2xl ncc-glass cursor-pointer transition-[translate,border-color,box-shadow] duration-300
                  ${isHovered ? "-translate-y-1.5 border-[#e8b57d]/40 shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_0_1px_rgba(232,181,125,0.15)]" : ""}`}
                style={{ "--d": `${200 + index * 100}ms` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleQuestionClick(accuracy[index]?.problem_id)}
                title={`Accuracy: ${acc}%`}
              >
                <div className="relative">
                  <StatusRing status={status} label={`Q${index + 1}`} delay={index * 120} />
                  <span
                    className={`absolute -top-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#5fd38d] shadow-[0_4px_14px_rgba(95,211,141,0.4)] flex items-center justify-center transition-all duration-500 ease-out
                      ${isSolved ? "opacity-100 scale-100 delay-700" : "opacity-0 scale-50 pointer-events-none"}`}
                  >
                    <FaCheck className="text-[#0f2a1a] text-[10px] sm:text-sm" />
                  </span>
                </div>

                <button className="ncc-gold-btn w-[62%] py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm">
                  Solve
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestionHub;
