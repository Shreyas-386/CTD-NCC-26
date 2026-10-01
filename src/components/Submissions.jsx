import { useState } from "react";
import SubmitCodeBox from "./SubmitCodeBox";

const Submissions = ({ userSubmissions }) => {
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedlanguage, setSelectedlanguage] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <h3 className="text-2xl font-bold text-[#FFE7A3] font-play">
        Submissions
      </h3>

      {/* Submission List */}
      <div className="space-y-3">
        {userSubmissions.length > 0 ? (
          userSubmissions.map((submission, index) => (
            <div
              key={index}
              onClick={() => { setSelectedCode(submission.code), setSelectedlanguage(submission.language) }}
              className="bg-[#1a1625] border-2 border-[#c29673] rounded-lg p-4 cursor-pointer hover:bg-[#231f2f] hover:border-[#FFE7A3] transition-all duration-300 shadow-md hover:shadow-[0_0_15px_rgba(202,150,115,0.3)]"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Language Badge */}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-[#FFE7A3] to-[#E6B65C] text-[#0E0D40] border border-[#FFE7A3] shadow-[0_2px_0_#0D1026] font-play">
                  {submission.language}
                </span>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border-2 font-play ${submission.result.toLowerCase().includes("pass") ||
                    submission.result.toLowerCase().includes("accepted") ||
                    submission.result.toLowerCase().includes("success")
                    ? "bg-gradient-to-r from-[#FFE7A3] to-[#E6B65C] text-[#0E0D40] border-[#FFE7A3]"
                    : submission.result.toLowerCase().includes("fail") ||
                      submission.result.toLowerCase().includes("reject") ||
                      submission.result.toLowerCase().includes("error")
                      ? "bg-gradient-to-r from-[#ff6b6b] to-[#ff4757] text-white border-[#ff6b6b]"
                      : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0E0D40] border-[#FFD700]"
                    } shadow-[0_2px_0_#0D1026]`}
                >
                  {submission.result}
                </span>

                {/* Timestamp */}
                <span className="text-sm text-[#e6d4b3] font-play">
                  {new Date(submission.submitted_at).toLocaleTimeString([], {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-[#1a1625] border-2 border-[#c29673] rounded-lg font-play">
            <p className="text-lg text-[#FFE7A3] font-play">No submissions yet.</p>
            <p className="text-sm mt-2 text-[#e6d4b3] font-play">
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