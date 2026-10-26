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
          "id, customer_name, customer_email, service_id, booking_date, start_time, status"
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

  const formatTime = (time) => (time ? time.slice(0, 5) : "Not specified");

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

      <main className="min-h-screen min-w-0 bg-[#fffaf8] p-3 sm:p-4 md:ml-64 md:p-6">
        <div className="mx-auto w-full max-w-7xl min-w-0">
          {/* Header */}
          <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[2px] text-[#89505f]">
                Belleora Beauty
              </p>

              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#38232c]">
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
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-[#eadde0] bg-white px-3 py-2 text-xs font-medium text-[#89505f] shadow-sm transition hover:bg-[#f8eff1] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </header>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 p-3 text-xs sm:text-sm text-red-700"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => fetchBookings(true)}
                disabled={refreshing}
                className="self-start sm:self-auto rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium hover:bg-red-100 disabled:opacity-50"
              >
                Try again
              </button>
            </div>
          )}

          {/* Status legend */}
          <section
            aria-label="Appointment status legend"
            className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-[#eadde0] bg-white p-3 shadow-sm"
          >
            {legendItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                {item.label}
              </div>
            ))}
          </section>

          {/* Calendar Section */}
          <section className="w-full min-w-0 rounded-xl border border-[#eadde0] bg-white p-2 sm:p-4 shadow-sm">
            {loading ? (
              <div className="flex h-64 sm:h-96 items-center justify-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-[#89505f]"
                />
              </div>
            ) : (
              <div className="w-full min-w-0 overflow-x-auto calendar-responsive-container">
                <style>{`
                  /* Mobile Calendar Adjustments */
                  @media (max-width: 640px) {
                    .fc .fc-toolbar {
                      flex-direction: column;
                      gap: 8px;
                      align-items: stretch;
                    }
                    .fc .fc-toolbar-title {
                      font-size: 1.1rem !important;
                      text-align: center;
                    }
                    .fc .fc-button {
                      padding: 4px 8px !important;
                      font-size: 0.75rem !important;
                    }
                    .fc .fc-header-toolbar {
                      margin-bottom: 0.75em !important;
                    }
                    .fc-theme-classic td, .fc-theme-classic th {
                      padding: 2px !important;
                    }
                    .fc .fc-daygrid-day-number {
                      font-size: 0.75rem;
                      padding: 2px 4px;
                    }
                    .fc-event {
                      font-size: 0.7rem !important;
                      padding: 1px 2px !important;
                    }
                  }
                `}</style>
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
                      (item) => String(item.id) === info.event.id
                    );

                    if (booking) setSelectedBooking(booking);
                  }}
                  height="auto"
                  contentHeight="auto"
                  aspectRatio={1.3}
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#38232c]/40 p-4 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-details-title"
                className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl transition-all"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#89505f]">
                      Appointment details
                    </p>

                    <h2
                      id="booking-details-title"
                      className="mt-1 text-lg font-bold text-[#38232c]"
                    >
                      {selectedBooking.customer_name || "Customer"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    aria-label="Close appointment details"
                    className="rounded-full p-1.5 text-gray-400 hover:bg-[#f8eff1] hover:text-[#89505f] transition"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-3.5 divide-y divide-gray-100">
                  <div className="flex items-start gap-3 pt-1">
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

                  <div className="flex items-start gap-3 pt-3">
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

                  <div className="flex items-start gap-3 pt-3">
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

                  <div className="flex items-start gap-3 pt-3">
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

                  <div className="pt-3">
                    <p className="text-[11px] text-gray-500">Service</p>
                    <p className="mt-0.5 text-sm font-medium text-[#38232c]">
                      {SERVICE_NAMES[selectedBooking.service_id] ||
                        selectedBooking.service_id ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="pt-3">
                    <p className="text-[11px] text-gray-500">Status</p>
                    <span
                      className="mt-1.5 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold capitalize text-white shadow-sm"
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
                  className="mt-6 w-full rounded-xl bg-[#89505f] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#70404d] active:scale-[0.98]"
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