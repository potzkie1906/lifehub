// frontend/src/components/AppLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

// The frame around every logged-in page: the sidebar plus the page itself.
// <Outlet /> is the spot where React Router draws whichever page matches the URL.
const AppLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-w-0 flex-1">
        {/* Top bar with a menu button, only on phones and small tablets */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
          <Logo tone="dark" />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-ink hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
