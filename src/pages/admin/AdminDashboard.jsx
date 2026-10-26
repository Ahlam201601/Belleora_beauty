import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  CalendarCheck,
  CalendarX,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../utils/supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

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
        .order("booking_date", { ascending: false })
        .order("start_time", { ascending: false });

      if (fetchError) {
        console.error("Supabase error:", fetchError);
        setError("Unable to load bookings. Please try again.");
        setBookings([]);
        return;
      }

      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(
        "Unable to load bookings. Please check your database access and RLS policies."
      );
      setBookings([]);
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
      return;
    }

    navigate("/admin/login", { replace: true });
  };

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "cancelled"
  );

  const uniqueClients = new Set(
    bookings
      .map((booking) => booking.customer_email?.trim().toLowerCase())
      .filter(Boolean)
  );

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: CalendarDays,
      iconColor: "text-[#89505f]",
      iconBg: "bg-[#f5e8eb]",
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.length,
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CalendarCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Cancelled Bookings",
      value: cancelledBookings.length,
      icon: CalendarX,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    {
      title: "Total Clients",
      value: uniqueClients.size,
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
  ];

  const serviceNames = {
    "facial-treatment": "Facial Treatment",
    "hair-styling": "Hair Styling",
    "manicure-nails": "Manicure & Nails",
    "relaxing-spa": "Relaxing Spa",
    "massage-therapy": "Massage Therapy",
    "hammam-shower": "Hammam & Shower",
  };

  const getStatusStyle = (status) => {
    switch ((status || "pending").toLowerCase()) {
      case "confirmed":
        return "bg-green-50 text-green-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      case "completed":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <AdminSidebar onLogout={handleLogout} />

      {/* Main content: leaves space for the fixed desktop sidebar */}
      <main className="min-w-0 p-4 sm:p-6 md:ml-64 md:p-8 lg:p-10">
        <div className="mx-auto w-full max-w-7xl">
          {/* Page header */}
          <header className="mb-8 md:mb-10">
            <p className="mb-2 text-xs font-medium uppercase tracking-[3px] text-[#89505f] sm:text-sm">
              Belleora Beauty
            </p>

            <h1 className="font-serif text-3xl text-[#3d2930] sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Welcome back! Here is an overview of your beauty studio.
            </p>
          </header>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-6 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => fetchBookings(true)}
                disabled={loading || refreshing}
                className="shrink-0 self-start rounded-lg border border-red-200 px-3 py-2 font-medium transition hover:bg-red-100 disabled:opacity-50 sm:self-center"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <section
            aria-label="Booking statistics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="min-w-0 rounded-2xl border border-[#f0e3e6] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">{stat.title}</p>

                    <div
                      className={`shrink-0 rounded-xl p-3 ${stat.iconBg}`}
                    >
                      <Icon size={21} className={stat.iconColor} />
                    </div>
                  </div>

                  <p className="text-3xl font-semibold text-[#3d2930]">
                    {loading ? (
                      <LoaderCircle
                        className="animate-spin"
                        size={25}
                        aria-label="Loading"
                      />
                    ) : (
                      stat.value
                    )}
                  </p>
                </article>
              );
            })}
          </section>

          {/* Recent bookings */}
          <section className="mt-8 min-w-0 overflow-hidden rounded-2xl border border-[#f0e3e6] bg-white p-4 shadow-sm sm:mt-10 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#3d2930]">
                  Recent Bookings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  The latest appointments recorded in your database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchBookings(true)}
                disabled={loading || refreshing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#89505f] px-4 py-3 text-sm text-[#89505f] transition hover:bg-[#89505f] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-48 items-center justify-center">
                <LoaderCircle
                  className="animate-spin text-[#89505f]"
                  size={30}
                />
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-xl bg-[#fffaf8] px-4 py-10 text-center">
                <CalendarDays
                  size={35}
                  className="mx-auto mb-3 text-[#89505f]"
                />

                <p className="text-sm text-gray-500">
                  {error
                    ? "Bookings could not be loaded."
                    : "No bookings found."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden w-full overflow-x-auto md:block">
                  <table className="w-full min-w-162.5 text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-sm text-gray-500">
                        <th className="px-3 py-4 font-medium">Client</th>
                        <th className="px-3 py-4 font-medium">Service</th>
                        <th className="px-3 py-4 font-medium">Date</th>
                        <th className="px-3 py-4 font-medium">Time</th>
                        <th className="px-3 py-4 font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {bookings.slice(0, 6).map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-b border-gray-50 last:border-0 hover:bg-[#fffaf8]"
                        >
                          <td className="max-w-56 px-3 py-4">
                            <p className="wmin-w-162.5 font-medium text-[#3d2930]">
                              {booking.customer_name || "Unknown"}
                            </p>

                            <p className="mt-1 break-all text-xs text-gray-500">
                              {booking.customer_email}
                            </p>
                          </td>

                          <td className="px-3 py-4 text-sm text-gray-600">
                            {serviceNames[booking.service_id] ||
                              booking.service_id ||
                              "—"}
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                            {booking.booking_date || "—"}
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                            {booking.start_time
                              ? String(booking.start_time).slice(0, 5)
                              : "—"}
                          </td>

                          <td className="px-3 py-4">
                            <span
                              className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                booking.status
                              )}`}
                            >
                              {booking.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile booking cards */}
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {bookings.slice(0, 6).map((booking) => (
                    <article
                      key={booking.id}
                      className="min-w-0 rounded-xl border border-[#f0e3e6] bg-[#fffaf8] p-4"
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="wrap-break-word font-semibold text-[#3d2930]">
                            {booking.customer_name || "Unknown"}
                          </h3>

                          <p className="mt-1 break-all text-xs text-gray-500">
                            {booking.customer_email || "No email"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status || "pending"}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 border-t border-[#f0e3e6] pt-3 text-sm text-gray-600">
                        <div className="flex items-start gap-3">
                          <CalendarCheck
                            size={17}
                            className="mt-0.5 shrink-0 text-[#89505f]"
                          />
                          <span className="wrap-break-word">
                            {serviceNames[booking.service_id] ||
                              booking.service_id ||
                              "Service not specified"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <CalendarDays
                            size={17}
                            className="shrink-0 text-[#89505f]"
                          />
                          <span>{booking.booking_date || "Date not set"}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock
                            size={17}
                            className="shrink-0 text-[#89505f]"
                          />
                          <span>
                            {booking.start_time
                              ? String(booking.start_time).slice(0, 5)
                              : "Time not set"}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
