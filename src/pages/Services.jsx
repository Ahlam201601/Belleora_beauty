
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "../utils/supabase";

const API_URL =
  "https://6add4e07fa5e73d4ab2defa5.mockapi.io/api/v1/services";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
        setError(err.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBooking = async (service) => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!data.session) {
        navigate("/client/login");
        return;
      }

      // Keep the selected service for the booking page.
      navigate("/booking", {
        state: { service },
      });
    } catch (err) {
      console.error("Authentication check failed:", err);
      navigate("/client/login");
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[3px] text-[#89505f]">
            Our Services
          </p>

          <h1 className="mb-5 font-serif text-4xl text-[#3d2930] sm:text-5xl">
            Beauty &amp; Wellness
          </h1>

          <p className="leading-7 text-gray-600">
            Discover our beauty and wellness treatments, designed to help you
            relax, refresh, and feel your best.
          </p>
        </div>

        {loading && (
          <p className="text-center text-gray-600">
            Loading services...
          </p>
        )}

        {!loading && error && (
          <p role="alert" className="text-center text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="text-center text-gray-600">
            No services available yet.
          </p>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id ?? service.title}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={service.image}
                  alt={service.alt || service.title}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <h2 className="mb-3 font-serif text-2xl text-[#3d2930]">
                    {service.title}
                  </h2>

                  <p className="mb-5 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleBooking(service)}
                    className="inline-flex items-center gap-2 font-medium text-[#89505f] transition-all duration-300 hover:gap-3"
                  >
                    Book Now
                    <ArrowRight size={18} strokeWidth={1.8} />
                  </button>
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
