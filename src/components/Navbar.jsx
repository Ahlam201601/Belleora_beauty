
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../assets/images/logo.png";
import {
  CalendarDays,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadde0] bg-[#fffaf8]/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex min-h-19 max-w-[1600px] items-center justify-between gap-4 px-5 py-2 md:px-10 lg:px-14">

        {/* Logo + Brand Name */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src={logo}
            alt="Belleora Beauty Studio"
            className="h-14 w-auto object-contain sm:h-16"
          />

          <div className="flex flex-col">
            <h1 className="font-serif text-xl font-semibold tracking-tight text-[#89505f] sm:text-2xl">
              Belleora
            </h1>

            <span className="mt-0.5 text-[8px] tracking-[0.2em] text-[#89505f] sm:text-[9px]">
              BEAUTY STUDIO
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative py-2 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#89505f] after:transition-all after:duration-300 ${
                isActive
                  ? "font-semibold text-[#89505f] after:w-full"
                  : "text-[#493b3e] after:w-0 hover:text-[#89505f]"
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/services"
            className={({ isActive }) =>
              `relative py-2 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#89505f] after:transition-all after:duration-300 ${
                isActive
                  ? "font-semibold text-[#89505f] after:w-full"
                  : "text-[#493b3e] after:w-0 hover:text-[#89505f]"
              }`
            }
          >
            Services
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative py-2 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#89505f] after:transition-all after:duration-300 ${
                isActive
                  ? "font-semibold text-[#89505f] after:w-full"
                  : "text-[#493b3e] after:w-0 hover:text-[#89505f]"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `relative py-2 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#89505f] after:transition-all after:duration-300 ${
                isActive
                  ? "font-semibold text-[#89505f] after:w-full"
                  : "text-[#493b3e] after:w-0 hover:text-[#89505f]"
              }`
            }
          >
            Gallery
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `relative py-2 text-sm transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#89505f] after:transition-all after:duration-300 ${
                isActive
                  ? "font-semibold text-[#89505f] after:w-full"
                  : "text-[#493b3e] after:w-0 hover:text-[#89505f]"
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Desktop Booking Button */}
        <Link
          to="/booking"
          className="hidden items-center gap-2 rounded-full bg-[#89505f] px-4 py-3 text-sm font-medium text-white shadow-md shadow-[#89505f]/20 transition hover:-translate-y-0.5 hover:bg-[#75414f] hover:shadow-lg md:flex"
        >
          <CalendarDays size={16} />
          <span>Book Appointment</span>
          <ArrowRight size={15} />
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3cdd2] text-[#89505f] transition hover:bg-[#f3e7e9] lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-[#eadde0] bg-[#fffaf8] px-5 py-4 text-[#49313a] shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">

            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#f3e7e9] font-semibold text-[#89505f]"
                    : "text-[#493b3e] hover:bg-[#f8eeec] hover:text-[#89505f]"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/services"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#f3e7e9] font-semibold text-[#89505f]"
                    : "text-[#493b3e] hover:bg-[#f8eeec] hover:text-[#89505f]"
                }`
              }
            >
              Services
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#f3e7e9] font-semibold text-[#89505f]"
                    : "text-[#493b3e] hover:bg-[#f8eeec] hover:text-[#89505f]"
                }`
              }
            >
              About
            </NavLink>

            <NavLink
              to="/gallery"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#f3e7e9] font-semibold text-[#89505f]"
                    : "text-[#493b3e] hover:bg-[#f8eeec] hover:text-[#89505f]"
                }`
              }
            >
              Gallery
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[#f3e7e9] font-semibold text-[#89505f]"
                    : "text-[#493b3e] hover:bg-[#f8eeec] hover:text-[#89505f]"
                }`
              }
            >
              Contact
            </NavLink>

            <Link
              to="/booking"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-[#89505f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#75414f]"
            >
              <CalendarDays size={17} />
              Book Appointment
              <ArrowRight size={15} />
            </Link>

          </div>
        </div>
      )}
    </header>
  );
}
