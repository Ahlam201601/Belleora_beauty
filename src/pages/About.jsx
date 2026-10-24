import { Link } from "react-router-dom";

function About() {
  return (
    <main className="bg-[#fffaf8]">
      {/* Hero Section */}
      <section className="px-6 py-20 sm:px-10 lg:px-16 text-center">
        <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
          About Belleora
        </p>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#3d2930] mb-6">
          Beauty Begins With You
        </h1>

        <p className="max-w-2xl mx-auto text-gray-600 leading-7">
          At Belleora Beauty, we believe every woman deserves a moment to relax,
          feel confident, and embrace her natural beauty.
        </p>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=1000&q=80"
              alt="Elegant beauty salon interior"
              className="w-full h-87.5 sm:h-112.5 object-cover rounded-2xl"
            />
          </div>

          <div>
            <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
              Our Story
            </p>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#3d2930] mb-6">
              A Place to Feel Beautiful
            </h2>

            <p className="text-gray-600 leading-7 mb-5">
              Belleora Beauty was created to offer a welcoming space where
              beauty, comfort, and self-care come together.
            </p>

            <p className="text-gray-600 leading-7 mb-8">
              From skincare to hair styling and nail care, our goal is to make
              every visit a relaxing and enjoyable experience.
            </p>

            <Link
              to="/services"
              className="inline-flex items-center justify-center bg-[#89505f] text-white px-7 py-3 rounded-full hover:bg-[#70404d] transition duration-300"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
