
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  CalendarCheck,
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

    const { data, error: fetchError } = await supabase
      .from("bookings")
      .select(
        "id, customer_name, customer_email, service_id, booking_date, start_time, status"
      )
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (fetchError) {
      console.error("Error fetching bookings:", fetchError);
      setError("Unable to load bookings. Please check your database access.");
      setBookings([]);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleLogout = async () => {
    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError("Unable to sign out. Please try again.");
      console.error("Logout error:", logoutError);
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
    },
    {
      title: "Pending Bookings",
      value: pendingBookings.length,
      icon: Clock,
    },
    {
      title: "Confirmed Bookings",
      value: confirmedBookings.length,
      icon: CalendarCheck,
    },
    {
      title: "Total Clients",
      value: uniqueClients.size,
      icon: Users,
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

  return (
    <div className="min-h-screen bg-[#fffaf8] md:flex">
      <AdminSidebar onLogout={handleLogout} />

      <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 md:mb-10">
            <p className="mb-2 text-sm uppercase tracking-[3px] text-[#89505f]">
              Belleora Beauty
            </p>

            <h1 className="font-serif text-3xl text-[#3d2930] md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-gray-500">
              Welcome back! Here is an overview of your beauty studio.
            </p>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <section
            aria-label="Booking statistics"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="rounded-2xl border border-[#f0e3e6] bg-white p-5 shadow-sm md:p-6"
                >
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-500">{stat.title}</p>

                    <div className="rounded-xl bg-[#f5e8eb] p-3">
                      <Icon size={21} className="text-[#89505f]" />
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

          <section className="mt-8 rounded-2xl border border-[#f0e3e6] bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
                className="inline-flex items-center gap-2 rounded-full border border-[#89505f] px-4 py-2 text-sm text-[#89505f] transition hover:bg-[#89505f] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={15}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
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
                  {error ? "Bookings could not be loaded." : "No bookings found."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
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
                    {bookings.slice(0, 5).map((booking) => (
                      <tr
                        key={booking.id}
                        className="border-b border-gray-50 last:border-0"
                      >
                        <td className="px-3 py-4">
                          <p className="font-medium text-[#3d2930]">
                            {booking.customer_name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.customer_email}
                          </p>
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-600">
                          {serviceNames[booking.service_id] ||
                            booking.service_id}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-600">
                          {booking.booking_date}
                        </td>

                        <td className="px-3 py-4 text-sm text-gray-600">
                          {String(booking.start_time).slice(0, 5)}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              booking.status === "confirmed"
                                ? "bg-green-50 text-green-700"
                                : booking.status === "cancelled"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
