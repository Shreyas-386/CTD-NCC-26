import { useState } from "react";
import SubmitCodeBox from "./SubmitCodeBox";

const Submissions = ({ userSubmissions }) => {
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedlanguage, setSelectedlanguage] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <h3 className="text-2xl font-bold text-[#f3f4f8] font-exo">
        Submissions
      </h3>

      {/* Submission List */}
      <div className="space-y-3">
        {userSubmissions.length > 0 ? (
          userSubmissions.map((submission, index) => (
            <div
              key={index}
              onClick={() => { setSelectedCode(submission.code), setSelectedlanguage(submission.language) }}
              className="rounded-xl ncc-glass p-4 cursor-pointer hover:border-[#e8b57d]/40 transition-colors duration-300"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Language Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 text-[#e8b57d] border border-[#e8b57d]/30 font-poppins uppercase tracking-wide">
                  {submission.language}
                </span>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border font-poppins ${submission.result.toLowerCase().includes("pass") ||
                    submission.result.toLowerCase().includes("accepted") ||
                    submission.result.toLowerCase().includes("success")
                    ? "bg-[#7ed6a0]/15 text-[#8fe3ae] border-[#7ed6a0]/30"
                    : submission.result.toLowerCase().includes("fail") ||
                      submission.result.toLowerCase().includes("reject") ||
                      submission.result.toLowerCase().includes("error")
                      ? "bg-[#ff7b7b]/15 text-[#ff9b9b] border-[#ff7b7b]/30"
                      : "bg-[#e8b57d]/15 text-[#f4cc9a] border-[#e8b57d]/30"
                    }`}
                >
                  {submission.result}
                </span>

                {/* Timestamp */}
                <span className="text-xs text-[#9aa3b5] font-poppins tabular-nums">
                  {new Date(submission.submitted_at).toLocaleTimeString([], {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 rounded-xl ncc-glass font-poppins">
            <p className="text-base text-[#e8b57d] font-semibold">No submissions yet.</p>
            <p className="text-sm mt-2 text-[#9aa3b5]">
              Your code submissions will appear here once you start solving problems.
            </p>
          </div>
        )}
      </div>

      {/* Code preview popup */}
      {selectedCode && (
        <SubmitCodeBox
          code={selectedCode}
          onClose={() => setSelectedCode(null)}
          Language={selectedlanguage}
        />
      )}
    </div>
  );
};

export default Submissions;
