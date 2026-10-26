
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import classicThemePlugin from "@fullcalendar/react/themes/classic";

import {
  CalendarDays,
  Clock,
  User,
  Mail,
  RefreshCw,
  LoaderCircle,
  X,
} from "lucide-react";

import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../utils/supabase";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/classic/theme.css";
import "@fullcalendar/react/themes/classic/palette.css";

const STATUS_COLORS = {
  confirmed: "#56876a",
  pending: "#d5a34c",
  cancelled: "#c56b72",
  completed: "#89505f",
};

const SERVICE_NAMES = {
  "facial-treatment": "Facial Treatment",
  "hair-styling": "Hair Styling",
  "manicure-nails": "Manicure & Nails",
  "relaxing-spa": "Relaxing Spa",
  "massage-therapy": "Massage Therapy",
  "hammam-shower": "Hammam & Shower",
};

function AdminCalendar() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, service_id, booking_date, start_time, status",
        )
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (fetchError) throw fetchError;

      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      console.error("Logout error:", logoutError);
      setError("Unable to sign out. Please try again.");
    }
  };

  const events = bookings
    .filter((booking) => booking.booking_date && booking.start_time)
    .map((booking) => {
      const status = (booking.status || "pending").toLowerCase();
      const color = STATUS_COLORS[status] || "#89505f";

      return {
        id: String(booking.id),
        title: booking.customer_name || "Customer",
        start: `${booking.booking_date}T${booking.start_time}`,
        backgroundColor: color,
        borderColor: color,
        textColor: "#ffffff",
      };
    });

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) =>
    time ? time.slice(0, 5) : "Not specified";

  const selectedStatus = (
    selectedBooking?.status || "pending"
  ).toLowerCase();

  const legendItems = [
    { label: "Confirmed", color: STATUS_COLORS.confirmed },
    { label: "Pending", color: STATUS_COLORS.pending },
    { label: "Cancelled", color: STATUS_COLORS.cancelled },
    { label: "Completed", color: STATUS_COLORS.completed },
  ];

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <AdminSidebar onLogout={handleLogout} />

      <main className="min-h-screen min-w-0 bg-[#fffaf8] p-3 sm:p-4 md:ml-64 md:p-5">
        <div className="w-full min-w-0">
          {/* Header */}
          <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#89505f]">
                Belleora Beauty
              </p>

              <h1 className="font-serif text-2xl text-[#38232c]">
                Appointment Calendar
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Manage and view your salon appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchBookings(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#eadde0] bg-white px-3 py-2 text-xs font-medium text-[#89505f] transition hover:bg-[#f8eff1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </header>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => fetchBookings(true)}
                disabled={refreshing}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium hover:bg-red-100 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          )}

          {/* Status legend */}
          <section
            aria-label="Appointment status legend"
            className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[#eadde0] bg-white px-3 py-2"
          >
            {legendItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-[11px] text-gray-600"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
            ))}
          </section>

          {/* Calendar */}
          <section className="w-full min-w-0 rounded-lg border border-[#eadde0] bg-white p-2 shadow-sm sm:p-3">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <LoaderCircle
                  size={26}
                  className="animate-spin text-[#89505f]"
                />
              </div>
            ) : (
              <div className="w-full min-w-0 overflow-x-auto">
                <FullCalendar
                  plugins={[
                    classicThemePlugin,
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                  ]}
                  initialView="dayGridMonth"
                  fixedWeekCount={false}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth",
                  }}
                  events={events}
                  eventClick={(info) => {
                    const booking = bookings.find(
                      (item) => String(item.id) === info.event.id,
                    );

                    if (booking) setSelectedBooking(booking);
                  }}
                  height="auto"
                  contentHeight={520}
                  aspectRatio={1.8}
                  dayMaxEvents={2}
                  nowIndicator
                  weekends
                  selectable={false}
                  editable={false}
                  eventDisplay="block"
                  displayEventTime
                  eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }}
                  noEventsContent="No appointments to display"
                />
              </div>
            )}
          </section>

          {/* Appointment details modal */}
          {selectedBooking && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#38232c]/40 p-3"
              onClick={() => setSelectedBooking(null)}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-details-title"
                className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-5"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89505f]">
                      Appointment details
                    </p>

                    <h2
                      id="booking-details-title"
                      className="mt-1 text-lg font-semibold text-[#38232c]"
                    >
                      {selectedBooking.customer_name || "Customer"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    aria-label="Close appointment details"
                    className="rounded-md p-1.5 text-gray-500 hover:bg-[#f8eff1] hover:text-[#89505f]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User
                      size={16}
                      className="mt-0.5 shrink-0 text-[#89505f]"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500">Customer</p>
                      <p className="text-sm font-medium text-[#38232c]">
                        {selectedBooking.customer_name || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      size={16}
                      className="mt-0.5 shrink-0 text-[#89505f]"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-500">Email</p>
                      <p className="break-all text-sm font-medium text-[#38232c]">
                        {selectedBooking.customer_email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-[#89505f]"
                    />
                    <div>
                      <p className="text-[11px] text-gray-500">Date</p>
                      <p className="text-sm font-medium text-[#38232c]">
                        {formatDate(selectedBooking.booking_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="mt-0.5 shrink-0 text-[#89505f]"
                    />
                    <div>
                      <p className="text-[11px] text-gray-500">Time</p>
                      <p className="text-sm font-medium text-[#38232c]">
                        {formatTime(selectedBooking.start_time)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500">Service</p>
                    <p className="mt-1 text-sm font-medium text-[#38232c]">
                      {SERVICE_NAMES[selectedBooking.service_id] ||
                        selectedBooking.service_id ||
                        "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-gray-500">Status</p>
                    <span
                      className="mt-1 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium capitalize text-white"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[selectedStatus] || "#89505f",
                      }}
                    >
                      {selectedBooking.status || "pending"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="mt-5 w-full rounded-lg bg-[#89505f] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#70404d]"
                >
                  Close
                </button>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminCalendar;
