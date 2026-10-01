

const formatValue = (value) => String(value ?? "").replace(/\\n/g, "\n");

const Sample = ({ samples = [] }) => {
  if (!samples.length) {
    return <p className="text-[#9aa3b5] font-poppins text-sm">No sample test cases available.</p>;
  }

  return (
    <div className="space-y-4">
      {samples.map((item, index) => (
        <section
          key={item.id ?? index}
          className="rounded-2xl ncc-glass p-5"
        >
          <h3 className="mb-3 text-lg font-semibold text-[#e8b57d] font-exo">
            Example {index + 1}
          </h3>

          <div className="space-y-3 font-code text-sm">
            <div className="min-w-0">
              <strong className="text-[#f3f4f8]">Input:</strong>
              <pre className="mt-1 whitespace-pre-wrap break-words text-[#c6cbd8]">
                {formatValue(item.input)}
              </pre>
            </div>

            <div className="min-w-0">
              <strong className="text-[#f3f4f8]">Output:</strong>
              <pre className="mt-1 whitespace-pre-wrap break-words text-[#c6cbd8]">
                {formatValue(item.output)}
              </pre>
            </div>

            {item.explanation != null && item.explanation !== "" && (
              <div className="min-w-0">
                <strong className="text-[#f3f4f8]">Explanation:</strong>
                <pre className="mt-1 whitespace-pre-wrap break-words text-[#c6cbd8]">
                  {formatValue(item.explanation)}
                </pre>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Sample;
