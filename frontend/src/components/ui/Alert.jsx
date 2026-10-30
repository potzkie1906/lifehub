// frontend/src/components/ui/Alert.jsx
import { CircleAlert } from "lucide-react";

// A red message box for errors. role="alert" makes screen readers announce it.
const Alert = ({ className = "", children }) => (
  <div
    role="alert"
    className={`flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}
  >
    <CircleAlert size={18} className="mt-px shrink-0" />
    <p>{children}</p>
  </div>
);

export default Alert;
