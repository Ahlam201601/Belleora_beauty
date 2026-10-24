
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

function Contact() {
  return (
    <main className="bg-[#fffaf8] min-h-screen py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[#89505f] uppercase tracking-[3px] text-sm mb-4">
            Get In Touch
          </p>

          <h1 className="text-4xl sm:text-5xl font-serif text-[#3d2930] mb-5">
            Contact Us
          </h1>

          <p className="text-gray-600 leading-7">
            Have a question or need an appointment? We would love to hear from
            you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-7">
            <div>
              <h2 className="text-2xl font-serif text-[#3d2930] mb-3">
                Let's Talk About Beauty
              </h2>

              <p className="text-gray-600 leading-7">
                Contact us for information about our services, availability,
                and appointments.
              </p>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="bg-[#f0e2e5] text-[#89505f] p-3 rounded-xl shrink-0">
                <MapPin size={22} />
              </div>

              <div>
                <h3 className="font-medium text-[#3d2930] mb-1">
                  Our Location
                </h3>
                <p className="text-gray-600 text-sm">
                  Your salon address here
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="bg-[#f0e2e5] text-[#89505f] p-3 rounded-xl shrink-0">
                <Phone size={22} />
              </div>

              <div>
                <h3 className="font-medium text-[#3d2930] mb-1">Phone</h3>
                <p className="text-gray-600 text-sm">
                  Your phone number here
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-[#f0e2e5] text-[#89505f] p-3 rounded-xl shrink-0">
                <Mail size={22} />
              </div>

              <div>
                <h3 className="font-medium text-[#3d2930] mb-1">Email</h3>
                <p className="text-gray-600 text-sm">Your email here</p>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="flex items-start gap-4">
              <div className="bg-[#f0e2e5] text-[#89505f] p-3 rounded-xl shrink-0">
                <Clock size={22} />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-[#3d2930] mb-3">
                  Opening Hours
                </h3>

                <div className="bg-white border border-[#eadde0] rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                    <span className="text-sm text-gray-600">
                      Monday - Friday
                    </span>

                    <span className="text-sm font-medium text-[#89505f]">
                      09:00 AM - 07:00 PM
                    </span>
                  </div>

                  <div className="border-t border-[#f0e2e5]" />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                    <span className="text-sm text-gray-600">
                      Saturday - Sunday
                    </span>

                    <span className="text-sm font-medium text-[#89505f]">
                      10:00 AM - 10:00 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you! Your message has been submitted.");
            }}
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#f0e2e5] space-y-5"
          >
            <h2 className="text-2xl font-serif text-[#3d2930] mb-2">
              Send Us a Message
            </h2>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm text-[#3d2930] mb-2"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                className="w-full border border-[#eadde0] rounded-xl px-4 py-3 outline-none focus:border-[#89505f] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm text-[#3d2930] mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full border border-[#eadde0] rounded-xl px-4 py-3 outline-none focus:border-[#89505f] transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm text-[#3d2930] mb-2"
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="What is your message about?"
                required
                className="w-full border border-[#eadde0] rounded-xl px-4 py-3 outline-none focus:border-[#89505f] transition"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm text-[#3d2930] mb-2"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message here..."
                required
                className="w-full border border-[#eadde0] rounded-xl px-4 py-3 outline-none focus:border-[#89505f] transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#89505f] text-white py-3.5 rounded-full hover:bg-[#70404d] transition duration-300"
            >
              Send Message
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
