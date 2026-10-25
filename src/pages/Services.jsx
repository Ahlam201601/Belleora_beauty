
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const API_URL = "https://6add4e07fa5e73d4ab2defa5.mockapi.io/api/v1/services";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Impossible de charger les services.");
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="bg-[#fffaf8] min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
            Our Services
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#3d2930] mb-5">
            Beauty & Wellness
          </h1>

          <p className="text-gray-600 leading-7">
            Discover our beauty and wellness treatments, designed to help you
            relax, refresh, and feel your best.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-600">Loading services...</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-600">{error}</p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="text-center text-gray-600">
            No services available yet.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <article
                key={service.id ?? service.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={service.image}
                  alt={service.alt || service.title}
                  loading="lazy"
                  className="w-full h-64 object-cover"
                />

                <div className="p-6">
                  <h2 className="text-2xl font-serif text-[#3d2930] mb-3">
                    {service.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-6 mb-5">
                    {service.description}
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
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Services;
