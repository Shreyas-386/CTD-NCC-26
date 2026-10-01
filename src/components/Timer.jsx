import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";


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
    <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 ncc-glass text-[#eef0f5]">
      <FiClock className="text-[#e8b57d]" />
      <p className="font-poppins font-semibold text-sm tracking-wide tabular-nums">{remainingMs == 0 ? <span>Loading...</span> : formatRemainingTime(remainingMs)}</p>
    </div>
  );
}

export default EventTimer;