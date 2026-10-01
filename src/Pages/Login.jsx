import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import login_image from "/LOGIN.svg";

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
      const username = (formData.username || "").trim();
      const password = (formData.password || "").trim();
      const teamname = (formData.teamname || "").trim();

      const response = await api.post(`/user/login`, {
        username: username,
        password: password,
        teamname: teamname,
        event_id: formData.event_id,
        isjunior: formData.isjunior,
        isVerified: formData.isVerified,
      });

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
    <div className="ncc-page flex min-h-screen">
      {/* Background blobs */}
      <div className="ncc-blob-gold" />
      <div className="ncc-blob-purple" />
      <div className="ncc-blob-purple-top" />

      {/* Dot pattern — top right */}
      <div className="ncc-dots" style={{ top: "32px", right: "32px", zIndex: 10 }} />

      {/* NCC Logo — top left */}
      <div
        className="absolute top-8 left-8 z-20 flex items-center gap-1 select-none"
      >
        <span style={{ color: "#8090B0", fontSize: "20px", fontWeight: 300 }}>//</span>
        <span
          style={{
            color: "#E8B86D",
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "5px",
            fontFamily: "Play, sans-serif",
          }}
        >
          NCC
        </span>
        <span style={{ color: "#8090B0", fontSize: "20px", fontWeight: 300 }}>//</span>
      </div>

      {/* ── Left column: illustration ── */}
      <div className="relative z-10 flex-1 hidden md:flex items-center justify-center">
        <img
          src={login_image}
          alt="Coding illustration"
          className="w-[78%] max-w-[520px] object-contain drop-shadow-2xl"
        />
      </div>

      {/* ── Right column: login card ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div
          className="w-full max-w-[420px] rounded-2xl p-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          style={{
            background: "#141c2e",
            border: "1px solid rgba(232,184,109,0.15)",
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-8 font-play">Login</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div>
              <label className="block text-sm text-[#8090B0] mb-2 font-play">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8090B0]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  placeholder="Enter your username"
                  className="ncc-input"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm text-[#8090B0] mb-2 font-play">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8090B0]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter your password"
                  className="ncc-input"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8090B0] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* TEAM NAME */}
            <div>
              <label className="block text-sm text-[#8090B0] mb-2 font-play">
                Team Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8090B0]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={formData.teamname}
                  onChange={(e) => setFormData({ ...formData, teamname: e.target.value })}
                  required
                  placeholder="Enter team name"
                  className="ncc-input"
                />
              </div>
            </div>

            {/* LEVEL RADIO */}
            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer font-play text-sm text-[#8090B0]">
                <input
                  type="radio"
                  checked={formData.isjunior === true}
                  onChange={() => setFormData({ ...formData, isjunior: true })}
                  className="hidden peer"
                />
                <span className="w-4 h-4 rounded-full border-2 border-[rgba(232,184,109,0.45)] peer-checked:bg-[#E8B86D] peer-checked:border-[#E8B86D] transition-all duration-200 flex-shrink-0" />
                Junior
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-play text-sm text-[#8090B0]">
                <input
                  type="radio"
                  checked={formData.isjunior === false}
                  onChange={() => setFormData({ ...formData, isjunior: false })}
                  className="hidden peer"
                />
                <span className="w-4 h-4 rounded-full border-2 border-[rgba(232,184,109,0.45)] peer-checked:bg-[#E8B86D] peer-checked:border-[#E8B86D] transition-all duration-200 flex-shrink-0" />
                Senior
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="ncc-btn-gold w-full mt-2"
              style={{ borderRadius: "10px", padding: "14px 32px", fontSize: "16px" }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0d1528] border-t-transparent rounded-full animate-spin" />
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

