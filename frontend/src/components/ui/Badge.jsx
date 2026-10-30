// frontend/src/components/ui/Badge.jsx

const TONES = {
  gray: "bg-slate-100 text-slate-600",
  blue: "bg-brand-soft text-brand",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  green: "bg-emerald-50 text-emerald-700",
};

// A small rounded label:  <Badge tone="red">2 days overdue</Badge>
const Badge = ({ tone = "gray", className = "", children }) => (
  <span
    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone] || ""} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
