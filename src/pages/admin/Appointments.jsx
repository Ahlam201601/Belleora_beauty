import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Phone,
  User,
  RefreshCw,
} from "lucide-react";
import { supabase } from "../../utils/supabase";
import AdminSidebar from "../admin/AdminSidebar";

const ITEMS_PER_PAGE = 5;

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
  completed: "bg-blue-50 text-blue-700",
};

const formatStatus = (status) => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (time) => {
  if (!time) return "—";

  return time.slice(0, 5);
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("bookings")
      .select(
        `
          id,
          customer_name,
          customer_email,
          customer_phone,
          service_id,
          booking_date,
          start_time,
          status
        `
      )
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: true });

    if (fetchError) {
      console.error("Error fetching appointments:", fetchError);
      setError("Unable to load appointments. Please try again.");
      setAppointments([]);
    } else {
      setAppointments(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return appointments;

    return appointments.filter((appointment) => {
      const searchableValues = [
        appointment.customer_name,
        appointment.customer_email,
        appointment.customer_phone,
        appointment.status,
      ];

      return searchableValues.some((value) =>
        String(value || "").toLowerCase().includes(query)
      );
    });
  }, [appointments, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedAppointments = filteredAppointments.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <AdminSidebar />

       <main className="fixed inset-y-0 left-0 right-0 overflow-y-auto bg-[#fffaf8] p-4 pt-20 sm:p-6 sm:pt-20 md:left-64 md:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-[#89505f]">
                Admin Panel
              </p>

              <h1 className="text-2xl font-bold text-[#38232c] sm:text-3xl">
                Appointments
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage and track your salon appointments.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchAppointments}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadde0] bg-white px-4 py-3 text-sm font-medium text-[#89505f] transition hover:bg-[#f8eff1] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#f0e5e7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Total appointments
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#38232c]">
                    {appointments.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f8eff1] text-[#89505f]">
                  <CalendarDays size={23} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#f0e5e7] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    Pending appointments
                  </p>

                  <p className="mt-2 text-3xl font-bold text-[#38232c]">
                    {
                      appointments.filter(
                        (appointment) =>
                          (appointment.status || "pending").toLowerCase() ===
                          "pending"
                      ).length
                    }
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock size={23} />
                </div>
              </div>
            </div>
          </div>

          {/* Appointments container */}
          <section className="overflow-hidden rounded-2xl border border-[#f0e5e7] bg-white shadow-sm">
            {/* Search */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-5">
              <div>
                <h2 className="text-lg font-semibold text-[#38232c]">
                  All appointments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredAppointments.length} appointment
                  {filteredAppointments.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search appointments..."
                  className="w-full rounded-xl border border-gray-200 bg-[#fffaf8] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#89505f] focus:ring-2 focus:ring-[#89505f]/10"
                />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-6 text-center">
                <RefreshCw
                  size={28}
                  className="animate-spin text-[#89505f]"
                />

                <p className="text-sm text-gray-500">
                  Loading appointments...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="p-6 text-center">
                <p className="mb-4 text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={fetchAppointments}
                  className="rounded-xl bg-[#89505f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#70404d]"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredAppointments.length === 0 && (
              <div className="flex min-h-52 flex-col items-center justify-center p-6 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eff1] text-[#89505f]">
                  <CalendarDays size={25} />
                </div>

                <h3 className="font-semibold text-[#38232c]">
                  No appointments found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  {searchTerm
                    ? "Try searching with another name, email, phone number or status."
                    : "New appointments will appear here."}
                </p>
              </div>
            )}

            {/* Desktop and tablet table */}
            {!loading && !error && filteredAppointments.length > 0 && (
              <>
                <div className="hidden w-full overflow-x-auto md:block">
                  <table className="w-full min-w-212.5 text-left">
                    <thead className="bg-[#fcf7f7]">
                      <tr className="text-xs uppercase tracking-wider text-gray-500">
                        <th className="px-5 py-4 font-semibold">Customer</th>
                        <th className="px-5 py-4 font-semibold">Contact</th>
                        <th className="px-5 py-4 font-semibold">Date</th>
                        <th className="px-5 py-4 font-semibold">Time</th>
                        <th className="px-5 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginatedAppointments.map((appointment) => (
                        <tr
                          key={appointment.id}
                          className="transition hover:bg-[#fffaf8]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f8eff1] text-[#89505f]">
                                <User size={18} />
                              </div>

                              <div className="min-w-0">
                                <p className="font-medium text-[#38232c]">
                                  {appointment.customer_name || "Unknown"}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                  ID: {appointment.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="space-y-2 text-sm text-gray-600">
                              {appointment.customer_email && (
                                <p className="flex items-center gap-2">
                                  <Mail
                                    size={14}
                                    className="shrink-0 text-[#89505f]"
                                  />
                                  <span className="break-all">
                                    {appointment.customer_email}
                                  </span>
                                </p>
                              )}

                              {appointment.customer_phone && (
                                <p className="flex items-center gap-2">
                                  <Phone
                                    size={14}
                                    className="shrink-0 text-[#89505f]"
                                  />
                                  <span>{appointment.customer_phone}</span>
                                </p>
                              )}

                              {!appointment.customer_email &&
                                !appointment.customer_phone &&
                                "—"}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                            {formatDate(appointment.booking_date)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                            {formatTime(appointment.start_time)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                                statusStyles[
                                  (appointment.status || "pending").toLowerCase()
                                ] || "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {formatStatus(appointment.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="grid grid-cols-1 gap-3 p-3 md:hidden sm:p-4">
                  {paginatedAppointments.map((appointment) => (
                    <article
                      key={appointment.id}
                      className="min-w-0 rounded-xl border border-[#f0e5e7] bg-white p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8eff1] text-[#89505f]">
                          <User size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="wrap-break-word font-semibold text-[#38232c]">
                            {appointment.customer_name || "Unknown"}
                          </h3>

                          <p className="mt-1 break-all text-xs text-gray-400">
                            ID: {appointment.id}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[
                              (appointment.status || "pending").toLowerCase()
                            ] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                        {appointment.customer_email && (
                          <div className="flex min-w-0 items-start gap-3 text-sm text-gray-600">
                            <Mail
                              size={16}
                              className="mt-0.5 shrink-0 text-[#89505f]"
                            />
                            <span className="break-all">
                              {appointment.customer_email}
                            </span>
                          </div>
                        )}

                        {appointment.customer_phone && (
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone
                              size={16}
                              className="shrink-0 text-[#89505f]"
                            />
                            <span className="wrap-break-word">
                              {appointment.customer_phone}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <CalendarDays
                            size={16}
                            className="shrink-0 text-[#89505f]"
                          />
                          <span>{formatDate(appointment.booking_date)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Clock
                            size={16}
                            className="shrink-0 text-[#89505f]"
                          />
                          <span>{formatTime(appointment.start_time)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-5">
                  <p className="text-center text-sm text-gray-500 sm:text-left">
                    Showing{" "}
                    {filteredAppointments.length === 0
                      ? 0
                      : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                    {"–"}
                    {Math.min(
                      safeCurrentPage * ITEMS_PER_PAGE,
                      filteredAppointments.length
                    )}{" "}
                    of {filteredAppointments.length}
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={safeCurrentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-[#f8eff1] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <span className="min-w-20 text-center text-sm font-medium text-[#38232c]">
                      Page {safeCurrentPage} of {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={safeCurrentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-[#f8eff1] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}