
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { supabase } from "../../utils/supabase";
import logo from "../../assets/images/logo.png";

const links = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Calendar", path: "/admin/calendar", icon: CalendarDays },
  { label: "Appointments", path: "/admin/appointments", icon: CalendarCheck },
  { label: "Clients", path: "/admin/clients", icon: Users },
];

export default function AdminSidebar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      if (onLogout) {
        await onLogout();
      } else {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        navigate("/admin/login", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

  const navigationLinks = (
    <nav className="flex flex-col gap-2">
      {links.map(({ label, path, icon: Icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          onClick={() => setMenuOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              isActive
                ? "bg-[#89505f] text-white"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Icon size={19} className="shrink-0" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );

  const logoutButton = (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      <LogOut size={19} className="shrink-0" />
      <span>{loggingOut ? "Signing out..." : "Log Out"}</span>
    </button>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#38232c] text-white md:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <img
            src={logo}
            alt="Belleora Beauty"
            className="h-10 w-10 shrink-0 rounded-xl bg-white object-contain p-1"
          />

          <div>
            <h2 className="text-lg font-semibold">Belleora</h2>
            <p className="text-xs text-gray-300">Beauty Admin</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          <p className="mb-3 px-4 text-xs uppercase tracking-widest text-gray-400">
            Menu
          </p>

          {navigationLinks}
        </div>

        {/* Logout at the bottom */}
        <div className="shrink-0 border-t border-white/10 p-5">
          {logoutButton}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-[#38232c] px-4 py-3 text-white shadow-md md:hidden">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Belleora Beauty"
            className="h-9 w-9 rounded-lg bg-white object-contain p-1"
          />

          <div>
            <h2 className="text-base font-semibold">Belleora</h2>
            <p className="text-xs text-gray-300">Beauty Admin</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-64px)] overflow-y-auto bg-[#38232c] px-4 pb-5 pt-4 text-white shadow-xl md:hidden">
          <p className="mb-3 px-4 text-xs uppercase tracking-widest text-gray-400">
            Menu
          </p>

          {navigationLinks}

          <div className="mt-5 border-t border-white/10 pt-4">
            {logoutButton}
          </div>
        </div>
      )}
    </>
  );
}
