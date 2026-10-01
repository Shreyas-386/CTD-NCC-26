import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiX, FiRotateCcw } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Backdrop from "../components/Backdrop";
import api from "../api/axios";
import Description from "../components/Description";
import Submissions from "../components/Submissions";
import Timer from "../components/Timer";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:3000";

function encodeBase64(str) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function subscribeToSubmission(submissionId, onResult, activeStreams) {
  if (activeStreams.has(submissionId)) return;

  const eventSource = new EventSource(
    `${BACKEND_URL}/submission/sse/${submissionId}`,
    { withCredentials: true }
  );
  activeStreams.set(submissionId, eventSource);

  eventSource.addEventListener('result', (event) => {
    try {
      onResult(JSON.parse(event.data));
    } finally {
      activeStreams.delete(submissionId);
      eventSource.close();
    }
  });

  eventSource.onerror = () => {
    activeStreams.delete(submissionId);
    eventSource.close();
  };
}

const CodeEditor = () => {
  const languages = ["python", "java", "cpp"];
  const [language, setLanguage] = useState("python");

  const [code, setCode] = useState("");

  const [output, setOutput] = useState("");
  const [submitResult, setSubmitResult] = useState(null);
  const [customInput, setCustomInput] = useState("");

  const [machineInput, setMachineInput] = useState("");
  const [machineOutput, setMachineOutput] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMachineRun, setIsMachineRun] = useState(false);

  const [activeTab, setActiveTab] = useState("Description");
  const [question, setQuestion] = useState({});
  const [userSubmissions, setUserSubmissions] = useState([]);

  const [lastInput, setLastInput] = useState("");

  const leftColRef = useRef(null);
  const activeStreamsRef = useRef(new Map());
  const navigate = useNavigate();

  const location = useLocation();
  const questionIndex = location.state?.problem_id;

  useEffect(() => {
    const activeStreams = activeStreamsRef.current;

    return () => {
      activeStreams.forEach((eventSource) => eventSource.close());
      activeStreams.clear();
    };
  }, []);

  const defaultCode = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    java: `import java.util.*;
    
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    python: `print("Hello, World!")`,
  };

  //Load save
  useEffect(() => {
    if (!question?.id) return;
    const saved = localStorage.getItem(`code_q${question.id}_${language}`);
    // console.log(saved);
    if (saved) setCode(saved);
    else setCode(defaultCode[language]);
  }, [question, language]);

  // Auto-save code
  useEffect(() => {
    // console.log(question.id )
    if (!question?.id) return;

    const timer = setTimeout(() => {
      localStorage.setItem(`code_q${question.id}_${language}`, code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, question, language]);

//fetch question
useEffect(() => {
  if (!questionIndex) return;
  const fetchQuestion = async () => {
    try {
      const res = await api.get(
        `/problems/${questionIndex}`
      );
      // console.log(res.data.id);
      setQuestion(res.data);

    } catch (err) {
      if (err?.response?.status === 403) {
        navigate("/results");
        return;
      }
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 2000,
      });
      console.error("Error fetching question:", err);
    }
  };
  fetchQuestion();
}, [questionIndex]);

// Run code
const runCode = async () => {
  setIsRunning(true);
  setOutput(null);
  setSubmitResult(null);

  const payload = {
    code: encodeBase64(code),
    customTestcase: encodeBase64(customInput),
    language,
    problem_id: question?.id || 1,
    event_id: 2,
  };

  try {
    const res = await api.post(`/submission/run`, payload);

    subscribeToSubmission(res.data.submission_id, (data) => {
      if (data.user_output) {
        setOutput(data.user_output);
      } else {
        setOutput(`${data.status} : ${data.message}`);
      }

      setIsRunning(false);
    }, activeStreamsRef.current);
  } catch (err) {
    if (err?.response?.status === 403) {
      navigate("/results");
      return;
    }
    setOutput("Error: " + (err.response?.data?.message || err.message));
    setIsRunning(false);
  }
};

const submitCode = async () => {
  setIsSubmitting(true);
  setOutput(null);
  setSubmitResult(null);

  try {
    const res = await api.post(
      `/submission/submit`,
      {
        code: encodeBase64(code),
        language,
        problem_id: question?.id || 1,
        event_id: 2,
      }
    );

    subscribeToSubmission(res.data.submission_id, (data) => {
      const parsedData = {
        status: data.status || "unknown",
        message: data.message || "",
        failed_test_case: parseInt(data.failed_test_case ?? "0", 10),
        total_test_case: parseInt(data.total_test_case ?? "0", 10),
        score: parseInt(data.score ?? "0", 10),
      };

      setSubmitResult(parsedData);

      if (
        parsedData.status === "accepted" &&
        !localStorage.getItem(`solved_${questionIndex}`)
      ) {
        localStorage.setItem(`solved_${questionIndex}`, "solved");
      }
      setIsSubmitting(false)
    }, activeStreamsRef.current);

  } catch (err) {
    if (err?.response?.status === 403) {
      navigate("/results");
      return;
    }

    console.error(err);

    toast.error("Something went wrong", {
      position: "top-center",
      autoClose: 2000,
    });
    setIsSubmitting(false);
  }
};

const machineRun = async () => {
  setMachineOutput(null);
  setIsMachineRun(true);
  setLastInput(machineInput);

  const payload = {
    customTestcase: encodeBase64(machineInput),
    problem_id: question?.id || 1,
    event_id: 2,
  };

  try {
    const res = await api.post(
      `/submission/run-system`,
      payload
    );

    subscribeToSubmission(res.data.submission_id, (data) => {
      setMachineOutput(
        data.user_output
          ? data.user_output
          : `${data.status} : ${data.message}`
      );

      setIsMachineRun(false);
    }, activeStreamsRef.current);

  } catch (err) {
    if (err?.response?.status === 403) {
      navigate("/results");
      return;
    }
    setMachineOutput("Error: " + (err.response?.data?.message || err.message));
    setIsMachineRun(false);
  }
};

  //fetch submissions
  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/user/gethistory`);
      const filterData = res.data.filter(
        (submission) => submission.problem_id === questionIndex
      );
      setUserSubmissions(filterData);
    } catch {
      void 0;
    }
  };

  const languageLabels = { python: "Python", java: "Java", cpp: "C++" };
  const tabs = [
    { key: "Description", label: "Description" },
    { key: "TestCases", label: "Test Cases" },
    { key: "Submissions", label: "Submissions" },
  ];

  // ---- resizable split (UI only) ----
  const SPLIT_MIN = 25;
  const SPLIT_MAX = 75;
  const [leftPct, setLeftPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const rect = leftColRef.current?.getBoundingClientRect();
      if (!rect) return;
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, pct)));
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // show the Test Cases tab while a submission is judged / when its result arrives
  useEffect(() => {
    if (isSubmitting || submitResult) setActiveTab("TestCases");
  }, [isSubmitting, submitResult]);

  const isAccepted = submitResult?.status?.toLowerCase() === "accepted";

  // ---- reset code (confirm first) ----
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const confirmReset = () => {
    setCode(defaultCode[language]);
    setShowResetConfirm(false);
    toast.success(`${languageLabels[language]} code reset to default`, {
      position: "top-center",
      autoClose: 1500,
    });
  };

  useEffect(() => {
    if (!showResetConfirm) return;
    const onKey = (e) => {
      if (e.key === "Escape") setShowResetConfirm(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showResetConfirm]);

  return (
    <div className="relative flex flex-col w-full min-h-screen lg:h-dvh lg:min-h-0 overflow-x-hidden lg:overflow-hidden font-poppins">
      <Backdrop tone="dusk" />

      {/* Navbar */}
      <nav className="relative z-20 shrink-0">
        <Navbar />
      </nav>

      <div className="relative z-10 flex-1 lg:min-h-0 w-full p-3 sm:p-4 lg:p-0 flex flex-col lg:overflow-hidden">
        {/* Question + Code Editor (resizable halves) */}
        <div
          className="w-full lg:flex-1 lg:min-h-0 flex flex-col lg:flex-row gap-4 lg:gap-0"
          ref={leftColRef}
          style={{ "--left": `${leftPct}%` }}
        >
          {/* Left half: Description / Test Cases / Submissions */}
          <div className="w-full lg:w-[var(--left)] lg:min-h-0 flex flex-col rounded-2xl lg:rounded-none ncc-glass lg:border-0 lg:shadow-none overflow-hidden">
            {/* Tabs row */}
            <div className="shrink-0 flex items-center gap-3 px-3 lg:px-4 py-2 border-b border-white/10">
              <Link
                to="/questionhub"
                aria-label="Back to Question Hub"
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#d6d9e2] hover:text-[#e8b57d] hover:bg-white/5 transition-colors"
              >
                <FiArrowLeft className="text-lg" />
              </Link>
              <div className="flex gap-1 overflow-x-auto ncc-scroll">
                {tabs.map(({ key, label }) => (
                  <div
                    key={key}
                    className={`cursor-pointer whitespace-nowrap px-3 lg:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                      ${activeTab === key
                        ? "ncc-gold-btn"
                        : "text-[#c9cde0] hover:text-white hover:bg-white/5"
                      }`}

                    onClick={() => {
                      setActiveTab(key);
                      if (key === "Submissions") fetchSubmissions();
                    }}
                  >
                    {label}
                    {key === "TestCases" && submitResult && (
                      <span className={`ml-2 inline-block w-1.5 h-1.5 rounded-full align-middle ${isAccepted ? "bg-[#5fd38d]" : "bg-[#ff8f8f]"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto ncc-scroll p-4 sm:p-5 lg:p-6">
              {activeTab === "Description" && (
                <Description
                  Question={question || { title: "", description: "", points: 0 }}
                />
              )}

              {activeTab === "TestCases" && (
                submitResult ? (
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2
                            ${isAccepted
                              ? "border-[#f4cc9a] text-[#f4cc9a] shadow-[0_0_24px_rgba(244,204,154,0.45)]"
                              : "border-[#ff8f8f] text-[#ff8f8f] shadow-[0_0_24px_rgba(255,143,143,0.35)]"
                            }`}
                        >
                          {isAccepted ? <FiCheck className="text-2xl" /> : <FiX className="text-2xl" />}
                        </div>
                        <div>
                          <p className="font-exo font-bold text-xl text-[#f3f4f8]">
                            Solution Submitted!
                          </p>
                          <p className="text-sm text-[#9aa3b5]">
                            {submitResult.failed_test_case === 0
                              ? ` ${submitResult.total_test_case}/${submitResult.total_test_case
                              } test cases passed`
                              : `${submitResult.failed_test_case - 1} / ${submitResult.total_test_case
                              } test cases passed`}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-exo font-bold text-xl text-[#f3f4f8]">
                          Score: {submitResult.score ?? 0}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold capitalize
                            ${isAccepted
                              ? "bg-[#86e0a5] text-[#103a22]"
                              : "bg-[#ff9b9b] text-[#4a1010]"
                            }`}
                        >
                          {submitResult.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {Array.from({ length: submitResult.total_test_case }).map(
                        (_, idx) => {
                          let statusClass = "text-[#9aa3b5] border-white/10";
                          let text = `Test Case ${idx + 1}`;

                          if (
                            submitResult.failed_test_case === 0 ||
                            idx + 1 < submitResult.failed_test_case
                          ) {
                            statusClass = "text-[#8fe3ae] border-[#7ed6a0]/30 bg-[#7ed6a0]/10";
                            text += ": PASSED";
                          } else if (idx + 1 === submitResult.failed_test_case) {
                            statusClass = "text-[#ff9b9b] border-[#ff7b7b]/30 bg-[#ff7b7b]/10";
                            text += ": FAILED";
                          }

                          return (
                            <div
                              key={idx + 1}
                              className={`px-3 py-2 rounded-lg border text-sm font-medium ${statusClass}`}
                            >
                              {text}
                            </div>
                          );
                        }
                      )}
                    </div>

                    <button
                      className="mt-5 px-5 py-2 rounded-xl border border-white/25 text-sm font-semibold text-[#eef0f5] hover:border-[#e8b57d] hover:text-[#e8b57d] transition"
                      onClick={() => setSubmitResult(null)} // or your close handler
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center gap-3">
                    {isSubmitting ? (
                      <>
                        <div className="w-8 h-8 border-[3px] border-[#e8b57d] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#e8b57d] font-semibold">Judging your submission...</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[#e8b57d] font-semibold font-exo text-lg">No results yet</p>
                        <p className="text-sm text-[#9aa3b5]">Submit your code to see how it does on each test case.</p>
                      </>
                    )}
                  </div>
                )
              )}

              {activeTab === "Submissions" && (
                <Submissions userSubmissions={userSubmissions} />
              )}
            </div>

          {/* set this false for NCC else true for RC */}
          {false && (
            <>
          {/* Test Case Section */}
          <div className="flex flex-col border-2 border-[#c29673] rounded-lg p-4 bg-[#1a1625]/90 shadow-md text-white gap-3">
            <div className="text-lg font-semibold text-[#FFE7A3] font-play">
              Test Case
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Box */}
              <div className="flex flex-col font-play">
                <label className="text-sm text-[#e6d4b3] mb-1 font-play">Input</label>
                <textarea
                  className="bg-[#231f2f] border border-[#c29673] rounded-md p-3 text-white placeholder-[#e6d4b3]/50 focus:outline-none focus:ring-2 focus:ring-[#FFE7A3] focus:border-[#FFE7A3] resize-none font-play"
                  rows={5}
                  value={machineInput}
                  onChange={(e) => setMachineInput(e.target.value)}
                  placeholder="Enter input here"
                ></textarea>
              </div>

              {/* Output Display Box */}
              <div className="flex flex-col font-play">
                <label className="text-sm text-[#e6d4b3] mb-1 font-play">
                  Expected Output
                </label>
                <div className="bg-[#231f2f] border border-[#c29673] rounded-md p-3 text-white h-[120px] overflow-auto font-play">
                  {machineOutput}
                </div>
              </div>
            </div>


            <div className="relative group inline-block w-full">
              <button
                disabled={isMachineRun || lastInput === machineInput || machineInput === ""}
                className="w-full mt-3 bg-gradient-to-r from-[#FFE7A3] to-[#B8832F] text-[#0E0D40] font-semibold py-2 px-4 rounded-lg shadow-[0_4px_0_#0D1026] border-2 border-[#FFE7A3] hover:shadow-[0_2px_0_#0D1026] transition-all duration-300 disabled:from-[#6b5d4a] disabled:to-[#4a4135] disabled:text-[#e6d4b3]/50 disabled:border-[#6b5d4a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_#0D1026] font-play"
                onClick={machineRun}
              >
                Machine Run
              </button>

              {/* Tooltip */}
              {(isMachineRun || lastInput === machineInput || machineInput === "") && (
                <span
                  className="
        pointer-events-none
        absolute left-1/2 -translate-x-1/2 bottom-full mb-2
        px-3 py-1
        text-sm text-[#0E0D40]
        bg-[#FFE7A3]
        rounded-md
        opacity-0
        group-hover:opacity-100
        transition-opacity duration-200
        whitespace-nowrap
        shadow-lg
        font-play
      "
                >
                  {machineInput === ""
                    ? "Enter input to enable Machine Run"
                    : lastInput === machineInput
                      ? "Change input to enable Machine Run"
                      : isMachineRun
                        ? "Machine is already running"
                        : ""}
                </span>
              )}
            </div>


          </div>
            </>
          )}
          </div>

          {/* Drag handle between the halves (desktop only) */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-valuenow={Math.round(leftPct)}
            aria-valuemin={SPLIT_MIN}
            aria-valuemax={SPLIT_MAX}
            tabIndex={0}
            title="Drag to resize · double-click to reset"
            onPointerDown={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDoubleClick={() => setLeftPct(50)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setLeftPct((p) => Math.max(SPLIT_MIN, p - 2));
              if (e.key === "ArrowRight") setLeftPct((p) => Math.min(SPLIT_MAX, p + 2));
            }}
            className="hidden lg:flex shrink-0 w-2.5 bg-[#0c0f17] border-x border-white/10 cursor-col-resize items-center justify-center group outline-none"
          >
            <div
              className={`w-1 h-14 rounded-full transition-colors duration-200
                ${isDragging ? "bg-[#e8b57d]" : "bg-white/15 group-hover:bg-[#e8b57d]/70 group-focus-visible:bg-[#e8b57d]/70"}`}
            />
          </div>

          {/* Right half: language tabs + timer, editor, custom I/O, run/submit */}
          <div className="w-full lg:flex-1 lg:w-auto lg:min-w-0 lg:min-h-0 flex flex-col rounded-2xl lg:rounded-none ncc-glass lg:border-0 lg:shadow-none overflow-hidden">
            {/* Language tabs + Timer */}
            <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-3 lg:px-4 py-2 border-b border-white/10">
              <div className="flex gap-1 p-1 rounded-xl bg-white/5">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 sm:px-4 lg:px-5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200
                      ${language === lang
                        ? "ncc-gold-btn"
                        : "text-[#c9cde0] hover:text-white"
                      }`}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  title="Reset to default code"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 text-xs sm:text-sm font-medium text-[#c9cde0] hover:text-[#e8b57d] hover:border-[#e8b57d]/60 transition-colors"
                >
                  <FiRotateCcw className="text-sm" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
                <Timer />
              </div>
            </div>

            {/* Editor */}
            <div className="h-[420px] sm:h-[480px] lg:h-auto lg:flex-1 lg:min-h-[160px]">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                  fontSize: 15,
                  fontFamily: "JetBrains Mono, Fira Code, monospace",
                  minimap: { enabled: false },
                  tabSize: 2,
                  insertSpaces: true,
                  detectIndentation: false,
                  quickSuggestions: false,
                  contextmenu: false,
                  padding: { top: 16 },
                  automaticLayout: true,
                }}
                onMount={(editor, monaco) => {
                  monaco.editor.defineTheme("dark-custom", {
                    base: "vs-dark",
                    inherit: true,
                    rules: [
                      { token: "", foreground: "E4E7EE" },
                      { token: "keyword", foreground: "F472B6" },
                      { token: "string", foreground: "E8B57D" },
                      { token: "number", foreground: "C4B5FD" },
                      {
                        token: "comment",
                        foreground: "6B7390",
                        fontStyle: "italic",
                      },
                      { token: "type", foreground: "F9A8D4" },
                      { token: "function", foreground: "F9A8D4" },
                    ],
                    colors: {
                      "editor.background": "#121624",
                      "editor.foreground": "#E4E7EE",
                      "editorCursor.foreground": "#E8B57D",
                      "editor.lineHighlightBackground": "#1A1F30",
                      "editorLineNumber.foreground": "#5D6580",
                      "editorLineNumber.activeForeground": "#E8B57D",
                      "editor.selectionBackground": "#2E3550",
                      "editorIndentGuide.background": "#232838",
                      "editorIndentGuide.activeBackground": "#3A4160",
                      "editorGutter.background": "#121624",
                    },
                  });
                  monaco.editor.setTheme("dark-custom");

                  // Tab inserts spaces
                  editor.addCommand(monaco.KeyCode.Tab, () => {
                    editor.trigger("keyboard", "type", { text: "  " });
                  });
                }}
              />
            </div>

            {/* Custom Input / Output + Run & Submit */}
            <div className="shrink-0 border-t border-white/10 p-3 lg:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col min-w-0">
                  <span className="mb-1.5 text-xs font-semibold tracking-wide text-[#e8b57d] font-exo uppercase">
                    Custom Input
                  </span>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input..."
                    className="w-full h-28 lg:h-32 p-3 rounded-xl bg-[#0f1320]/70 border border-white/10 text-sm text-[#eef0f5] font-code resize-none outline-none focus:border-[#e8b57d]/60 placeholder:text-[#7e8aa6] ncc-scroll"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="mb-1.5 text-xs font-semibold tracking-wide text-[#e8b57d] font-exo uppercase">
                    Output
                  </span>
                  <div className="w-full h-28 lg:h-32 p-3 rounded-xl bg-[#0f1320]/70 border border-white/10 overflow-y-auto ncc-scroll">
                    {isRunning ? (
                      <span className="text-sm text-[#9aa3b5]">Running...</span>
                    ) : (
                      <pre className="text-[#d7dbe5] text-sm font-code whitespace-pre-wrap">{output ?? ""}</pre>
                    )}
                  </div>
                </div>
              </div>

              {/* Run & Submit buttons */}
              <div className="mt-3 flex gap-3 justify-end">
                <button
                  onClick={runCode}
                  disabled={isRunning || customInput === ""}
                  className="w-28 sm:w-36 h-11 rounded-xl border border-white/25 text-[#eef0f5] font-semibold hover:border-[#e8b57d] hover:text-[#e8b57d] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/25 disabled:hover:text-[#eef0f5]"
                >
                  {isRunning ? "Running..." : "Run"}
                </button>
                <button
                  onClick={submitCode}
                  disabled={isSubmitting}
                  className="ncc-gold-btn w-28 sm:w-36 h-11 rounded-xl font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset confirmation pop-up */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center px-4 bg-[#05070d]/70 backdrop-blur-sm"
          onClick={() => setShowResetConfirm(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            aria-describedby="reset-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl p-6 bg-[#141927] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-[#e8b57d]/15 text-[#e8b57d]">
                <FiRotateCcw className="text-xl" />
              </div>
              <div>
                <h3 id="reset-title" className="font-exo font-bold text-lg text-[#f3f4f8]">
                  Reset code?
                </h3>
                <p id="reset-desc" className="mt-1 text-sm leading-relaxed text-[#9aa3b5]">
                  Your current {languageLabels[language]} code will be replaced with the default template. This can't be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                onClick={() => setShowResetConfirm(false)}
                className="px-5 h-10 rounded-xl border border-white/20 text-sm font-semibold text-[#eef0f5] hover:border-[#e8b57d] hover:text-[#e8b57d] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="ncc-gold-btn px-5 h-10 rounded-xl text-sm font-semibold"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
