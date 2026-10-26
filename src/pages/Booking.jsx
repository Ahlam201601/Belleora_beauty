
import { useState } from "react";
import { supabase } from "../utils/supabase";
import { jsPDF } from "jspdf";
import logo from "../assets/images/logo.png";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const serviceNames = {
  "facial-treatment": "Facial Treatment",
  "hair-styling": "Hair Styling",
  "manicure-nails": "Manicure & Nails",
  "relaxing-spa": "Relaxing Spa",
  "massage-therapy": "Massage Therapy",
  "hammam-shower": "Hammam & Shower",
};


const downloadBookingPDF = async (booking, bookingId) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Load logo
  const image = new Image();
  image.src = logo;

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);

  const logoData = canvas.toDataURL("image/png");

  // Logo centered
  doc.addImage(logoData, "PNG", pageWidth / 2 - 17, 15, 34, 34);

  // Brand name
  doc.setTextColor(137, 80, 95);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Belleora Beauty", pageWidth / 2, 57, {
    align: "center",
  });

  // Document title
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("Appointment Confirmation", 20, 78);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "Thank you for choosing Belleora Beauty.",
    20,
    86
  );

  // Simple divider
  doc.setDrawColor(220, 200, 205);
  doc.line(20, 94, pageWidth - 20, 94);

  // Booking reference
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(137, 80, 95);
  doc.text("Booking Reference", 20, 107);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(String(bookingId), 20, 115);

  // Booking details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Booking Details", 20, 133);

  const serviceNames = {
    "facial-treatment": "Facial Treatment",
    "hair-styling": "Hair Styling",
    "manicure-nails": "Manicure & Nails",
    "relaxing-spa": "Relaxing Spa",
    "massage-therapy": "Massage Therapy",
    "hammam-shower": "Hammam & Shower",
  };

  const details = [
    ["Full Name", booking.customer_name],
    ["Email", booking.customer_email],
    ["Phone", booking.customer_phone],
    [
      "Service",
      serviceNames[booking.service_id] || booking.service_id,
    ],
    ["Date", booking.booking_date],
    ["Time", String(booking.start_time).slice(0, 5)],
    ["Status", "Pending - Awaiting confirmation"],
  ];

  let y = 146;

  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${label}:`, 20, y);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);

    const lines = doc.splitTextToSize(
      String(value || "-"),
      pageWidth - 75
    );

    doc.text(lines, 65, y);
    y += Math.max(10, lines.length * 5 + 2);
  });

  // Footer
  const footerY = Math.max(y + 15, 260);

  doc.setDrawColor(220, 200, 205);
  doc.line(20, footerY - 8, pageWidth - 20, footerY - 8);

  doc.setTextColor(137, 80, 95);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    "We look forward to welcoming you!",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );

  doc.save(`Belleora-Booking-${bookingId}.pdf`);
};


function Booking() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    service_id: "",
    booking_date: "",
    start_time: "",
    notes: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setMessageType("");

    let bookingSaved = false;

    try {
      const booking = { ...formData };

      const { data, error } = await supabase.rpc("create_booking", {
        p_customer_name: booking.customer_name.trim(),
        p_customer_email: booking.customer_email.trim(),
        p_customer_phone: booking.customer_phone.trim(),
        p_service_id: booking.service_id,
        p_booking_date: booking.booking_date,
        p_start_time: booking.start_time,
        p_notes: booking.notes.trim() || null,
      });

      if (error) {
        if (error.message.includes("TIME_SLOT_FULL")) {
          setMessage(
            "This service is fully booked at that time. Please choose another time."
          );
          setMessageType("error");
          return;
        }

        throw error;
      }

      if (!data) {
        throw new Error("Booking reference was not returned.");
      }

      bookingSaved = true;

      try {
        await downloadBookingPDF(booking, data);

        setMessage(
          "Your booking was submitted successfully. Your confirmation PDF has been downloaded."
        );
        setMessageType("success");

        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          service_id: "",
          booking_date: "",
          start_time: "",
          notes: "",
        });
      } catch (pdfError) {
        console.error("PDF generation error:", pdfError);

        setMessage(
          `Your booking was saved. Reference: ${data}. However, the PDF could not be generated.`
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Booking error:", error);

      setMessage(
        bookingSaved
          ? "Your booking was saved, but an additional step failed."
          : "Unable to submit your booking. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm uppercase tracking-[3px] text-[#89505f]">
          Belleora Beauty
        </p>

        <h1 className="mb-4 font-serif text-4xl text-[#3d2930] sm:text-5xl">
          Book Your Appointment
        </h1>

        <p className="mb-10 text-gray-600">
          Choose your beauty treatment and reserve your moment of relaxation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="customer_name"
              className="mb-2 block text-sm text-[#3d2930]"
            >
              Full Name
            </label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#89505f]"
              placeholder="Enter your full name"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="customer_email"
                className="mb-2 block text-sm text-[#3d2930]"
              >
                Email Address
              </label>
              <input
                id="customer_email"
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#89505f]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="customer_phone"
                className="mb-2 block text-sm text-[#3d2930]"
              >
                Phone Number
              </label>
              <input
                id="customer_phone"
                type="tel"
                name="customer_phone"
                value={formData.customer_phone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#89505f]"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="service_id"
              className="mb-2 block text-sm text-[#3d2930]"
            >
              Beauty Service
            </label>

            <select
              id="service_id"
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#89505f]"
            >
              <option value="">Select a service</option>
              <option value="facial-treatment">Facial Treatment</option>
              <option value="hair-styling">Hair Styling</option>
              <option value="manicure-nails">Manicure &amp; Nails</option>
              <option value="relaxing-spa">Relaxing Spa</option>
              <option value="massage-therapy">Massage Therapy</option>
              <option value="hammam-shower">Hammam &amp; Shower</option>
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="booking_date"
                className="mb-2 block text-sm text-[#3d2930]"
              >
                Appointment Date
              </label>
              <input
                id="booking_date"
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                min={getToday()}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#89505f]"
              />
            </div>

            <div>
              <label
                htmlFor="start_time"
                className="mb-2 block text-sm text-[#3d2930]"
              >
                Appointment Time
              </label>
              <select
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#89505f]"
              >
                <option value="">Select a time</option>
                {[
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                ].map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm text-[#3d2930]"
            >
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#89505f]"
              placeholder="Any special requests?"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#89505f] px-6 py-3.5 font-medium text-white transition hover:bg-[#70404d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Book Appointment"}
          </button>

          {message && (
            <p
              role="status"
              className={`mt-4 rounded-xl p-4 text-center text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default Booking;
