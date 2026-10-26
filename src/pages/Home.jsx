
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Heart,
  Flower2,
} from "lucide-react";
import homeImage from "../assets/images/Home.png";
import { supabase } from "../utils/supabase";

const SERVICES_API =
  "https://6add4e07fa5e73d4ab2defa5.mockapi.io/api/v1/services";

const GALLERY_API =
  "https://6add4e07fa5e73d4ab2defa5.mockapi.io/api/v1/Gallery";

function Home() {
  const [services, setServices] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);

  // Test Supabase connection
  useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase
        .from("bookings")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Supabase error:", error.message);
      } else {
        console.log("Supabase connection successful!");
      }
    };

    testConnection();
  }, []);

  // Fetch services and gallery
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(SERVICES_API);
        if (!response.ok) {
          throw new Error("Failed to load services");
        }

        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Services error:", error);
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchGallery = async () => {
      try {
        const response = await fetch(GALLERY_API);
        if (!response.ok) {
          throw new Error("Failed to load gallery");
        }

        const data = await response.json();
        setGalleryImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gallery error:", error);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchServices();
    fetchGallery();
  }, []);

  return (
    <main className="bg-[#fffaf8]">
      {/* Hero */}
      <section className="relative min-h-[85vh] lg:min-h-[calc(100vh-80px)] flex items-center px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${homeImage})` }}
        />

        <div className="absolute inset-0 bg-[#fffaf8]/35" />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">
            <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-5">
              Welcome to Belleora Beauty
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#3d2930] leading-tight mb-6">
              Discover Your Natural Beauty
            </h1>

            <p className="max-w-lg text-gray-700 text-sm sm:text-base lg:text-lg leading-7 lg:leading-8 mb-8">
              Relax, refresh, and feel beautiful with our personalized beauty
              treatments.
            </p>

            <Link
              to="/booking"
              className="inline-flex items-center gap-3 bg-[#89505f] text-white px-7 py-3.5 rounded-full hover:bg-[#70404d] transition duration-300"
            >
              Book Appointment
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div>
              <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-3">
                What We Offer
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2930]">
                Our Featured Services
              </h2>

              <p className="text-gray-600 mt-4 leading-7 max-w-xl">
                Discover our favorite treatments, created to help you relax and
                feel your best.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all shrink-0"
            >
              View All Services <ArrowRight size={18} />
            </Link>
          </div>

          {servicesLoading ? (
            <p className="text-center text-gray-500 py-10">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Services are temporarily unavailable.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.slice(0, 3).map((service) => (
                <article
                  key={service.id ?? service.title}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.alt || service.title}
                      loading="lazy"
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-serif text-[#3d2930] mb-3">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-6 mb-5">
                      {service.description}
                    </p>

                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all"
                    >
                      Book Now <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#f3e8e8] py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-3">
              The Belleora Experience
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2930]">
              A Little Time Just for You
            </h2>

            <p className="text-gray-600 mt-4 leading-7">
              Take a break from your busy day and enjoy a moment dedicated to
              your beauty and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f3e8e8] text-[#89505f] flex items-center justify-center mx-auto mb-5">
                <Sparkles size={26} strokeWidth={1.6} />
              </div>

              <h3 className="text-xl font-serif text-[#3d2930] mb-3">
                Personalized Care
              </h3>

              <p className="text-gray-600 text-sm leading-6">
                Beauty treatments selected around your needs and preferences.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f3e8e8] text-[#89505f] flex items-center justify-center mx-auto mb-5">
                <Heart size={26} strokeWidth={1.6} />
              </div>

              <h3 className="text-xl font-serif text-[#3d2930] mb-3">
                Relaxing Moments
              </h3>

              <p className="text-gray-600 text-sm leading-6">
                A welcoming atmosphere where you can pause, relax, and recharge.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-[#f3e8e8] text-[#89505f] flex items-center justify-center mx-auto mb-5">
                <Flower2 size={26} strokeWidth={1.6} />
              </div>

              <h3 className="text-xl font-serif text-[#3d2930] mb-3">
                Beauty in Every Detail
              </h3>

              <p className="text-gray-600 text-sm leading-6">
                Thoughtfully selected treatments for a special self-care
                experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div>
              <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-3">
                A Glimpse of Belleora
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2930]">
                Our Beauty Gallery
              </h2>

              <p className="text-gray-600 mt-4 leading-7 max-w-xl">
                Explore the details, atmosphere, and beauty behind every visit.
              </p>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-[#89505f] font-medium hover:gap-3 transition-all shrink-0"
            >
              View All Gallery <ArrowRight size={18} />
            </Link>
          </div>

          {galleryLoading ? (
            <p className="text-center text-gray-500 py-10">
              Loading gallery...
            </p>
          ) : galleryImages.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Gallery images are temporarily unavailable.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.slice(0, 3).map((image, index) => (
                <Link
                  to="/gallery"
                  key={image.id ?? image.title}
                  className={`group relative block overflow-hidden rounded-2xl ${
                    index === 1 ? "lg:mt-8" : ""
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-72 sm:h-80 object-cover group-hover:scale-110 transition duration-500"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-[#3d2930]/80 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-white/80 text-xs uppercase tracking-[2px] mb-2">
                      {image.category}
                    </p>

                    <h3 className="text-white text-xl font-serif">
                      {image.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beauty Philosophy */}
      <section className="px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-24 sm:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p className="text-[#89505f] text-xs sm:text-sm uppercase tracking-[3px] mb-5">
              The Belleora Philosophy
            </p>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#3d2930] leading-tight mb-6">
              Your Beauty,
              <span className="block text-[#89505f] italic mt-2">
                Our Passion.
              </span>
            </h2>

            <p className="text-gray-600 leading-8 mb-5 max-w-lg">
              At Belleora Beauty, we believe that every woman deserves to feel
              beautiful, confident, and cared for.
            </p>

            <p className="text-gray-600 leading-8 mb-8 max-w-lg">
              From the little details to every treatment, our goal is to make
              each visit a relaxing and special experience just for you.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-3 bg-[#89505f] text-white px-7 py-3.5 rounded-full hover:bg-[#70404d] transition-all duration-300 mb-4"
            >
              Discover Our Story
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85"
                alt="A peaceful spa and wellness experience"
                loading="lazy"
                className="w-full h-75 sm:h-100 lg:h-115 object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white shadow-md rounded-xl px-5 py-4">
              <p className="font-serif text-lg text-[#3d2930]">
                Feel Beautiful
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Take a moment for yourself
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
