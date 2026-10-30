// frontend/src/components/ui/Input.jsx
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// A text field with an optional label above it.
//   icon   - a lucide icon shown inside the field on the left
//   prefix - short text shown there instead, like "₱"
// Any other prop (value, onChange, placeholder, required...) goes straight to the <input>.
// For type="password" it adds a show/hide button automatically.
const Input = ({ label, icon: Icon, prefix, type = "text", id, className = "", ...props }) => {
  const autoId = useId(); // links the <label> to the <input> so clicking the label focuses it
  const inputId = id || autoId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  let paddingLeft = "pl-3.5";
  if (Icon) paddingLeft = "pl-10";
  else if (prefix) paddingLeft = "pl-8";

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            {prefix}
          </span>
        )}

        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`h-11 w-full rounded-xl border border-line bg-white text-sm text-ink transition placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 ${paddingLeft} ${isPassword ? "pr-11" : "pr-3.5"}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:text-ink"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
