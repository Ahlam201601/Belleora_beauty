
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const links = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Calendar", path: "/admin/calendar", icon: CalendarDays },
  { label: "Appointments", path: "/admin/appointments", icon: CalendarCheck },
  { label: "Clients", path: "/admin/clients", icon: Users },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

function AdminSidebar({ onLogout }) {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-[#38232c] px-5 py-6 text-white">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#89505f]">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold">Belleora</h2>
          <p className="text-xs text-gray-300">Beauty Admin</p>
        </div>
      </div>

      <p className="mb-3 text-xs uppercase tracking-widest text-gray-400">
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        {links.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-[#89505f] text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-5">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={19} />
          Log Out
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
