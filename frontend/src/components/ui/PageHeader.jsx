// frontend/src/components/ui/PageHeader.jsx

// The title block at the top of a page. Anything you put between the tags
// (buttons, a progress bar...) shows up on the right.
const PageHeader = ({ title, description, children }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-slate-600">{description}</p>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
  </div>
);

export default PageHeader;
