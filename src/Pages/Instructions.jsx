import Navbar from "../components/Navbar";
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

const InstructionItem = ({ number, text }) => {
  return (
    <div
      className="
        relative
        group
        w-full
        flex items-start gap-4 sm:gap-6
        p-5 sm:p-6
        bg-[#1a1625]/90
        backdrop-blur-sm
        rounded-2xl sm:rounded-3xl
        border border-[#c29673]/30
        hover:border-[#FFE7A3]
        hover:bg-[#1a1625]
        hover:shadow-[0_0_30px_rgba(202,150,115,0.2)]
        transition-all duration-500
        overflow-hidden
      "
    >
      {/* Background gradient */}
      <div className="
        absolute inset-0
        bg-gradient-to-r from-[#FFE7A3]/0 via-[#FFE7A3]/5 to-[#FFE7A3]/0
        opacity-0 group-hover:opacity-100
        transition-opacity duration-700
      " />

      {/* Number */}
      <div className="
        relative
        flex-shrink-0
        w-12 h-12 sm:w-14 sm:h-14
        flex items-center justify-center
        bg-gradient-to-br from-[#E6B65C] to-[#B8832F]
        rounded-xl
        rotate-45
        group-hover:rotate-90
        transition-all duration-500
        shadow-lg
      ">
        <span
          className="
            text-[#0E0D40] font-play
            font-black 
            text-lg sm:text-xl
            -rotate-45
            group-hover:-rotate-90
            transition-all duration-500
          "

        >
          {number}
        </span>
      </div>

      {/* Text */}
      <p
        className="
          flex-1 font-play
          text-[#f3e3bf] 
          text-sm sm:text-base lg:text-lg
          leading-relaxed
          group-hover:text-[#FFE7A3]
          transition-colors duration-300
          pt-1
        "

      >
        {text}
      </p>

      {/* Decorative dot */}
      <div className="
        w-2 h-2 
        bg-[#FFE7A3]
        rounded-full
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
        mt-3
      " />
    </div>
  );
};

const Instructions = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#3A2A3F] via-[#6B4A55] to-[#9E6A6A] tracking-wide">
      <Navbar />
      <div className="flex flex-col items-center justify-center space-y-10 px-4 sm:px-6 lg:px-8 py-5">
        {/* Enhanced Title with your theme */}
        <h1
          className="
      text-4xl sm:text-5xl lg:text-5xl font-stranger
      font-extrabold 
      py-4 
      text-transparent 
      bg-clip-text 
      bg-gradient-to-b from-[#FFE7A3] via-[#E6B65C] to-[#B8832F]
      drop-shadow-[3px_3px_0_#0D1026]
      [-webkit-text-stroke:1px_#1B1F4A]
      relative
      group 
    "

        >
          INSTRUCTIONS

          {/* Title underline effect */}
          <div className="
      absolute -bottom-2 left-1/2 -translate-x-1/2
      w-24 h-1 
      bg-gradient-to-r from-transparent via-[#FFE7A3] to-transparent
      opacity-0 group-hover:opacity-100
      transition-opacity duration-500
    " />
        </h1>

        {/* Instructions Container with enhanced styling */}
        <div className="w-full max-w-4xl space-y-4 relative">
          {/* Decorative corner elements */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#FFE7A3]/30 rounded-tl-lg" />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#FFE7A3]/30 rounded-tr-lg" />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#FFE7A3]/30 rounded-bl-lg" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#FFE7A3]/30 rounded-br-lg" />

          {/* Map loop with enhanced InstructionItem */}
          {instructionsData.map((item, index) => (
            <InstructionItem
              key={item.number}
              number={item.number}
              text={item.text}
              index={index}
            />
          ))}
        </div>

        {/* Enhanced PROCEED Button */}
        <Link to="/questionhub" className="relative group/proceed">
          {/* Glow effect behind button */}
          <div className="
      absolute -inset-2
      bg-gradient-to-r from-[#FFE7A3]/30 via-[#E6B65C]/30 to-[#B8832F]/30
      rounded-[60px]
      opacity-0 group-hover/proceed:opacity-100
      blur-xl
      transition-opacity duration-500 
    " />

          <button
            className="
        relative
        overflow-hidden
        text-[#0E0D40] 
        font-extrabold 
        bg-gradient-to-b from-[#E6B65C] via-[#D19A66] to-[#B8832F]
        border-[3px] border-[#FFE7A3]

        py-4 px-10 sm:px-15 
        rounded-[50px] 
        shadow-[0_8px_0_#0D1026,inset_0_2px_8px_rgba(255,231,163,0.6)]
        hover:shadow-[0_4px_0_#0D1026,0_0_30px_rgba(230,182,92,0.5),inset_0_2px_12px_rgba(255,231,163,0.8)]
        hover:-translate-y-1
        active:translate-y-1
        active:shadow-[0_2px_0_#0D1026,inset_0_2px_8px_rgba(255,231,163,0.4)]
        transform
        transition-all duration-300
        text-base sm:text-lg lg:text-xl
        tracking-wider
        flex items-center justify-center gap-3
        min-w-[200px] sm:min-w-[250px] font-play
      "
          >
            {/* Shine effect */}
            <div className="
        absolute inset-0
        bg-gradient-to-r from-transparent via-white/30 to-transparent
        translate-x-[-100%] group-hover/proceed:translate-x-[100%]
        transition-transform duration-1000
      " />

            {/* Inner glow */}
            <div className="
        absolute inset-0
        bg-gradient-to-t from-white/10 to-transparent
        opacity-0 group-hover/proceed:opacity-100
        transition-opacity duration-500
      " />

            {/* Icon */}


            <span className="relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              PROCEED
            </span>

            {/* Corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FFE7A3] rounded-tl-lg opacity-0 group-hover/proceed:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FFE7A3] rounded-tr-lg opacity-0 group-hover/proceed:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FFE7A3] rounded-bl-lg opacity-0 group-hover/proceed:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FFE7A3] rounded-br-lg opacity-0 group-hover/proceed:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Instructions;
