
import { Link } from 'react-router-dom';
import homeImage from '../assets/images/Home.png';

function Home() {
  return (
    <main>
      <section className="relative min-h-[85vh] lg:min-h-[calc(100vh-80px)] flex items-center px-6 sm:px-10 lg:px-16 xl:px-24 py-16 lg:py-20 overflow-hidden bg-[#fffaf8]">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeImage})`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="max-w-xl">

            <p className="text-[#89505f] uppercase tracking-[3px] text-xs sm:text-sm mb-5">
              Welcome to Belleora Beauty
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-[#3d2930] leading-tight mb-6">
              Discover Your Natural Beauty
            </h1>

            <p className="max-w-lg text-gray-700 text-sm sm:text-base lg:text-lg leading-7 lg:leading-8 mb-8">
              Relax, refresh, and feel beautiful with our personalized beauty treatments.
            </p>

            <Link
              to="/booking"
              className="inline-flex items-center justify-center bg-[#89505f] text-white px-7 py-3.5 rounded-full text-sm sm:text-base hover:bg-[#70404d] transition duration-300"
            >
              Book Appointment
            </Link>

          </div>
        </div>

      </section>
    </main>
  );
}

export default Home;
