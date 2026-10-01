import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Timer from "../components/Timer";


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

  // mapping to code editor
  const handleQuestionClick = (problem_id) => {
    if (problem_id) {
      navigate("/codeeditor", { state: { problem_id } });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#2a1f33] via-[#4b3140] to-[#9b6b5e] flex flex-col">
      {/* Navbar */}
      <nav>
        <Navbar />
      </nav>

      {/* Heading */}
      <div className="mt-10 text-center relative">
        <h1
          className="
            font-black font-stranger
            text-4xl sm:text-5xl md:text-6xl lg:text-5xl 
            tracking-wider
            bg-gradient-to-b from-[#FFE7A3] via-[#E6B65C] to-[#B8832F]
            bg-clip-text text-transparent
            [-webkit-text-stroke:1px_#1B1F4A]
            drop-shadow-[3px_3px_0_#0D1026]
            inline-block
            px-8 py-4
          "

        >
          QUESTION HUB
        </h1>

      </div>

      {/* Timer Section */}
      <div className=" flex justify-end w-[90%] lg:w-[85vw] mx-auto p-4">
        <Timer />
      </div>

      {/* Grid */}
      <div className="w-full max-w-6xl mx-auto mt-5  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-12 mb-12">
        {Array.from({ length: 4 }).map((_, index) => {
          const accString = accuracy[index]?.accuracy || "0%";
          const acc = Math.round(parseFloat(accString.replace("%", "")));
          const fillPercent = acc / 100;
          const isHovered = hoveredCard === index;

          return (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleQuestionClick(accuracy[index]?.problem_id)}
            >
              {/* Main Card */}
              <div
                className="
                  relative 
                  p-[0.3rem] 
                  bg-gradient-to-br from-[#FFE7A3] via-[#E6B65C] to-[#B8832F]
                  rounded-xl 
                  transition-all duration-500 ease-out 
                  group-hover:scale-[1.06] group-hover:-rotate-1 
                  cursor-pointer
                "
              >
                {/* Inner Card */}
                <div
                  className="
                    relative w-full aspect-square 
                    flex justify-center items-center 
                    text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold 
                    bg-[#1a1625] 
                    border-2 border-[#c29673] 
                    rounded-xl 
                    overflow-hidden
                    transition-all duration-500
                    group-hover:border-[#FFE7A3]
                  "
                >
                  {/* Water Fill Animation */}
                  <div
                    className="absolute bottom-0 left-0 w-full transition-all duration-1000 ease-out"
                    style={{
                      height: `${fillPercent * 100}%`,
                      background: "linear-gradient(180deg, #E6B65C 0%, #B8832F 50%, #8B5A2B 100%)",

                    }}
                  />

                  {/* Question Number */}
                  <span
                    className="
    z-10 
    font-black 
    text-[#E6B65C]
    text-4xl sm:text-5xl md:text-6xl lg:text-7xl
    drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]
    transform group-hover:scale-110
    transition-transform duration-300 font-play
  "
                  >
                    {`Q${index + 1}`}
                  </span>
                </div>

                {/* Accuracy Text - Simple and Dark */}
                <div className="mt-4 text-center">
                  <span
                    className="
    text-sm sm:text-base md:text-lg 
    font-medium font-play
    text-[#4a4135]
  "
                  >
                    Accuracy: {acc}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>


    </div>
  );
};

export default QuestionHub;