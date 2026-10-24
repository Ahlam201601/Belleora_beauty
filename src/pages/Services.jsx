
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Facial Treatment",
    description:
      "Refresh your skin with a relaxing facial tailored to your skincare needs.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    alt: "Facial skincare treatment",
  },
  {
    title: "Hair Styling",
    description:
      "Discover beautiful hairstyles and hair care for every occasion.",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
    alt: "Professional hair styling",
  },
  {
    title: "Manicure & Nails",
    description:
      "Complete your look with elegant manicures and beautiful nail care.",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=800&q=80",
    alt: "Manicure and nail care",
  },
  {
    title: "Relaxing Spa",
    description:
      "Escape your daily routine and enjoy a peaceful moment of relaxation.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxing spa experience",
  },
  {
    title: "Massage Therapy",
    description:
      "Unwind in a calming atmosphere with a relaxing full-body massage.",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxing massage treatment",
  },
  {
    title: "Hammam & Shower",
    description:
      "Enjoy a refreshing bathing experience with cleansing and body care.",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80",
    alt: "Relaxing bath and shower",
  },
];

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
            Discover our beauty and wellness treatments, designed to help you
            relax, refresh, and feel your best.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <article
              key={service.title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <img
                src={service.image}
                alt={service.alt}
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
      </div>
    </main>
  );
}

export default Services;
