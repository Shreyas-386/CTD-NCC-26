// Gold "// NCC //" wordmark used on the Login and Leaderboard pages.
const Slashes = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 34 34" aria-hidden="true">
    <line x1="4" y1="30" x2="20" y2="6" stroke="#3a4a72" strokeWidth="3" strokeLinecap="round" />
    <line x1="13" y1="30" x2="29" y2="6" stroke="#e8b57d" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const NccLogo = ({ size = "md" }) => {
  const text = size === "lg" ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl";
  const slash = size === "lg" ? "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" : "w-6 h-6 sm:w-7 sm:h-7";

  return (
    <div className="shrink-0 flex items-center gap-1 select-none">
      <Slashes className={slash} />
      <span className={`font-orbitron font-black tracking-wide ncc-gold-text ${text}`}>NCC</span>
      <Slashes className={slash} />
    </div>
  );
};

export { Slashes };
export default NccLogo;
