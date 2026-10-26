
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  CalendarCheck,
  LoaderCircle,
} from "lucide-react";
import { supabase } from "../../utils/supabase";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, service_id, booking_date, start_time, status"
        )
        .order("booking_date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching bookings:", error);
        setError("Unable to load bookings. Please check your database access.");
        setBookings([]);
      } else {
        setBookings(data || []);
      }

      setLoading(false);
    };

    fetchBookings();
  }, []);

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const uniqueClients = new Set(
    bookings.map((booking) => booking.customer_email?.toLowerCase())
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
    <div className="min-h-screen bg-[#fffaf8] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-2 text-sm uppercase tracking-[3px] text-[#89505f]">
            Belleora Beauty
          </p>

          <h1 className="font-serif text-3xl text-[#3d2930] md:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 text-gray-500">
            Welcome back! Here is an overview of your beauty studio.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#f0e3e6] bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm text-gray-500">{stat.title}</p>

                  <div className="rounded-xl bg-[#f5e8eb] p-3">
                    <Icon size={21} className="text-[#89505f]" />
                  </div>
                </div>

                <p className="text-3xl font-semibold text-[#3d2930]">
                  {loading ? (
                    <LoaderCircle className="animate-spin" size={25} />
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-[#f0e3e6] bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[#3d2930]">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                The latest appointments recorded in your database.
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="rounded-full border border-[#89505f] px-4 py-2 text-sm text-[#89505f] transition hover:bg-[#89505f] hover:text-white"
            >
              Refresh
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
                No bookings found.
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
                  {[...bookings]
                    .sort((a, b) => {
                      const dateA = `${a.booking_date} ${a.start_time}`;
                      const dateB = `${b.booking_date} ${b.start_time}`;
                      return dateB.localeCompare(dateA);
                    })
                    .slice(0, 5)
                    .map((booking) => (
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
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
