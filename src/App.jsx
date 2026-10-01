import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Instructions from "./Pages/Instructions";
import QuestionHub from "./Pages/QuestionHub";
import CodeEditor from "./Pages/CodeEditor";
import Leaderboard from "./Pages/Leaderboard";
import Results from "./Pages/Results";
import { toast, ToastContainer } from "react-toastify";
// import FullscreenMonitor from "./Pages/FullScreenMonitor";
import ProtectedRoutes from "./ProtectedRoutes/ProtectedRoutes";
import PublicRoutes from "./ProtectedRoutes/PublicRoutes";


function App() {

  const location = useLocation();

  // // Pages where FullscreenMonitor should NOT appear
  // const excludedPages = ["/", "/instructions"];
  // const showFullscreenMonitor = !excludedPages.includes(location.pathname);
  // const switchTab = !excludedPages.includes(location.pathname);


  // useEffect(() => {
  //   const isLoginPage = window.location.pathname === "/";

  //   const disable = (e) => e.preventDefault();

  //   // ❌ Block only on non-login pages
  //   if (!isLoginPage) {
  //     document.addEventListener("contextmenu", disable);
  //     document.addEventListener("selectstart", disable);
  //     document.addEventListener("copy", disable);
  //     document.addEventListener("cut", disable);
  //     document.addEventListener("paste", disable);
  //   }

  //   const blockKeys = (e) => {
  //     // ✅ Allow everything on login page
  //     if (isLoginPage) return;

  //     if (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) {
  //       e.preventDefault();
  //     }

  //     if (
  //       (e.ctrlKey && ["c", "v", "x", "u"].includes(e.key.toLowerCase())) ||
  //       e.key === "F12"
  //     ) {
  //       e.preventDefault();
  //     }

  //     if (e.shiftKey && e.key === "Insert") e.preventDefault();
  //     if (e.ctrlKey && e.key === "Tab") e.preventDefault();
  //   };

  //   const handleVisibility = () => {
  //     if (document.hidden && switchTab) {
  //       toast.error("⚠ Tab switching is not allowed!", { autoClose: 3000 });
  //     }
  //   };

  //   document.addEventListener("keydown", blockKeys);
  //   document.addEventListener("visibilitychange", handleVisibility);

  //   return () => {
  //     document.removeEventListener("contextmenu", disable);
  //     document.removeEventListener("selectstart", disable);
  //     document.removeEventListener("copy", disable);
  //     document.removeEventListener("cut", disable);
  //     document.removeEventListener("paste", disable);
  //     document.removeEventListener("keydown", blockKeys);
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //   };
  // }, [switchTab]);


  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable

      />

        {/* {showFullscreenMonitor && <FullscreenMonitor />}  */}

      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Login />} />
          {/* <Route path="/instructions" element={<Instructions />} />
          <Route path="/questionhub" element={<QuestionHub />} />
          <Route path="/codeeditor" element={<CodeEditor />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} /> */}

        </Route>


        <Route element={<ProtectedRoutes />}>
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/questionhub" element={<QuestionHub />} />
          <Route path="/codeeditor" element={<CodeEditor />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/results" element={<Results />} />
        </Route>
      </Routes>
      {/* <Login /> */}
      {/* <Instructions /> */}
      {/* <QuestionHub /> */}
      {/* <CodeEditor /> */}
      {/* <Leaderboard /> */}
      {/* <Results /> */}
    </div>
  );
}

export default App;
