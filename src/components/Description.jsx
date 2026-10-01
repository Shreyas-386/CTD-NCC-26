const sectionCard = "mt-4 p-5 rounded-2xl ncc-glass";
const sectionTitle = "text-lg font-semibold text-[#e8b57d] mb-2 font-exo";
const sectionBody = "text-sm text-[#d7dbe5] whitespace-pre-wrap break-words font-code leading-relaxed";

const formatValue = (value) => String(value ?? "").replace(/\\n/g, "\n");

const Description = ({ Question }) => {
  const samples = Question.samples || [];

  return (
    <>
      {/* Problem title + Points + Solved Badge */}
      <div className="flex flex-wrap items-center gap-3 whitespace-pre-line">
        <h1 className="font-exo font-bold text-2xl sm:text-3xl text-[#f3f4f8]">
          {Question.title || "Untitled"}
        </h1>
        <span className="ncc-gold-btn px-3 py-1 rounded-lg text-sm font-semibold">
          {Question.score || 0} pts
        </span>
        {localStorage.getItem(`solved_${Question.problem_id}`) && (
          <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-[#7ed6a0]/15 text-[#8fe3ae] border border-[#7ed6a0]/30 flex items-center gap-1 font-poppins">
            <span>✓</span> Solved
          </span>
        )}
      </div>

      {/* Description */}
      <div className={sectionCard}>
        <h2 className={sectionTitle}>Description</h2>
        <p className="text-sm leading-relaxed text-[#d7dbe5] whitespace-pre-line font-poppins">
          {Question.description || "No description available."}
        </p>
      </div>

      {/* Input Format */}
      <div className={sectionCard}>
        <h2 className={sectionTitle}>Input Format</h2>
        <pre className={sectionBody}>{Question.input_format || "N/A"}</pre>
      </div>

      {/* Output Format */}
      <div className={sectionCard}>
        <h2 className={sectionTitle}>Output Format</h2>
        <pre className={sectionBody}>{Question.output_format || "N/A"}</pre>
      </div>

      {/* Sample Test Case(s) + Output */}
      {samples.length === 0 ? (
        <div className={sectionCard}>
          <h2 className={sectionTitle}>Sample Test Case</h2>
          <p className="text-sm text-[#9aa3b5]">No sample test cases available.</p>
        </div>
      ) : (
        samples.map((item, index) => (
          <div key={item.id ?? index} className={sectionCard}>
            <h2 className={sectionTitle}>
              Sample Test Case{samples.length > 1 ? ` ${index + 1}` : ""}
            </h2>
            <pre className={sectionBody}>{formatValue(item.input)}</pre>

            <h2 className={`${sectionTitle} mt-4`}>Output</h2>
            <pre className={sectionBody}>{formatValue(item.output)}</pre>

            {item.explanation != null && item.explanation !== "" && (
              <>
                <h2 className="mt-4 mb-1 text-sm font-semibold text-[#c9cde0] font-exo">Explanation</h2>
                <pre className={sectionBody}>{formatValue(item.explanation)}</pre>
              </>
            )}
          </div>
        ))
      )}

      {/* Constraints */}
      <div className={sectionCard}>
        <h2 className={sectionTitle}>Constraints</h2>
        <pre className={sectionBody}>{Question.constraints || "N/A"}</pre>
      </div>
    </>
  );
};

export default Description;
