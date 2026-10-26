
import {
  X,
  UserRound,
  Mail,
  CalendarDays,
  Clock,
  Hash,
} from "lucide-react";

const STATUS_STYLES = {
  confirmed: "bg-green-50 text-green-700 ring-green-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  cancelled: "bg-red-50 text-red-700 ring-red-600/20",
  completed: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

const STATUS_LABELS = {
  confirmed: "Confirmed",
  pending: "Pending",
  cancelled: "Cancelled",
  completed: "Completed",
};

function formatDate(date) {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  return (name || "Client")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function StatusBadge({ status }) {
  const normalizedStatus = (status || "pending").toLowerCase();

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${
        STATUS_STYLES[normalizedStatus] ||
        "bg-gray-50 text-gray-600 ring-gray-500/20"
      }`}
    >
      {STATUS_LABELS[normalizedStatus] ||
        normalizedStatus.charAt(0).toUpperCase() +
          normalizedStatus.slice(1)}
    </span>
  );
}

export default function ClientDetailsModal({ client, onClose }) {
  if (!client) return null;

  const bookings = [...(client.bookings || [])].sort((a, b) => {
    const dateA = new Date(
      `${a.booking_date || "1970-01-01"}T${a.start_time || "00:00"}`
    );
    const dateB = new Date(
      `${b.booking_date || "1970-01-01"}T${b.start_time || "00:00"}`
    );

    return dateB - dateA;
  });

  const latestBooking = bookings[0];

  const uniqueServices = new Set(
    bookings.map((booking) => booking.service_id).filter(Boolean)
  ).size;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#89505f]/10 text-sm font-semibold text-[#89505f]">
              {getInitials(client.customer_name)}
            </div>

            <div className="min-w-0">
              <h2
                id="client-modal-title"
                className="truncate text-lg font-semibold text-gray-900"
              >
                {client.customer_name || "Unnamed client"}
              </h2>

              <p className="mt-1 flex items-center gap-2 break-all text-sm text-gray-500">
                <Mail size={14} className="shrink-0" />
                {client.customer_email || "No email"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close client details"
          >
            <X size={19} strokeWidth={1.8} />
          </button>
        </div>

        <div className="space-y-7 p-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <CalendarDays size={17} />
                <span className="text-sm">Total bookings</span>
              </div>

              <p className="text-2xl font-semibold text-gray-900">
                {bookings.length}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Hash size={17} />
                <span className="text-sm">Different services</span>
              </div>

              <p className="text-2xl font-semibold text-gray-900">
                {uniqueServices}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <div className="mb-3 flex items-center gap-2 text-gray-500">
                <Clock size={17} />
                <span className="text-sm">Latest booking</span>
              </div>

              <p className="text-sm font-semibold text-gray-900">
                {latestBooking
                  ? formatDate(latestBooking.booking_date)
                  : "No booking"}
              </p>
            </div>
          </div>

          {/* Client information */}
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <UserRound size={17} className="text-[#89505f]" />
              Client information
            </h3>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Full name</p>
                <p className="mt-1 wrap-break-word text-sm font-medium text-gray-800">
                  {client.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email address</p>
                <p className="mt-1 break-all text-sm font-medium text-gray-800">
                  {client.customer_email || "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Booking history */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Booking history
              </h3>

              <span className="text-xs text-gray-400">
                {bookings.length}{" "}
                {bookings.length === 1 ? "booking" : "bookings"}
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No bookings found for this client.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-gray-100 p-4 transition hover:border-gray-200"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <p className="wrap-break-word text-sm font-medium text-gray-900">
                          {booking.service_name ||
                            (booking.service_id
                              ? `Service #${booking.service_id}`
                              : "Service not specified")}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {formatDate(booking.booking_date)}
                          </span>

                          <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {booking.start_time
                              ? String(booking.start_time).slice(0, 5)
                              : "Time not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Minimal footer */}
        <div className="border-t border-gray-100 px-6 py-4">
          <p className="text-center text-xs text-gray-400">
            Client details &amp; booking history
          </p>
        </div>
      </div>
    </div>
  );
}
