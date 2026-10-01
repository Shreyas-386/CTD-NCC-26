import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser, FiLock, FiEye, FiEyeOff, FiUsers } from "react-icons/fi";
import Backdrop, { DotGrid } from "../components/Backdrop";
import NccLogo from "../components/NccLogo";

// Laptop + floating code panels illustration (pure SVG)
const LaptopArt = () => (
  <svg viewBox="0 0 520 380" className="w-full max-w-[520px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" aria-hidden="true">
    <defs>
      <linearGradient id="lp-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#a99bc2" />
        <stop offset="100%" stopColor="#5c5577" />
      </linearGradient>
      <linearGradient id="lp-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2d2c45" />
        <stop offset="100%" stopColor="#1a1b2e" />
      </linearGradient>
      <linearGradient id="lp-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b7aacb" />
        <stop offset="100%" stopColor="#6a6283" />
      </linearGradient>
      <linearGradient id="lp-panel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#3a3a5a" />
        <stop offset="100%" stopColor="#25263d" />
      </linearGradient>
      <linearGradient id="lp-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f6d3a6" />
        <stop offset="100%" stopColor="#d79c62" />
      </linearGradient>
    </defs>

    {/* back-left floating panel */}
    <g transform="translate(10 150) rotate(-4)">
      <rect width="120" height="80" rx="8" fill="url(#lp-panel)" stroke="#545577" />
      <rect x="14" y="16" width="12" height="5" rx="2.5" fill="#e8b57d" />
      <rect x="32" y="16" width="50" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="14" y="32" width="70" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="14" y="48" width="12" height="5" rx="2.5" fill="#e8b57d" />
      <rect x="32" y="48" width="40" height="5" rx="2.5" fill="#8e86ad" />
    </g>

    {/* laptop lid */}
    <g transform="translate(80 60) skewY(4)">
      <rect width="250" height="180" rx="12" fill="url(#lp-body)" />
      <rect x="12" y="12" width="226" height="156" rx="6" fill="url(#lp-screen)" />
      <path d="M100 70 L78 92 L100 114" fill="none" stroke="url(#lp-gold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150 70 L172 92 L150 114" fill="none" stroke="url(#lp-gold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M135 62 L117 122" stroke="url(#lp-gold)" strokeWidth="8" strokeLinecap="round" />
    </g>

    {/* laptop base */}
    <path d="M70 262 L340 280 L380 300 L110 284 Z" fill="url(#lp-base)" />
    <path d="M110 284 L380 300 L378 308 L108 292 Z" fill="#4f4868" />
    <path d="M150 272 L300 282 L310 288 L160 278 Z" fill="#8a7fa6" opacity="0.6" />

    {/* front-right floating panel */}
    <g transform="translate(330 40) rotate(4)">
      <rect width="140" height="110" rx="8" fill="url(#lp-panel)" stroke="#5c5d80" />
      <rect x="16" y="18" width="34" height="5" rx="2.5" fill="#e8b57d" />
      <rect x="16" y="34" width="12" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="34" y="34" width="70" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="16" y="52" width="24" height="5" rx="2.5" fill="#e8b57d" />
      <rect x="46" y="52" width="60" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="16" y="70" width="50" height="5" rx="2.5" fill="#8e86ad" />
      <rect x="16" y="86" width="30" height="5" rx="2.5" fill="#8e86ad" />
    </g>
  </svg>
);

const fieldWrap =
  "flex items-center gap-3 px-4 h-12 rounded-xl bg-[#0e1a33]/80 border border-[#2c3c63] focus-within:border-[#e8b57d] focus-within:ring-2 focus-within:ring-[#e8b57d]/20 transition";
const fieldInput =
  "flex-1 bg-transparent outline-none text-sm text-[#eef0f5] placeholder:text-[#7e8aa6] font-poppins";
