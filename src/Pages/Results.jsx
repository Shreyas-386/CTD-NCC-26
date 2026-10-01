import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiStar, FiCheckCircle, FiTarget, FiEye, FiArrowRight } from "react-icons/fi";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Backdrop from "../components/Backdrop";
import { Slashes } from "../components/NccLogo";
import { toast } from "react-toastify";

// Static confetti pieces scattered across the top of the page
const CONFETTI = [
  [4, 14, "#e8b57d", 18], [9, 26, "#c86a8a", -22], [13, 8, "#8f86d6", 30], [17, 33, "#e8b57d", 10],
  [22, 18, "#d98aa6", -35], [26, 6, "#6c7aa8", 45], [30, 28, "#f2c693", -12], [35, 12, "#a2508a", 25],
  [41, 22, "#8f86d6", -40], [47, 7, "#e8b57d", 15], [53, 30, "#c86a8a", -20], [58, 15, "#f2c693", 38],
  [63, 5, "#6c7aa8", -28], [67, 25, "#e8b57d", 22], [72, 11, "#d98aa6", -15], [76, 32, "#8f86d6", 34],
  [81, 19, "#c86a8a", -45], [85, 7, "#e8b57d", 12], [89, 27, "#6c7aa8", -30], [93, 14, "#f2c693", 40],
  [97, 24, "#a2508a", -10], [7, 40, "#6c7aa8", 28], [20, 42, "#e8b57d", -18], [83, 41, "#d98aa6", 20],
  [95, 38, "#8f86d6", -36], [44, 36, "#f2c693", 8], [56, 40, "#8f86d6", -25],
];

const Confetti = () => (
  <div className="pointer-events-none absolute inset-x-0 top-0 h-[55%] overflow-hidden" aria-hidden="true">
    {CONFETTI.map(([left, top, color, rot], i) => (
      <span
        key={i}
        className={`absolute ${i % 3 === 0 ? "w-2.5 h-2.5 rounded-[2px]" : "w-2 h-4 rounded-[1px]"}`}
        style={{ left: `${left}%`, top: `${top}%`, background: color, transform: `rotate(${rot}deg)`, opacity: 0.85 }}
      />
    ))}
  </div>
);

const AvatarArt = () => (
  <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-b from-[#f4cc9a] to-[#c98d55]">
    <div className="w-full h-full rounded-full bg-[#1b2030] flex items-end justify-center overflow-hidden">
      <svg viewBox="0 0 60 60" className="w-14 h-14" aria-hidden="true">
        <defs>
          <linearGradient id="rs-av" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6d3a6" />
            <stop offset="100%" stopColor="#d39557" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="20" r="11" fill="url(#rs-av)" />
        <path d="M8 60 C8 44 18 36 30 36 C42 36 52 44 52 60 Z" fill="url(#rs-av)" />
      </svg>
    </div>
  </div>
);

const StatTile = ({ icon, value, label }) => (
  <div className="flex items-start gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl ncc-glass">
    <span className="text-[#e8b57d] text-2xl mt-0.5">{icon}</span>
    <div>
      <div className="font-exo font-bold text-lg sm:text-xl text-[#f3f4f8]">{value}</div>
      <div className="text-xs text-[#a3abbd] mt-0.5">{label}</div>
    </div>
  </div>
);

const AccuracyDonut = ({ percent }) => {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(Math.max(percent, 0), 100) / 100) * c;

  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52">
      <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="rs-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f4cc9a" />
            <stop offset="100%" stopColor="#e2a96f" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={r} fill="none" stroke="#283048" strokeWidth="16" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke="url(#rs-ring)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-exo font-bold text-3xl sm:text-4xl text-[#f3f4f8]">{Math.round(percent)}%</span>
        <span className="text-sm text-[#a3abbd] mt-1">Accuracy</span>
      </div>
    </div>
  );
};

function Results() {
  const [result, setResult] = useState({
    event_id: 2,
    team_id: 0,
    username1: "",
    username2: null,
    isjunior: false,
    level: "",
    rank: 0,
    total_score: 0,
    totalSubmissions: 0,
    accuracy: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/result/`);
        setResult(res.data);
      } catch (err) {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    };

    fetchData();
  }, []);

  // Format accuracy to show percentage
  const formattedAccuracy = result.accuracy ? `${result.accuracy}` : "-";
  // numeric value for the donut chart
  const accuracyPercent = parseFloat(String(result.accuracy ?? 0)) || 0;

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-poppins">
      <Backdrop tone="dusk" />
      <Confetti />

      {/* Navbar */}
      <nav className="relative z-20 shrink-0">
        <Navbar />
      </nav>

      {/* RESULT Heading */}
      <div className="relative z-10 mt-8 sm:mt-10 w-full flex items-center justify-center gap-4">
        <Slashes className="w-7 h-7 sm:w-9 sm:h-9" />
        <h1 className="font-exo font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide text-[#f3f4f8]">
          RESULT
        </h1>
        <Slashes className="w-7 h-7 sm:w-9 sm:h-9" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-[92%] max-w-4xl mx-auto my-8 sm:my-10 rounded-2xl ncc-glass p-5 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8">
        {/* Left part - User Info + Stats */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-5">
            <AvatarArt />
            <div>
              <div className="font-exo font-bold text-xl sm:text-2xl text-[#f3f4f8]">
                {`${result.teamname}`}
              </div>
              <span className="inline-block mt-2 px-4 py-1 rounded-lg text-xs font-medium bg-[#3a3352] text-[#d8d0ec]">
                {result.isjunior ? "Junior" : "Senior"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatTile icon={<FiEdit />} value={result.rank || "-"} label="Your Rank" />
            <StatTile icon={<FiStar />} value={result.total_score || "-"} label="Total Score" />
            <StatTile icon={<FiCheckCircle />} value={result.total_submissions || "-"} label="Total Submissions" />
            <StatTile icon={<FiTarget />} value={formattedAccuracy} label="Accuracy" />
          </div>

          <Link
            to="/leaderboard"
            className="self-start mt-1 inline-flex items-center gap-4 px-5 py-3 rounded-xl border border-[#e8b57d]/70 text-sm font-semibold text-[#f3f4f8] hover:bg-[#e8b57d]/10 transition"
          >
            <FiEye className="text-[#e8b57d] text-lg" />
            View Leaderboard
            <FiArrowRight className="text-[#e8b57d] text-lg" />
          </Link>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-white/10" />

        {/* Right part - Accuracy donut */}
        <div className="relative md:w-[38%] flex items-center justify-center py-4">
          <Slashes className="absolute top-0 right-2 w-7 h-7 opacity-60" />
          <AccuracyDonut percent={accuracyPercent} />
          <Slashes className="absolute bottom-2 left-2 w-7 h-7 opacity-60" />
        </div>
      </div>
    </div>
  );
}

export default Results;
