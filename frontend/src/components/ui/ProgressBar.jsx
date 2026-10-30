// frontend/src/components/ui/ProgressBar.jsx

// A thin bar filled to value / max, capped at 100% so it never overflows.
// It's decoration next to real numbers, so screen readers skip it (aria-hidden).
const ProgressBar = ({ value, max, barClassName = "bg-brand", className = "" }) => {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200/70 ${className}`} aria-hidden="true">
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${barClassName}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
