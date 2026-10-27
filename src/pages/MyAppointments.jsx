
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Scissors,
  XCircle,
} from "lucide-react";
import { supabase } from "../utils/supabase";
import CancelBookingModal from "../components/CancelBookingModal";

const serviceNames = {
  "facial-treatment": "Facial Treatment",
  "hair-styling": "Hair Styling",
  "manicure-nails": "Manicure & Nails",
  "relaxing-spa": "Relaxing Spa",
  "massage-therapy": "Massage Therapy",
  "hammam-shower": "Hammam & Shower",
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadAppointments() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) throw userError;

        const user = userData.user;

        if (!user?.email) {
          throw new Error("Please sign in to view your appointments.");
        }

        const { data, error: queryError } = await supabase
          .from("bookings")
          .select(
            "id, service_id, booking_date, start_time, status, created_at"
          )
          .eq("customer_email", user.email)
          .order("booking_date", { ascending: false })
          .order("start_time", { ascending: false });

        if (queryError) throw queryError;

        if (active) {
          setAppointments(data || []);
        }
      } catch (err) {
        console.error("Loading appointments failed:", err);

        if (active) {
          setError("Unable to load your appointments. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAppointments();

    return () => {
      active = false;
    };
  }, []);

  const getStatusStyle = (status) => {
    switch ((status || "pending").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const canCancel = (appointment) => {
    const today = new Date();

    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");

    return (
      (appointment.status || "pending").toLowerCase() === "pending" &&
      appointment.booking_date >= localDate
    );
  };

  const handleCancelConfirmed = async (bookingId) => {
    setCancellingId(bookingId);
    setError("");
    setSuccess("");

    try {
      const { data, error: cancelError } = await supabase.rpc(
        "cancel_my_booking",
        { p_booking_id: bookingId }
      );

      if (cancelError) throw cancelError;

      if (!data) {
        setError(
          "This reservation can no longer be cancelled. Please refresh your appointments."
        );
        setBookingToCancel(null);
        return;
      }

      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === bookingId
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );

      setBookingToCancel(null);
      setSuccess("Your reservation has been cancelled successfully.");
    } catch (err) {
      console.error("Cancellation failed:", err);
      setError("Unable to cancel this reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 text-sm uppercase tracking-[3px] text-[#89505f]">
          Belleora Beauty
        </p>

        <h1 className="mb-3 font-serif text-4xl text-[#3d2930]">
          My Appointments
        </h1>

        <p className="mb-10 text-gray-600">
          View your bookings and their current status.
        </p>

        {loading && (
          <p className="text-[#89505f]">
            Loading your appointments...
          </p>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {!loading && success && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="mb-5 text-gray-600">
              You don't have any appointments yet.
            </p>

            <Link
              to="/services"
              className="inline-block rounded-full bg-[#89505f] px-6 py-3 text-white transition hover:bg-[#70404d]"
            >
              Explore Services
            </Link>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Scissors className="shrink-0 text-[#89505f]" />

                    <h2 className="font-semibold text-[#3d2930]">
                      {serviceNames[appointment.service_id] ||
                        appointment.service_id}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "pending"}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="shrink-0 text-[#89505f]"
                    />
                    {appointment.booking_date}
                  </p>

                  <p className="flex items-center gap-3">
                    <Clock
                      size={18}
                      className="shrink-0 text-[#89505f]"
                    />
                    {String(appointment.start_time).slice(0, 5)}
                  </p>

                  <p className="break-all pt-2 text-xs text-gray-400">
                    Reference: {appointment.id}
                  </p>
                </div>

                {canCancel(appointment) && (
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setBookingToCancel(appointment);
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    <XCircle size={16} />
                    Cancel Reservation
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      <CancelBookingModal
        booking={bookingToCancel}
        serviceName={
          bookingToCancel
            ? serviceNames[bookingToCancel.service_id] ||
              bookingToCancel.service_id
            : ""
        }
        loading={cancellingId === bookingToCancel?.id}
        onClose={() => {
          if (cancellingId === null) {
            setBookingToCancel(null);
          }
        }}
        onConfirm={() => {
          if (bookingToCancel) {
            handleCancelConfirmed(bookingToCancel.id);
          }
        }}
      />
    </main>
  );
}
