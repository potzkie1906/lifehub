// frontend/src/components/ui/Skeleton.jsx

// A gray pulsing block that holds the place of content while it loads.
// Give it a size with className, e.g. <Skeleton className="h-40" />
const Skeleton = ({ className = "" }) => <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;

// A few placeholder list rows, for lists that are still loading
export const SkeletonRows = ({ rows = 4 }) => (
  <div className="divide-y divide-line" aria-label="Loading" role="status">
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="flex items-center gap-4 px-5 py-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
