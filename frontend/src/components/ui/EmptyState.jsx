// frontend/src/components/ui/EmptyState.jsx

// What a list shows when there's nothing in it yet. It should tell people
// what to do next, so a new account never looks broken.
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center px-6 py-12 text-center">
    <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-brand-soft text-brand">
      <Icon size={22} />
    </div>
    <p className="font-semibold text-ink">{title}</p>
    {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
