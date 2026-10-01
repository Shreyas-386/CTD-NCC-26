const SubmitCodeBox = ({ code, onClose, Language }) => {
  if (!code) return null;

  // Decode the Base64 code
  let decodedCode = code;
  try {
    decodedCode = atob(code);
  } catch (err) {
    // console.log(err);
    // void(0);
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-[#1F1F2E] text-white p-6 rounded-xl w-full max-w-3xl shadow-2xl border border-[#444466]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3  right-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md transition-colors font-play"
        >
          Close
        </button>
        <div className="relative  text-white font-semibold mb-2 font-play">
          {Language || "Code"}
        </div>

        {/* Code block */}
        <div className="bg-[#2A2A40] flex flex-col p-5 rounded-lg overflow-auto max-h-[70vh] border border-[#555577] shadow-inner mt-5">


          <pre className="whitespace-pre-wrap break-words font-play text-sm sm:text-base">
            <code>{decodedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SubmitCodeBox;
