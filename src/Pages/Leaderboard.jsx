import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaArrowLeft, FaArrowRight, FaCrown, FaTrophy, FaMedal } from "react-icons/fa";
import { GiGreekTemple, GiLaurelCrown, GiScrollQuill } from "react-icons/gi";
import Navbar from "../components/Navbar";
const fetchStudents = async () => {
  try {
    const response = await api.get(`/leaderboard/`);

    // Transform backend response into frontend format
    return response.data.map((item) => ({
      username: item.teamname,
      scores: [item.problem_1, item.problem_2, item.problem_3, item.problem_4],
      total: item.total_score,
      time: new Date(item.last_submission_time).toLocaleTimeString(),
    }));
  } catch {
    return [];
  }
};

function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const getStudents = async () => {
      const data = await fetchStudents();
      setStudents(data);
    };
    getStudents();
  }, []);

  // calculate total score
  const dataWithScores = students.map((s) => ({
    ...s,
    total: s.scores.reduce((a, b) => a + b, 0),
  }));

  // sort by score descending
  const sortedData = [...dataWithScores].sort((a, b) => b.total - a.total);

  // pagination
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const startIndex = page * itemsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handlePrev = () => {
    setPage((p) => Math.max(p - 1, 0));
  };

  const handleNext = () => {
    setPage((p) => Math.min(p + 1, totalPages - 1));
  };

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" />;
    if (rank === 2) return <FaMedal className="text-[#C0C0C0] drop-shadow-[0_0_8px_rgba(192,192,192,0.8)]" />;
    if (rank === 3) return <FaMedal className="text-[#CD7F32] drop-shadow-[0_0_8px_rgba(205,127,50,0.8)]" />;
    return null;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#2a1f33] via-[#4b3140] to-[#9b6b5e] box-border overflow-x-hidden relative">
      {/* Decorative background elements
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-[#FFE7A3]/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-[#E6B65C]/10 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-[#FFE7A3]/5 to-transparent rounded-full blur-3xl" />
      </div> */}

      {/* Navbar */}
      <nav className="relative z-10">
        <Navbar />
      </nav>

      {/* Title Section */}
      <div className="relative z-10 mt-[2.1%] w-full text-center">
        <h1
          className="
            text-4xl md:text-5xl lg:text-[50px] 
            font-stranger
            font-extrabold 
            tracking-widest
            bg-gradient-to-b from-[#FFE7A3] via-[#E6B65C] to-[#B8832F]
            bg-clip-text text-transparent
            [-webkit-text-stroke:1px_#1B1F4A]
            drop-shadow-[4px_4px_0_#0D1026]
            inline-block
            relative
            px-8 py-4 font-stranger
          "

        >
          {/* <GiGreekTemple className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[#FFE7A3]/50" /> */}
          LEADERBOARD
          {/* <GiScrollQuill className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[#FFE7A3]/50" /> */}
        </h1>
      </div>

      {/* Leaderboard Container */}
      <div className="relative z-10 mt-10 w-[90%] lg:w-[85%] min-h-[65%] mx-auto">
        {/* Decorative corner elements */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#FFE7A3]/30 rounded-tl-lg" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#FFE7A3]/30 rounded-tr-lg" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#FFE7A3]/30 rounded-bl-lg" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#FFE7A3]/30 rounded-br-lg" />

        {/* Main Table Container */}
        <div
          className="
            border-2 rounded-3xl 
            border-[#c29673]
            bg-[#1a1625]/90 
            backdrop-blur-md 
            flex flex-col 
            shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_30px_rgba(202,150,115,0.2)]
            overflow-hidden
            relative
          "
        >



          {/* Table Body with scroll */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#c29673] scrollbar-track-transparent">
            <table className="w-full table-fixed text-center text-white tracking-wide">

              <thead className="text-base md:text-lg font-bold sticky top-0 bg-[#1a1625] z-10">
                <tr className="border-b-2 border-[#c29673]">
                  <th className="py-5 w-[10%] relative">
                    <span className="flex items-center justify-center gap-2 font-play">
                      RANK
                    </span>
                  </th>
                  <th className="w-[22%] font-play">USERNAME</th>
                  <th className="w-[7%] font-play">Q1</th>
                  <th className="w-[7%] font-play">Q2</th>
                  <th className="w-[7%] font-play">Q3</th>
                  <th className="w-[7%] font-play">Q4</th>
                  <th className="w-[13%] font-play">TIME</th>
                  <th className="w-[13%] font-play">SCORE</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((student, idx) => {
                  const rank = startIndex + idx + 1;
                  const isTop3 = rank <= 3;

                  return (
                    <tr
                      key={student.username}
                      className={`
              relative
              text-base md:text-lg 
              transition-all duration-300 
              hover:bg-gradient-to-r hover:from-[#c29673]/20 hover:to-transparent
              cursor-pointer
              group
              ${isTop3 ? 'bg-gradient-to-r from-[#FFE7A3]/5 to-transparent' : ''}
            `}
                      onMouseEnter={() => setHoveredRow(rank)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Rank */}
                      <td className="py-5 font-semibold relative">
                        <div className="flex items-center justify-center gap-2 ">
                          <span className={`
                  ${rank === 1 ? 'text-[#FFD700] font-play' :
                              rank === 2 ? 'text-[#C0C0C0]' :
                                rank === 3 ? 'text-[#CD7F32]' :
                                  'text-[#FFE7A3]'}
                  font-bold text-lg
                `}>
                            {rank}
                          </span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="font-bold">
                        <span className={`
                ${isTop3 ? 'text-[#FFE7A3]' : 'text-white'}
                tracking-wider font-play
                relative
                inline-block
                group-hover:scale-105
                transition-transform duration-300 font-play
              `}>
                          {student.username}
                        </span>
                      </td>

                      {/* Scores */}
                      {student.scores.map((s, i) => (
                        <td key={i} className="text-[#e6d4b3] font-medium">
                          <span className={`
                  ${s > 0 ? 'text-[#e6d4b3]' : 'text-gray-500'}
                  ${hoveredRow === rank ? 'scale-110 inline-block' : ''}
                  transition-all duration-300 font-play
                `}>
                            {s}
                          </span>
                        </td>
                      ))}

                      {/* Time */}
                      <td className="text-[#e6d4b3] text-sm font-play">
                        {student.time}
                      </td>

                      {/* Score */}
                      <td className="font-bold text-xl relative">
                        <span className={`
                ${isTop3 ? 'text-[#FFE7A3]' : 'text-[#e6d4b3]'}
                drop-shadow-[0_0_10px_rgba(255,231,163,0.3)]
                group-hover:drop-shadow-[0_0_20px_rgba(255,231,163,0.6)]
                transition-all duration-300 font-play
              `}>
                          {student.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            {/* Empty state */}
            {currentData.length === 0 && (
              <div className="text-center py-10 text-[#e6d4b3]">
                <GiScrollQuill className="w-12 h-12 mx-auto mb-4 opacity-50 font-play" />
                <p>No participants yet</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="relative flex justify-center items-center gap-6 p-6 border-t border-[#c29673]/30">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className={`
                relative group/btn
                w-12 h-12 
                flex items-center justify-center 
                rounded-xl
                border-2 
                transition-all duration-300
                ${page === 0
                  ? "border-[#c29673]/30 text-[#c29673]/30 cursor-not-allowed"
                  : "border-[#FFE7A3] text-[#FFE7A3] hover:bg-[#FFE7A3] hover:text-[#0E0D40] hover:shadow-[0_0_20px_rgba(255,231,163,0.5)] hover:scale-110"
                }
              `}
            >
              <FaArrowLeft className="relative z-10" />
              {page !== 0 && (
                <div className="absolute inset-0 bg-[#FFE7A3]/20 rounded-xl blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              )}
            </button>

            {/* Page indicator */}
            <div className="relative">
              <span className="text-white font-medium text-lg px-4 py-2 border border-[#c29673]/30 rounded-lg bg-[#1a1625]/50">
                {page + 1} / {totalPages}
              </span>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className={`
                relative group/btn
                w-12 h-12 
                flex items-center justify-center 
                rounded-xl
                border-2 
                transition-all duration-300
                ${page === totalPages - 1
                  ? "border-[#c29673]/30 text-[#c29673]/30 cursor-not-allowed"
                  : "border-[#FFE7A3] text-[#FFE7A3] hover:bg-[#FFE7A3] hover:text-[#0E0D40] hover:shadow-[0_0_20px_rgba(255,231,163,0.5)] hover:scale-110"
                }
              `}
            >
              <FaArrowRight className="relative z-10" />
              {page !== totalPages - 1 && (
                <div className="absolute inset-0 bg-[#FFE7A3]/20 rounded-xl blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

export default Leaderboard;