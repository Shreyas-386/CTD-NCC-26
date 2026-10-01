import { useState, useEffect } from "react";
import api from "../api/axios";
import { FaArrowLeft, FaArrowRight, FaCrown, FaTrophy, FaMedal } from "react-icons/fa";
import { GiGreekTemple, GiLaurelCrown, GiScrollQuill } from "react-icons/gi";
import Navbar from "../components/Navbar";
import Backdrop from "../components/Backdrop";
import { Slashes } from "../components/NccLogo";
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
    <div className="min-h-screen w-full flex flex-col overflow-x-hidden relative font-poppins">
      <Backdrop tone="navy" />

      {/* Navbar */}
      <nav className="relative z-20 shrink-0">
        <Navbar variant="gold" />
      </nav>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col py-8 sm:py-10">
        {/* Title Section */}
        <div className="w-full flex items-center justify-center gap-3 sm:gap-5">
          <Slashes className="w-8 h-8 sm:w-11 sm:h-11" />
          <h1 className="font-exo text-3xl sm:text-4xl lg:text-5xl leading-tight font-extrabold tracking-wide text-[#f3f1ec] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            LEADERBOARD
          </h1>
          <Slashes className="w-8 h-8 sm:w-11 sm:h-11" />
        </div>

        {/* Leaderboard Container */}
        <div className="mt-6 sm:mt-8 flex flex-col rounded-2xl p-3 sm:p-5 bg-[#0d1a36]/70 border border-[#2b3c66]/70 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
          {/* Table Body with scroll */}
          <div className="overflow-x-auto ncc-scroll rounded-xl border border-[#2b3c66]/70">
            <table className="w-full min-w-[640px] table-fixed text-center text-[#e7e9f0] tracking-wide">

              <thead className="text-[11px] sm:text-xs font-semibold sticky top-0 bg-[#0f1d3d] z-10">
                <tr className="border-b-2 border-[#e8b57d]/80">
                  <th className="py-4 sm:py-5 w-[10%]">RANK</th>
                  <th className="w-[22%] text-left pl-4">USERNAME</th>
                  <th className="w-[8%]">Q1</th>
                  <th className="w-[8%]">Q2</th>
                  <th className="w-[8%]">Q3</th>
                  <th className="w-[8%]">Q4</th>
                  <th className="w-[14%]">TIME</th>
                  <th className="w-[12%] text-[#e8b57d]">SCORE</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((student, idx) => {
                  const rank = startIndex + idx + 1;
                  const isFirst = rank === 1;

                  return (
                    <tr
                      key={student.username}
                      className={`
                        text-xs sm:text-sm
                        transition-colors duration-200
                        ${idx % 2 === 0 ? "bg-[#13244b]/70" : "bg-transparent"}
                        ${hoveredRow === rank ? "!bg-[#1a2f5e]/80" : ""}
                      `}
                      onMouseEnter={() => setHoveredRow(rank)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {/* Rank */}
                      <td className="py-4 sm:py-5 font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          {isFirst && <FaCrown className="text-[#e8b57d] text-base" />}
                          <span className={isFirst ? "text-[#e8b57d]" : "text-[#e7e9f0]"}>
                            {rank}
                          </span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="text-left pl-4 font-semibold uppercase truncate">
                        {student.username}
                      </td>

                      {/* Scores */}
                      {student.scores.map((s, i) => (
                        <td key={i} className={s > 0 ? "text-[#e7e9f0]" : "text-[#6c7896]"}>
                          {s}
                        </td>
                      ))}

                      {/* Time */}
                      <td className="text-[#e7e9f0]">
                        {student.time}
                      </td>

                      {/* Score */}
                      <td className={`font-bold ${isFirst ? "text-[#e8b57d]" : "text-[#e7e9f0]"}`}>
                        {student.total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

            {/* Empty state */}
            {currentData.length === 0 && (
              <div className="text-center py-10 text-[#9aa7c4] font-poppins">
                <GiScrollQuill className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No participants yet</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 pt-4 sm:pt-5">
            {/* Prev button */}
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className={`w-9 h-9 flex items-center justify-center rounded-md border transition-all duration-200
                ${page === 0
                  ? "border-[#2b3c66] text-[#4d5b80] cursor-not-allowed"
                  : "border-[#4a5b85] text-[#c9d0e2] hover:border-[#e8b57d] hover:text-[#e8b57d]"
                }`}
            >
              <FaArrowLeft className="text-xs" />
            </button>

            {/* Page indicator */}
            <span className="text-[#e7e9f0] font-semibold text-sm tabular-nums">
              {page + 1} / {totalPages}
            </span>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className="ncc-gold-btn w-9 h-9 flex items-center justify-center rounded-md"
            >
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
