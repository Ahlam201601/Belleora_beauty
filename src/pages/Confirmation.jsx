
import { Link, useLocation, Navigate } from "react-router-dom";
import { CheckCircle, CalendarDays, Clock, Scissors, FileDown } from "lucide-react";

export default function Confirmation() {
  const { state } = useLocation();
  const booking = state?.booking;
  const bookingId = state?.bookingId;

  if (!booking || !bookingId) {
    return <Navigate to="/services" replace />;
  }

  const services = {
    "facial-treatment": "Facial Treatment",
    "hair-styling": "Hair Styling",
    "manicure-nails": "Manicure & Nails",
    "relaxing-spa": "Relaxing Spa",
    "massage-therapy": "Massage Therapy",
    "hammam-shower": "Hammam & Shower",
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
        <CheckCircle
          size={64}
          className="mx-auto mb-6 text-green-600"
        />

        <p className="mb-3 text-sm uppercase tracking-[3px] text-[#89505f]">
          Belleora Beauty
        </p>

        <h1 className="mb-4 font-serif text-4xl text-[#3d2930]">
          Booking Submitted!
        </h1>

        <p className="mb-8 leading-7 text-gray-600">
          Your appointment request has been submitted successfully.
          Please note that your booking is awaiting confirmation.
        </p>

        <div className="space-y-5 rounded-2xl bg-[#fffaf8] p-6 text-left">
          <div className="flex items-center gap-3">
            <Scissors className="text-[#89505f]" />
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-medium text-[#3d2930]">
                {services[booking.service_id] || booking.service_id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#89505f]" />
            <div>
              <p className="text-sm text-gray-500">Appointment Date</p>
              <p className="font-medium text-[#3d2930]">
                {booking.booking_date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-[#89505f]" />
            <div>
              <p className="text-sm text-gray-500">Appointment Time</p>
              <p className="font-medium text-[#3d2930]">
                {String(booking.start_time).slice(0, 5)}
              </p>
            </div>
          </div>

          <div className="border-t border-[#eadde0] pt-4">
            <p className="text-sm text-gray-500">Booking Reference</p>
            <p className="font-semibold text-[#89505f]">
              {bookingId}
            </p>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
          <FileDown size={16} />
          Keep your downloaded confirmation PDF.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/services"
            className="rounded-full border border-[#89505f] px-6 py-3 font-medium text-[#89505f] transition hover:bg-[#fff7f7]"
          >
            Explore Services
          </Link>

          <Link
            to="/"
            className="rounded-full bg-[#89505f] px-6 py-3 font-medium text-white transition hover:bg-[#70404d]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
