// frontend/src/components/ui/CompleteToggle.jsx
import { Check } from "lucide-react";

// The round "done" button on assignments and tasks.
// role="checkbox" + aria-checked tell screen readers it works like a checkbox.
const CompleteToggle = ({ checked, onToggle, label }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={onToggle}
    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors ${
      checked
        ? "border-emerald-500 bg-emerald-500 text-white"
        : "border-slate-300 bg-white text-transparent hover:border-brand"
    }`}
  >
    <Check size={14} strokeWidth={3} />
  </button>
);

export default CompleteToggle;
