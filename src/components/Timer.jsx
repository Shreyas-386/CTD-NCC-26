import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function EventTimer() {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    // Fetch once on mount
    api
      .get(`/time`)
      .then((res) => {
        setRemainingMs(res.data.remainingMs); // use raw milliseconds
      })
      .catch((err) => void(0));
  }, []);

  useEffect(() => {
    if (remainingMs === null) return;

    if (remainingMs <= 0) {
      navigate("/results");
    }

    // Interval that ticks every second
    const interval = setInterval(() => {
      setRemainingMs((prev) => (prev > 0 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingMs, navigate]);

  // Formatter (same as backend’s formatRemainingTime)
  const formatRemainingTime = (ms) => {
    if (ms <= 0) return "Event Ended";

    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;

    return ` ${hours} : ${minutes} : ${seconds}`;
  };

  // if (remainingMs === null) return <p></p>;

  return (
    <div className="bg-gradient-to-r from-[#FFE7A3] to-[#B8832F] text-[#0E0D40] font-semibold rounded-full px-4 py-2 shadow-[0_4px_0_#0D1026] border-2 border-[#FFE7A3] hover:shadow-[0_2px_0_#0D1026] hover:-translate-y-1 hover:scale-105 transition-all duration-300">
      <p className="font-bold tracking-wide">{remainingMs == 0 ? <span>Loading...</span> : formatRemainingTime(remainingMs)}</p>
    </div>
  );
}

export default EventTimer;