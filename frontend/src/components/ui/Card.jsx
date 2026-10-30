// frontend/src/components/ui/Card.jsx

// A white panel with a thin border. Most of each page sits inside one.
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`}>{children}</div>
);

// Optional title row for the top of a Card, with room for a link or button on the right
export const CardHeader = ({ title, description, action }) => (
  <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
    <div className="min-w-0">
      <h2 className="font-semibold text-ink">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
    </div>
    {action}
  </div>
);

export default Card;
