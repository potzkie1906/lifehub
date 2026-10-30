// frontend/src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { BookOpen, ClipboardList, LayoutDashboard, ListChecks, LogOut, Wallet, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { initials } from "../utils/format";
import Logo from "./Logo";

// The links, grouped the way LifeHub splits a student's life: school and personal
const NAV_GROUPS = [
  { title: null, links: [{ to: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
  {
    title: "School",
    links: [
      { to: "/subjects", label: "Subjects", icon: BookOpen },
      { to: "/assignments", label: "Assignments", icon: ClipboardList },
    ],
  },
  {
    title: "Personal",
    links: [
      { to: "/tasks", label: "Tasks", icon: ListChecks },
      { to: "/expenses", label: "Expenses", icon: Wallet },
    ],
  },
];

// NavLink calls this with { isActive } so the current page can look different
const linkClass = ({ isActive }) =>
  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-highlight ${
    isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;

// On desktop the sidebar is always showing. On phones it slides in from the left:
// `open` says whether it's out, and `onClose` puts it away again.
const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Dark layer behind the menu on phones. Tapping it closes the menu. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink transition-[transform,visibility] duration-200 lg:visible lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.title || "main"}>
              {group.title && <p className="mb-2 px-3 text-xs font-semibold text-slate-400">{group.title}</p>}
              <div className="space-y-1">
                {group.links.map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} onClick={onClose} className={linkClass}>
                    {({ isActive }) => (
                      <>
                        {/* the highlighter mark beside the page you're on */}
                        {isActive && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-highlight" />}
                        <Icon
                          size={18}
                          strokeWidth={1.9}
                          className={isActive ? "text-highlight" : "text-slate-400 group-hover:text-slate-200"}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
