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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#05070d]/75 backdrop-blur-sm px-4">
      <div className="relative bg-[#141927] text-[#eef0f5] p-6 rounded-2xl w-full max-w-3xl shadow-2xl border border-white/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-4 py-1.5 rounded-lg text-sm font-semibold font-poppins border border-white/20 text-[#eef0f5] hover:border-[#e8b57d] hover:text-[#e8b57d] transition-colors"
        >
          Close
        </button>
        <div className="relative font-exo font-semibold text-lg text-[#e8b57d] uppercase tracking-wide">
          {Language || "Code"}
        </div>

        {/* Code block */}
        <div className="bg-[#0f1320] flex flex-col p-5 rounded-xl overflow-auto max-h-[70vh] border border-white/10 shadow-inner mt-5 ncc-scroll">


          <pre className="whitespace-pre-wrap break-words font-code text-sm text-[#d7dbe5]">
            <code>{decodedCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SubmitCodeBox;
