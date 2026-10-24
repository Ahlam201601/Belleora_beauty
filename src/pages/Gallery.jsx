
import { useState } from "react";
import { X } from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80",
    title: "Beauty Salon",
    category: "Salon",
  },
  {
    src: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=80",
    title: "Elegant Interior",
    category: "Salon",
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80",
    title: "Nail Art",
    category: "Nails",
  },
  {
    src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=900&q=80",
    title: "Beauty Essentials",
    category: "Beauty",
  },
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
    title: "Facial Treatment",
    category: "Skincare",
  },
  {
    src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    title: "Hair Styling",
    category: "Hair",
  },
];

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

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
            Explore our beauty space, treatments, and little details
            that make every visit to Belleora special.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <button
              key={image.title}
              type="button"
              onClick={() => setSelectedImage(image)}
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

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-5"
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

            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#3d2930] mb-4">
            Ready for Your Beauty Moment?
          </h2>

          <p className="text-gray-600 mb-7">
            Let us help you feel beautiful and confident.
          </p>

          <a
            href="/booking"
            className="inline-flex items-center justify-center bg-[#89505f] text-white px-8 py-3.5 rounded-full hover:bg-[#70404d] transition duration-300"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </main>
  );
}

export default Gallery;
