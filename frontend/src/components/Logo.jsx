// frontend/src/components/Logo.jsx

// LifeHub's mark: a tiny sheet of pad paper (blue ruled lines, red margin line).
// tone="light" is for dark backgrounds like the sidebar, tone="dark" for white ones.
const Logo = ({ tone = "light", className = "" }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" rx="8" fill="#FDFDFB" stroke="#DCE3EE" />
      <path d="M5 12h22M5 17h22M5 22h22" stroke="#9DB6EC" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10.5 5v22" stroke="#D6383E" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span className={`text-lg font-extrabold tracking-tight ${tone === "light" ? "text-white" : "text-ink"}`}>
      LifeHub
    </span>
  </div>
);

export default Logo;
