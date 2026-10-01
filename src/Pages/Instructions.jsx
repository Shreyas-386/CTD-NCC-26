import Navbar from "../components/Navbar";
import Backdrop from "../components/Backdrop";
import { Link } from "react-router-dom";

const instructionsData = [
  {
    number: "01",
    text: "There will be 4 problems in total. Each problem will carry equal score.",
  },
  {
    number: "02",
    text: "Time duration: 60 minutes",
  },
  {
    number: "03",
    text: "There will be no penalty for wrong submissions.",
  },
  {
    number: "04",
    text: "Use of AI tools, external help, or any form of cheating is strictly prohibited. All codes will be checked for plagiarism - violators will be disqualified.",
  },

  {
    number: "05",
    text: "Exiting the full screen or switching tabs 3 times will log out the user automatically.",
  },
];

// Document + code card illustration (pure SVG)
const DocumentArt = () => (
  <svg viewBox="0 0 300 300" className="w-full max-w-[280px]" aria-hidden="true">
    <defs>
      <radialGradient id="in-sun" cx="0.4" cy="0.4" r="0.7">
        <stop offset="0%" stopColor="#f6cf9c" />
        <stop offset="100%" stopColor="#d99c62" />
      </radialGradient>
      <linearGradient id="in-doc" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#b7aacb" />
        <stop offset="100%" stopColor="#7d7299" />
      </linearGradient>
      <linearGradient id="in-card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3a3d55" />
        <stop offset="100%" stopColor="#1d2030" />
      </linearGradient>
    </defs>
    <circle cx="95" cy="165" r="95" fill="url(#in-sun)" />
    <g filter="drop-shadow(0 16px 20px rgba(0,0,0,0.35))">
      <rect x="70" y="40" width="130" height="170" rx="14" fill="url(#in-doc)" />
      <rect x="90" y="66" width="34" height="9" rx="4.5" fill="#2e2b40" />
      <rect x="90" y="90" width="90" height="7" rx="3.5" fill="#4a4562" />
      <rect x="90" y="110" width="90" height="7" rx="3.5" fill="#4a4562" />
      <rect x="90" y="130" width="76" height="7" rx="3.5" fill="#4a4562" />
      <rect x="90" y="150" width="60" height="7" rx="3.5" fill="#4a4562" />
      <rect x="90" y="170" width="40" height="7" rx="3.5" fill="#4a4562" />
    </g>
    <g filter="drop-shadow(0 16px 20px rgba(0,0,0,0.45))">
      <rect x="150" y="150" width="110" height="100" rx="16" fill="url(#in-card)" stroke="#555a78" />
      <path d="M187 180 L168 200 L187 220" fill="none" stroke="#e8b57d" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M223 180 L242 200 L223 220" fill="none" stroke="#e8b57d" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M212 174 L198 226" stroke="#e8b57d" strokeWidth="7" strokeLinecap="round" />
    </g>
  </svg>
);

const InstructionItem = ({ number, text }) => {
  return (
    <div className="w-full flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl ncc-glass hover:border-[#e8b57d]/40 transition-colors duration-300">
      {/* Number */}
      <div className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full ncc-gold-btn flex items-center justify-center">
        <span className="font-exo font-bold text-base sm:text-xl text-[#1a1410]">{number}</span>
      </div>

      {/* Text */}
      <p className="flex-1 font-poppins text-sm sm:text-base leading-relaxed text-[#e4e7ee]">
        {text}
      </p>
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden font-poppins">
      <Backdrop tone="dusk" />
      <Navbar />

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <h1 className="font-exo font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-wide text-[#f3f4f8] text-center">
          INSTRUCTIONS
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#d4d8e2] text-center">
          Read the rules carefully before you begin. Good luck!
        </p>

        <div className="w-full max-w-5xl mt-8 sm:mt-10 flex flex-row items-center gap-10">
          {/* Illustration */}
          <div className="hidden lg:flex w-[30%] justify-center items-center">
            <DocumentArt />
          </div>

          {/* Instructions list */}
          <div className="flex-1 w-full space-y-3 sm:space-y-4">
            {instructionsData.map((item, index) => (
              <InstructionItem
                key={item.number}
                number={item.number}
                text={item.text}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* PROCEED Button */}
        <Link to="/questionhub" className="mt-8 sm:mt-10">
          <button className="ncc-gold-btn px-7 sm:px-10 py-3 sm:py-4 rounded-xl font-poppins font-semibold text-base sm:text-lg">
            I Understand and Proceed
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Instructions;
