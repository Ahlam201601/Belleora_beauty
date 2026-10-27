import { X, AlertTriangle } from "lucide-react";

export default function CancelBookingModal({
  booking,
  serviceName,
  loading,
  onClose,
  onConfirm,
}) {
  if (!booking) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-title"
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle size={24} className="text-red-600" />
        </div>

        <h2
          id="cancel-title"
          className="mb-3 text-xl font-semibold text-[#3d2930]"
        >
          Cancel Reservation?
        </h2>

        <p className="mb-6 text-sm leading-6 text-gray-600">
          Are you sure you want to cancel your{" "}
          <strong className="text-[#3d2930]">{serviceName}</strong> appointment
          on <strong className="text-[#3d2930]">{booking.booking_date}</strong>?
        </p>

        <div>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </button>
        </div>
      </section>
    </div>
  );
}
