// frontend/src/components/ui/SegmentedControl.jsx

// A row of toggle buttons for filtering a list:   To do 3 | Done 2 | All 5
//   options:  [{ value: "pending", label: "To do", count: 3 }, ...]
//   value:    which option is selected
//   onChange: called with the option's value when it's clicked
const SegmentedControl = ({ options, value, onChange }) => (
  <div className="inline-flex rounded-xl border border-line bg-white p-1 shadow-card">
    {options.map((option) => {
      const active = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          aria-pressed={active}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            active ? "bg-ink text-white" : "text-slate-600 hover:text-ink"
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span
              className={`rounded-md px-1.5 text-xs tabular-nums ${
                active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {option.count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default SegmentedControl;
