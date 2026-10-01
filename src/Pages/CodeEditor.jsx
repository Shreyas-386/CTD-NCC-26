import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import Description from "../components/Description";
import Sample from "../components/Sample";
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
  const languages = ["cpp", "java", "python"];
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-[#2a1f33] via-[#4b3140] to-[#9b6b5e] px-3">
      {/* Navbar */}
      <nav>
        <Navbar />
      </nav>

      <div className="mt-5 flex justify-end w-[80vw] ml-[17vw] p-4">
        <Timer />
      </div>

      {/* Tabs & Language Selector */}
      <div className="w-full text-white mt-5 flex justify-end pr-[1.5%]">
        <div className="w-1/2 text-white mt-10 flex flex-row justify-start gap-4 p-4 rounded-2xl shadow-md bg-[#1a1625]/90 backdrop-blur-sm border border-[#c29673] ml-3">
          {["Description", "SampleCase", "Submissions"].map((tab) => (
            <div
              key={tab}
              className={`cursor-pointer px-3 py-1 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200
                ${activeTab === tab
                  ? "bg-gradient-to-r from-[#FFE7A3] to-[#B8832F] text-[#0E0D40] shadow-lg border border-[#FFE7A3] font-play"
                  : "text-[#f3e3bf] hover:text-[#FFE7A3] font-play"
                }`}

              onClick={() => {
                setActiveTab(tab);
                if (tab === "Submissions") fetchSubmissions();
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="w-1/2 flex justify-end items-center gap-3 px-4 mt-10">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="font-play bg-gradient-to-r from-[#FFE7A3] to-[#E6B65C] text-[#0E0D40] font-semibold rounded-full px-6 py-2.5 shadow-[0_4px_0_#0D1026] border-2 border-[#FFE7A3] hover:shadow-[0_2px_0_#0D1026] hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer appearance-none pr-10"

            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-[#1a1625] text-[#FFE7A3] font-play">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#0E0D40]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Question + Code Editor */}
      <div
        className="w-full flex flex-col lg:flex-row gap-6 p-4"
        ref={leftColRef}
      >
        {/* Left Column: Question / Samples / Submissions */}
        <div className="w-full flex flex-col lg:w-1/2 gap-4 overflow-y-auto rounded-lg shadow-xl bg-gradient-to-b from-[#1a1625] to-[#231f2f] p-4 border border-[#c29673]">
          {/* Question / Samples / Submissions */}
          <div className=" p-4 rounded-lg bg-[#1a1625]/90 shadow-inner">
            {activeTab === "Description" && (
              <Description
                Question={question || { title: "", description: "", points: 0 }}
              />
            )}
            {activeTab === "SampleCase" && (
              <Sample samples={question.samples || []} />
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

        {/* Right Column: Code Editor + Custom Test Case / Submission Results */}
        <div
          className="w-full lg:w-1/2 flex flex-col rounded-lg shadow-md bg-[#1a1625]/90  p-3"
          style={{ height: "700px" }}
        >
          {/* Editor */}
          <div className="h-[420px] min-h-[420px] border border-[#c29673] rounded-t-lg overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 15,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: false,
                quickSuggestions: false,
                contextmenu: false,
              }}
              onMount={(editor, monaco) => {
                monaco.editor.defineTheme("dark-custom", {
                  base: "vs-dark",
                  inherit: true,
                  rules: [
                    { token: "", foreground: "E0E0E0" },
                    { token: "keyword", foreground: "FF79C6" },
                    { token: "string", foreground: "50FA7B" },
                    { token: "number", foreground: "BD93F9" },
                    {
                      token: "comment",
                      foreground: "6272A4",
                      fontStyle: "italic",
                    },
                    { token: "type", foreground: "8BE9FD" },
                    { token: "function", foreground: "F1FA8C" },
                  ],
                  colors: {
                    "editor.background": "#1a1625",
                    "editor.foreground": "#E0E0E0",
                    "editorCursor.foreground": "#FFE7A3",
                    "editor.lineHighlightBackground": "#231f2f",
                    "editorLineNumber.foreground": "#c29673",
                    "editor.selectionBackground": "#44475A",
                    "editorIndentGuide.background": "#44475A",
                    "editorIndentGuide.activeBackground": "#6272A4",
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

          {/* Custom Test Case / Submission Results */}
          <div className="flex flex-col gap-4 mt-3 overflow-y-auto">
            {submitResult ? (
              <div className="p-4 border border-[#c29673] rounded-md bg-[#1a1625]/90 text-white">
                <p className="font-bold mb-2 font-play flex justify-between items-center">
                  <span>
                    Status:{" "}
                    <span
                      className={
                        submitResult.status?.toLowerCase() === "accepted"
                          ? "text-[#FFE7A3]"
                          : "text-[#ff6b6b]"
                      }
                    >
                      {submitResult.status}
                    </span>{" "}
                    | Score: {submitResult.score ?? 0}
                  </span>

                  <button
                    className="ml-2 text-[#e6d4b3] hover:text-[#FFE7A3] transition font-play"
                    onClick={() => setSubmitResult(null)} // or your close handler
                  >
                    Close
                  </button>
                </p>

                <p className="mb-3 text-[#e6d4b3] font-play">
                  {submitResult.failed_test_case === 0
                    ? ` ${submitResult.total_test_case}/${submitResult.total_test_case
                    } test cases passed`
                    : `${submitResult.failed_test_case - 1} / ${submitResult.total_test_case
                    } test cases passed`}
                </p>

                <div className="space-y-2">
                  {Array.from({ length: submitResult.total_test_case }).map(
                    (_, idx) => {
                      let statusClass = "text-[#e6d4b3]";
                      let text = `Test Case ${idx + 1}`;

                      if (
                        submitResult.failed_test_case === 0 ||
                        idx + 1 < submitResult.failed_test_case
                      ) {
                        statusClass = "text-[#FFE7A3]";
                        text += ": PASSED";
                      } else if (idx + 1 === submitResult.failed_test_case) {
                        statusClass = "text-[#ff6b6b]";
                        text += ": FAILED";
                      }

                      return (
                        <div
                          key={idx + 1}
                          className="p-2 border border-[#c29673] rounded-md bg-[#231f2f]"
                        >
                          <p className={`font-play ${statusClass}`}>{text}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-row gap-4">
                <textarea
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Enter custom input..."
                  className="w-full h-[150px] p-3 bg-[#231f2f] text-white rounded-lg resize-none focus:outline-none border border-[#c29673] focus:border-[#FFE7A3] focus:ring-2 focus:ring-[#FFE7A3]/30 placeholder-[#e6d4b3]/50 font-play"
                />

                <div className="w-full h-[150px] text-[#e6d4b3] text-sm sm:text-base md:text-lg p-4 overflow-y-auto bg-[#231f2f] rounded-lg border border-[#c29673] font-play">
                  <div className="text-[#FFE7A3] font-semibold mb-2 font-play">Output:</div>
                  <pre className="text-white font-play">{output ?? ""}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Run & Submit buttons */}
          <div className="mt-5 flex gap-3 justify-end text-black font-bold text-xl">
            <button
              onClick={runCode}
              disabled={isRunning || customInput === ""}
              className="w-[150px] h-[50px] bg-gradient-to-r from-[#FFE7A3] to-[#E6B65C] text-[#0E0D40] font-bold border-2 border-[#FFE7A3] rounded-md shadow-[0_4px_0_#0D1026] hover:shadow-[0_2px_0_#0D1026] hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:from-[#6b5d4a] disabled:to-[#4a4135] disabled:text-[#e6d4b3]/50 disabled:border-[#6b5d4a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_#0D1026] font-play"
            >
              Run
            </button>
            <button
              onClick={submitCode}
              disabled={isSubmitting}
              className="w-[150px] h-[50px] bg-gradient-to-r from-[#FFE7A3] to-[#E6B65C] text-[#0E0D40] font-bold border-2 border-[#FFE7A3] rounded-md shadow-[0_4px_0_#0D1026] hover:shadow-[0_2px_0_#0D1026] hover:-translate-y-1 hover:scale-105 transition-all duration-300 disabled:from-[#6b5d4a] disabled:to-[#4a4135] disabled:text-[#e6d4b3]/50 disabled:border-[#6b5d4a] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0_#0D1026] font-play"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;