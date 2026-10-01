

const formatValue = (value) => String(value ?? "").replace(/\\n/g, "\n");

const Sample = ({ samples = [] }) => {
  if (!samples.length) {
    return <p className="text-[#FFFF99] font-play">No sample test cases available.</p>;
  }

  return (
    <div className="space-y-5">
      {samples.map((item, index) => (
        <section
          key={item.id ?? index}
          className="rounded-lg border border-[#c29673] bg-[#1a1625]/80 p-4 font-play"
        >
          <h3 className="mb-3 text-base font-semibold text-[#FFE7A3]">
            Sample {index + 1}
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-md bg-[#0C091F]/80 p-4">
              <strong className="text-lg text-[#CAFF33]">Input</strong>
              <pre className="mt-2 whitespace-pre-wrap break-words text-[#FFFF99]">
                {formatValue(item.input)}
              </pre>
            </div>

            <div className="min-w-0 rounded-md bg-[#0C091F]/80 p-4">
              <strong className="text-lg text-[#FF5733]">Output</strong>
              <pre className="mt-2 whitespace-pre-wrap break-words text-[#FFFF99]">
                {formatValue(item.output)}
              </pre>
            </div>

            {item.explanation != null && item.explanation !== "" && (
              <div className="sm:col-span-2 rounded-md bg-[#0C091F]/80 p-4">
                <strong className="text-lg text-[#FFE7A3]">Explanation</strong>
                <pre className="mt-2 whitespace-pre-wrap break-words text-[#FFFF99]">
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
