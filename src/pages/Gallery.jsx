
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";

const GALLERY_API =
  "https://6add4e07fa5e73d4ab2defa5.mockapi.io/api/v1/Gallery";

function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(GALLERY_API);

        if (!response.ok) {
          throw new Error("Unable to load gallery images.");
        }

        const data = await response.json();
        setGalleryImages(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  return (
    <main className="min-h-screen bg-[#fffaf8] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
            Our Beauty World
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3d2930] mb-5">
            Our Gallery
          </h1>

          <p className="text-gray-600 leading-7">
            Explore our beauty space, treatments, and little details that
            make every visit to Belleora special.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-600 py-12">
            Loading gallery...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-red-600 py-12">{error}</p>
        )}

        {/* Empty State */}
        {!loading && !error && galleryImages.length === 0 && (
          <p className="text-center text-gray-600 py-12">
            No gallery images available yet.
          </p>
        )}

        {/* Gallery Grid */}
        {!loading && !error && galleryImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <button
                key={image.id ?? image.title}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`View ${image.title}`}
                className={`group relative overflow-hidden rounded-2xl text-left ${
                  index === 1 ? "lg:mt-8" : ""
                } ${index === 4 ? "lg:-mt-8" : ""}`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  loading="lazy"
                  className="w-full h-72 sm:h-80 object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#3d2930]/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition duration-300" />

                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white/80 text-xs uppercase tracking-[2px] mb-2">
                    {image.category}
                  </p>
                  <h2 className="text-white text-xl font-serif">
                    {image.title}
                  </h2>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-5"
            onClick={() => setSelectedImage(null)}
          >
            <button
              type="button"
              aria-label="Close image"
              onClick={() => setSelectedImage(null)}
              className="absolute top-5 right-5 text-white hover:text-[#f0cbd4] transition"
            >
              <X size={32} />
            </button>

            <div
              className="max-w-5xl w-full"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] mx-auto object-contain rounded-xl"
              />
              <p className="text-center text-white font-serif text-xl mt-4">
                {selectedImage.title}
              </p>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <section className="text-center mt-16 sm:mt-20 bg-[#f3e8e8] rounded-3xl px-6 py-12 sm:px-12">
          <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-4">
            Your Moment Awaits
          </p>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#3d2930] mb-4">
            Ready for Your Beauty Moment?
          </h2>

          <p className="text-gray-600 mb-7 max-w-xl mx-auto leading-7">
            Discover your favorite treatment and let us help you feel
            beautiful and confident.
          </p>

          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-2 bg-[#89505f] text-white px-8 py-3.5 rounded-full hover:bg-[#70404d] transition duration-300"
          >
            Book Appointment <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Gallery;
