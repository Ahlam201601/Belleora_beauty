
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  CalendarDays,
  Menu,
  X,
  ArrowRight,
  UserPlus,
  LogIn,
  UserRound,
  LogOut,
} from "lucide-react";

import logo from "./../assets/images/logo.png";
import { supabase } from "../utils/supabase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setClientName(
        data.session?.user?.user_metadata?.full_name ||
        data.session?.user?.email?.split("@")[0] ||
        ""
      );
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setClientName(
        newSession?.user?.user_metadata?.full_name ||
        newSession?.user?.email?.split("@")[0] ||
        ""
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setMenuOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ];

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive
        ? "text-[#89505f]"
        : "text-gray-600 hover:text-[#89505f]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Belleora Beauty"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-[#fff7f7] px-3 py-2 text-sm text-[#89505f]">
                <UserRound size={17} />
                <span className="max-w-32 truncate font-medium">
                  {clientName}
                </span>
              </div>

              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-[#89505f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70404d]"
              >
                <CalendarDays size={16} />
                Book Appointment
                <ArrowRight size={15} />
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#89505f]"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/client/register"
                className="inline-flex items-center gap-2 rounded-full border border-[#89505f] px-4 py-2.5 text-sm font-medium text-[#89505f] transition hover:bg-[#89505f] hover:text-white"
              >
                <UserPlus size={16} />
                Sign Up
              </Link>

              <Link
                to="/client/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#89505f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70404d]"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-[#89505f] md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={() => setMenuOpen(false)}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="border-t border-gray-100 pt-4">
              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#89505f]">
                    <UserRound size={18} />
                    <span>{clientName}</span>
                  </div>

                  <Link
                    to="/booking"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#89505f] px-4 py-3 text-sm font-medium text-white"
                  >
                    <CalendarDays size={17} />
                    Book Appointment
                    <ArrowRight size={15} />
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/client/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full border border-[#89505f] px-4 py-3 text-sm font-medium text-[#89505f]"
                  >
                    <UserPlus size={17} />
                    Sign Up
                  </Link>

                  <Link
                    to="/client/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#89505f] px-4 py-3 text-sm font-medium text-white"
                  >
                    <LogIn size={17} />
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
