import { NavLink, useNavigate } from "react-router-dom";
import {LayoutDashboard, BookOpen, ClipboardList, CheckSquare, Wallet, LogOut} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subjects", label: "Subjects", icon: BookOpen },
  { to: "/assignments", label: "Assignments", icon: ClipboardList },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/expenses", label: "Expenses", icon: Wallet },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 shrink-0 bg-ink-900 min-h-screen flex flex-col">
      <div className="px-6 py-6">
        <span className="font-serif text-2xl text-white">LifeHub</span>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-ink-700 text-white border-l-2 border-accent"
                  : "text-slate-300 hover:bg-ink-700 hover:text-white"
              }`
            }
          >
            <Icon size={18} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 text-sm text-slate-300 truncate">{user.name}</div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-ink-700 hover:text-white transition-colors"
        >
          <LogOut size={18} strokeWidth={1.75} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 