
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-[#794351] text-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-serif text-[#f3dce1] mb-4">
              Belleora Beauty
            </h2>

            <p className="text-sm text-white/70 leading-7 max-w-xs">
              Discover your natural beauty and enjoy a relaxing beauty experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>

            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <Link to="/" className="hover:text-[#f3dce1] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#f3dce1] transition">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#f3dce1] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#f3dce1] transition">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-[#f3dce1] transition">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>

            <ul className="space-y-3 text-sm text-white/70">
              <li>Phone: +212 600 000 000</li>
              <li>Email: contact@belleorabeauty.com</li>
              <li>Location: Casablanca, Morocco</li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-medium mb-4">Opening Hours</h3>

            <ul className="space-y-3 text-sm text-white/70">
              <li>Monday - Friday</li>
              <li>09:00 AM - 07:00 PM</li>
              <li>Saturday - Sunday</li>
              <li>10:00 AM - 10:00 PM</li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/15 mt-10 pt-6 text-center">
          <p className="text-xs sm:text-sm text-white/60">
            © {new Date().getFullYear()} Belleora Beauty. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
