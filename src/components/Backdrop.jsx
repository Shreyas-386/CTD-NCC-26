// Decorative page background for the NCC theme.
// tone="navy"  -> deep blue with gold-edged waves (Login, Leaderboard)
// tone="dusk"  -> charcoal with purple / peach blobs (all other pages)

export const DotGrid = ({ rows = 5, cols = 5, gap = 14, className = "", color = "#e8b57d" }) => (
  <svg
    className={className}
    width={(cols - 1) * gap + 6}
    height={(rows - 1) * gap + 6}
    aria-hidden="true"
  >
    {Array.from({ length: rows }).map((_, r) =>
      Array.from({ length: cols }).map((_, c) => (
        <circle
          key={`${r}-${c}`}
          cx={c * gap + 3}
          cy={r * gap + 3}
          r="1.8"
          fill={color}
          opacity={0.85 - c * 0.08}
        />
      ))
    )}
  </svg>
);

const NavyBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#13213f_0%,#0b1730_45%,#081225_100%)]" />

    {/* top-right wave */}
    <svg className="absolute -top-10 right-0 w-[70%] max-w-[900px]" viewBox="0 0 900 260" preserveAspectRatio="none">
      <defs>
        <linearGradient id="nv-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d2a4d" />
          <stop offset="100%" stopColor="#24325a" />
        </linearGradient>
        <linearGradient id="nv-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8b57d" stopOpacity="0" />
          <stop offset="50%" stopColor="#e8b57d" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f4cc9a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M0 0 H900 V230 C820 260 760 160 660 150 C540 140 520 60 400 50 C280 40 220 20 160 0 Z" fill="url(#nv-top)" opacity="0.85" />
      <path d="M250 30 C380 50 460 120 600 140 C720 160 800 220 900 200" fill="none" stroke="url(#nv-gold)" strokeWidth="2" />
    </svg>

    {/* bottom-left waves */}
    <svg className="absolute bottom-0 left-0 w-[65%] max-w-[820px]" viewBox="0 0 820 300" preserveAspectRatio="none">
      <defs>
        <linearGradient id="nv-bl" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9935e" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#3a3a52" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1b2645" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path d="M0 80 C140 60 220 160 360 170 C500 180 600 240 820 300 H0 Z" fill="url(#nv-bl)" opacity="0.55" />
      <path d="M0 150 C160 130 260 220 420 230 C560 240 640 280 760 300 H0 Z" fill="#1a2444" opacity="0.95" />
      <path d="M0 78 C140 58 220 158 360 168 C500 178 600 238 820 298" fill="none" stroke="#e8b57d" strokeOpacity="0.7" strokeWidth="1.5" />
    </svg>

    {/* bottom-right wave */}
    <svg className="absolute bottom-0 right-0 w-[45%] max-w-[560px]" viewBox="0 0 560 220" preserveAspectRatio="none">
      <defs>
        <linearGradient id="nv-br" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#1b2645" />
          <stop offset="100%" stopColor="#c9935e" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path d="M0 220 C140 200 260 150 360 100 C440 60 500 40 560 30 V220 Z" fill="url(#nv-br)" opacity="0.8" />
      <path d="M0 220 C140 200 260 150 360 100 C440 60 500 40 560 30" fill="none" stroke="#f4cc9a" strokeOpacity="0.8" strokeWidth="1.5" />
    </svg>

    <DotGrid rows={4} cols={6} gap={16} className="absolute top-[13%] right-[3%] opacity-90" />
    <DotGrid rows={4} cols={6} gap={16} className="absolute bottom-[6%] left-[2%] opacity-90" />
  </div>
);

const DuskBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#171b28_0%,#10131d_55%,#0c0f17_100%)]" />

    {/* left blobs */}
    <svg className="absolute top-[12%] left-0 h-[88%] w-[34%] max-w-[420px]" viewBox="0 0 400 800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dk-l1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2540" />
          <stop offset="100%" stopColor="#1a1a2c" />
        </linearGradient>
        <linearGradient id="dk-l2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6f4a73" />
          <stop offset="100%" stopColor="#3a2c4f" />
        </linearGradient>
        <radialGradient id="dk-peach" cx="0.1" cy="1" r="0.9">
          <stop offset="0%" stopColor="#f2c693" />
          <stop offset="55%" stopColor="#b98767" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a3e57" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M0 0 C120 20 160 120 120 240 C80 360 160 420 140 520 C120 620 60 680 0 700 Z" fill="url(#dk-l1)" opacity="0.9" />
      <path d="M0 360 C110 380 170 460 200 560 C230 660 300 740 360 800 H0 Z" fill="url(#dk-l2)" opacity="0.75" />
      <path d="M0 560 C90 560 160 640 200 800 H0 Z" fill="url(#dk-peach)" />
    </svg>

    {/* top-right blob */}
    <svg className="absolute top-0 right-0 w-[26%] max-w-[320px]" viewBox="0 0 300 260" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dk-tr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b2d4a" />
          <stop offset="100%" stopColor="#6c4766" />
        </linearGradient>
      </defs>
      <path d="M60 0 H300 V240 C240 260 200 200 170 160 C140 120 80 110 60 60 Z" fill="url(#dk-tr)" opacity="0.8" />
    </svg>

    {/* bottom-right blob */}
    <svg className="absolute bottom-0 right-0 w-[28%] max-w-[360px]" viewBox="0 0 340 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dk-br" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#3a2c4f" />
          <stop offset="100%" stopColor="#a9737e" />
        </linearGradient>
      </defs>
      <path d="M0 200 C80 180 140 120 200 80 C260 40 300 30 340 30 V200 Z" fill="url(#dk-br)" opacity="0.75" />
    </svg>

    <DotGrid rows={5} cols={4} gap={15} className="absolute top-[26%] left-[4%]" />
    <DotGrid rows={6} cols={5} gap={15} className="absolute bottom-[18%] right-[3%] opacity-80" />
  </div>
);

const Backdrop = ({ tone = "dusk" }) =>
  tone === "navy" ? <NavyBackdrop /> : <DuskBackdrop />;

export default Backdrop;
