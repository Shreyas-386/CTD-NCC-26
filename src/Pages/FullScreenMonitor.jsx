import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const FullscreenMonitor = () => {
  const [exitCount, setExitCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const excludedPages = ["/", "/instructions"];
  const switchTab = !excludedPages.includes(location.pathname);



  const handleVisibility = () => {
    if (document.hidden && switchTab) {
      toast.error(`⚠ Tab switching is not allowed! ${exitCount}`, { autoClose: 3000 });
      // Optional: you could add logic here to end the test or log the event
    }
  };

  //  document.addEventListener("visibilitychange", handleVisibility);



  const enterFullscreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch {
      void (0);
    }
  };

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
        // .then(() => console.log("Exited fullscreen"))
        .catch((err) => void(0));
    }
  }

  const handleLogout = async () => {
    // Clear non-solved localStorage keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (!key.startsWith("solved_")) {
        localStorage.removeItem(key);
      }
    }
    setExitCount(0); // Reset state
    await api.post(
      `/user/logout`,
      {}
    );
    toast.error("You are logged out due to multiple fullscreen exits.", {
      position: "top-center",
      autoClose: 2000,
    });
    navigate("/"); // Redirect to login
  };

  const [_switchCount, setSwitchCount] = useState(0);


  useEffect(() => {
    const handleBlur = () => {
      setSwitchCount(prev => {
        const newCount = prev + 1;
        // console.log("Alt+Tab / window lost focus count:", newCount);

        if (newCount >= 3) {
          toast.error("You have switched windows too many times. Logging out.", { autoClose: 3000 });
          handleLogout(); // <-- call your logout function here
          exitFullscreen();
        }

        return newCount;
      });
    };



    const handleVisibilityChange = () => {
      if (document.hidden) handleBlur();
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const excludedPages = ["/", "/instructions"];
    const activePage = !excludedPages.includes(location.pathname);

    // Auto-enter fullscreen only when leaving instructions or home
    if (activePage) {
      enterFullscreen();
    }
  }, [location.pathname]);

  // console.log("Swtich TAB count: ", switchCount);

  useEffect(() => {
    if (location.pathname === "/") return; // Skip login page

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        const newCount = exitCount + 1;
        handleVisibility();
        setExitCount(newCount);

        // toast.warn(` Fullscreen exit detected! Exit count: ${newCount}`,{autoClose:3000});
        toast.warn(` Fullscreen exit detected!`, { autoClose: 2000 });

        enterFullscreen();

        // if (newCount >= 3 ) {
        //   setTimeout(handleLogout, 1000);
        //   exitFullscreen();
        //   setExitCount(0);
        // }
      }
    };

    const handleUserGesture = (e) => {
      if ((e.key === "F11" || e.key === "ESCAPE") && !document.fullscreenElement) {
        // Only call requestFullscreen inside user gesture
        enterFullscreen();
      }
    };


    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("click", handleUserGesture);
    document.addEventListener("keydown", handleUserGesture);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("click", handleUserGesture);
      document.removeEventListener("keydown", handleUserGesture);
    };
  }, [exitCount, location.pathname]);

  return null;
};

export default FullscreenMonitor;