const labelCls = "block mb-2 text-sm text-[#d4d9e5] font-poppins";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    teamname: "",
    event_id: 1,
    isjunior: false,
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // console.log(formData, formData.username);

      const username = (formData.username || "").trim();
      const password = (formData.password || "").trim();
      const teamname = (formData.teamname || "").trim();

      // console.log(username + " " + password + " " + teamname);

      // console.log(formData, username);
      const response = await api.post(
        `/user/login`,
        {
          username: username,
          password: password,
          teamname: teamname,
          event_id: formData.event_id,
          isjunior: formData.isjunior,
          isVerified: formData.isVerified,
        }
      );

      if (response?.status === 200) {
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        localStorage.setItem("isVerified", response.data.isVerified);
        localStorage.setItem("token", response.data.token);

        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 1000,
        });

        navigate("/instructions");
      }
    } catch (err) {
      if (err.response?.status === 501) {
        toast.error(err.response.data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        localStorage.setItem("isVerified", err.response.data.isVerified);
        navigate("/results");
        return;
      }

      if (err.response?.status === 400) {
        toast.error(err.response.data.error, {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      toast.error(err.response?.data?.error, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden font-poppins">
      <Backdrop tone="navy" />

      {/* NCC LOGO */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-10 pt-5 sm:pt-6">
        <NccLogo size="lg" />
      </div>

      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-center lg:justify-between gap-10">
        {/* ILLUSTRATION */}
        <div className="hidden lg:flex relative flex-1 justify-center max-h-full">
          <LaptopArt />
          <DotGrid rows={4} cols={5} gap={14} className="absolute bottom-[14%] right-[6%]" />
        </div>

        {/* FORM CARD */}
        <div className="w-full max-w-md p-6 sm:p-10 rounded-2xl bg-[#0f1c38]/75 border border-[#2c3c63] backdrop-blur-md shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f2f3f7] mb-8 sm:mb-10">Login</h1>

          <form className="space-y-5 sm:space-y-6 w-full" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div>
              <label className={labelCls}>Username</label>
              <div className={fieldWrap}>
                <FiUser className="text-[#c8cfdf] text-lg shrink-0" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  placeholder="Enter your username"
                  className={fieldInput}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className={labelCls}>Password</label>
              <div className={fieldWrap}>
                <FiLock className="text-[#c8cfdf] text-lg shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Enter your password"
                  className={fieldInput}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="text-[#c8cfdf] hover:text-[#e8b57d] transition"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Team name */}
            <div>
              <label className={labelCls}>Team Name</label>
              <div className={fieldWrap}>
                <FiUsers className="text-[#c8cfdf] text-lg shrink-0" />
                <input
                  type="text"
                  value={formData.teamname}
                  onChange={(e) =>
                    setFormData({ ...formData, teamname: e.target.value })
                  }
                  required
                  placeholder="Enter your team name"
                  className={fieldInput}
                />
              </div>
            </div>

            {/* LEVEL TOGGLE */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#0e1a33]/80 border border-[#2c3c63]">
              <label
                className={`flex items-center justify-center h-10 rounded-lg cursor-pointer text-sm font-medium transition
                  ${formData.isjunior === true ? "ncc-gold-btn" : "text-[#c8cfdf] hover:text-white"}`}
              >
                <input
                  type="radio"
                  checked={formData.isjunior === true}
                  onChange={() =>
                    setFormData({ ...formData, isjunior: true })
                  }
                  className="hidden"
                />
                Junior
              </label>

              <label
                className={`flex items-center justify-center h-10 rounded-lg cursor-pointer text-sm font-medium transition
                  ${formData.isjunior === false ? "ncc-gold-btn" : "text-[#c8cfdf] hover:text-white"}`}
              >
                <input
                  type="radio"
                  checked={formData.isjunior === false}
                  onChange={() =>
                    setFormData({ ...formData, isjunior: false })
                  }
                  className="hidden"
                />
                Senior
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="ncc-gold-btn w-full mt-4 h-12 rounded-xl text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-[3px] border-[#1a1410] border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
