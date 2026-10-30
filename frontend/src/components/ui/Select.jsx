// frontend/src/components/ui/Select.jsx
import { useId } from "react";
import { ChevronDown } from "lucide-react";

// A dropdown styled to match <Input>. Put <option> elements inside it, like a normal <select>.
const Select = ({ label, id, className = "", children, ...props }) => {
  const autoId = useId();
  const selectId = id || autoId;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* appearance-none hides the browser's own arrow so ours can sit in its place */}
        <select
          id={selectId}
          className="h-11 w-full appearance-none rounded-xl border border-line bg-white pl-3.5 pr-10 text-sm text-ink transition focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
};

export default Select;
