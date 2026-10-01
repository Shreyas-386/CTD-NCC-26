import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key.startsWith("solved_")) {
        localStorage.removeItem(key);
      }
    }
    await api.post(`/user/logout`, {});
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center px-8 py-5 relative z-10">
      {/* NCC Logo */}
      <div className="flex items-center gap-1 select-none">
        <span style={{ color: "#8090B0", fontSize: "18px", fontWeight: 300 }}>//</span>
        <span
          style={{
            color: "#E8B86D",
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "5px",
            fontFamily: "Play, sans-serif",
          }}
        >
          NCC
        </span>
        <span style={{ color: "#8090B0", fontSize: "18px", fontWeight: 300 }}>//</span>
      </div>

      {/* Nav Links */}
      <div className="flex gap-8 items-center">
        {["/instructions", "/questionhub", "/leaderboard", "/results"].map((path, idx) => {
          const labels = ["Instructions", "Question Hub", "Leaderboards", "Results"];
          return (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-all duration-300 pb-1 font-play ${
                  isActive
                    ? "text-[#E8B86D] border-b-2 border-[#E8B86D]"
                    : "text-[#8090B0] hover:text-white border-b-2 border-transparent"
                }`
              }
            >
              {labels[idx]}
            </NavLink>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="font-play text-[#E8B86D] font-bold text-sm px-5 py-2 rounded-lg border border-[#E8B86D] hover:bg-[#E8B86D] hover:text-[#0d1528] active:scale-95 transition-all duration-200 tracking-wider"
      >
        LOGOUT
      </button>
    </div>
  );
};

export default Navbar;

