import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import api from "../api/axios";
import NccLogo from "./NccLogo";

// Shared bar geometry so every page's header sits at the same position / size
const barBase =
  "relative z-20 w-full shrink-0 px-4 sm:px-6 lg:px-12 py-3 sm:py-0 sm:h-16 lg:h-[72px] flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-3 gap-y-2 border-b backdrop-blur-md";

const linkRow = "order-last sm:order-none w-full sm:w-auto flex items-center justify-center gap-5 md:gap-8 lg:gap-11";

// Avatar matching the reference: mauve disc with a dark head-and-shoulders silhouette
const ProfileAvatar = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
    <defs>
      <linearGradient id="nv-avatar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d9b0d3" />
        <stop offset="100%" stopColor="#b98bb3" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="20" fill="url(#nv-avatar)" />
    <circle cx="20" cy="15" r="6" fill="#2b2238" />
    <path d="M9.5 30.5 C9.5 24.5 14.2 22 20 22 C25.8 22 30.5 24.5 30.5 30.5 C30.5 31.4 29.8 32 29 32 H11 C10.2 32 9.5 31.4 9.5 30.5 Z" fill="#2b2238" />
  </svg>
);

// variant="default" -> spaced "N C C" wordmark + avatar menu
// variant="gold"    -> gold slashed logo + uppercase links + LOGOUT button (Leaderboard)
const Navbar = ({ variant = "default" }) => {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await api.post(`/user/logout`, {});
    } catch (err) {
      console.error("Error during logout request:", err);
    } finally {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key.startsWith("solved_")) {
          localStorage.removeItem(key);
        }
      }
      window.location.href = "/";
    }
  };

  // close the avatar menu when clicking outside it
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const links = ["/instructions", "/questionhub", "/leaderboard"];

  if (variant === "gold") {
    const labels = ["INSTRUCTIONS", "QUESTION HUB", "LEADERBOARD"];
    return (
      <div className={`${barBase} bg-[#0d1a36]/70 border-[#2b3c66]/60`}>
        <NccLogo />

        <div className={linkRow}>
          {links.map((path, idx) => (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `relative py-2 whitespace-nowrap font-poppins text-[10px] sm:text-[11px] lg:text-xs font-semibold tracking-[0.12em] transition-colors duration-300
                ${isActive
                  ? "text-[#eef0f5] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:rounded-full after:bg-[#e8b57d]"
                  : "text-[#9aa7c4] hover:text-[#eef0f5]"
                }`
              }
            >
              {labels[idx]}
            </NavLink>
          ))}
        </div>

        <button
          className="ncc-gold-btn shrink-0 font-poppins text-xs font-bold tracking-[0.12em] px-4 py-2 lg:px-5 lg:py-2.5 rounded-lg"
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    );
  }

  const labels = ["Instructions", "Question Hub", "Leaderboard"];

  return (
    <div className={`${barBase} bg-[#121725]/70 border-white/10`}>
      {/* Wordmark */}
      <div className="shrink-0 font-poppins font-semibold text-xl lg:text-2xl tracking-[0.3em] text-[#eef0f5] select-none">
        NCC
      </div>

      {/* Nav Links */}
      <div className={linkRow}>
        {links.map((path, idx) => (
          <NavLink
            key={idx}
            to={path}
            className={({ isActive }) =>
              `relative py-2 whitespace-nowrap font-poppins text-xs sm:text-sm lg:text-[15px] transition-colors duration-300
              ${isActive
                ? "text-[#e8b57d] font-semibold after:absolute after:left-1/2 after:-translate-x-1/2 after:-bottom-1 after:w-[70%] after:max-w-9 after:h-[3px] after:rounded-full after:bg-[#e8b57d]"
                : "text-[#d6d9e2] hover:text-white"
              }`
            }
          >
            {labels[idx]}
          </NavLink>
        ))}
      </div>

      {/* Avatar + menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          aria-label="Account menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="block w-9 h-9 lg:w-11 lg:h-11 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:ring-2 hover:ring-[#e8b57d]/60 transition"
        >
          <ProfileAvatar />
        </button>

        {menuOpen && (
          <div className="ncc-pop origin-top-right absolute right-0 mt-3 w-40 rounded-xl ncc-glass p-1.5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-poppins text-[#eef0f5] hover:bg-white/5 hover:text-[#e8b57d] transition"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
