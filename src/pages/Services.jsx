import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Services() {
  return (
    <main className="bg-[#fffaf8] min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
            Our Services
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#3d2930] mb-5">
            Beauty & Wellness
          </h1>

          <p className="text-gray-600 leading-7">
            Discover our beauty treatments, designed to help you relax, refresh,
            and feel your best.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
              alt="Facial treatment"
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#3d2930] mb-3">
                Facial Treatment
              </h2>

              <p className="text-gray-600 text-sm leading-6 mb-5">
                Refresh your skin with a relaxing facial treatment tailored to
                your skincare needs.
              </p>

              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all duration-300"
              >
                Book Now
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          </article>

          {/* Service 2 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80"
              alt="Hair styling"
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#3d2930] mb-3">
                Hair Styling
              </h2>

              <p className="text-gray-600 text-sm leading-6 mb-5">
                Give your hair a beautiful look with our styling and hair care
                services.
              </p>

              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all duration-300"
              >
                Book Now
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          </article>

          {/* Service 3 */}
          <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300">
            <img
              src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=80"
              alt="Manicure treatment"
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#3d2930] mb-3">
                Manicure & Nails
              </h2>

              <p className="text-gray-600 text-sm leading-6 mb-5">
                Complete your look with elegant nail care and manicure
                treatments.
              </p>

              <Link
                to="/booking"
                className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all duration-300"
              >
                Book Now
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

export default Services;
