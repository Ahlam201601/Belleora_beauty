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
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import { supabase } from "../../utils/supabase";

const STATUS_COLORS = {
  confirmed: "#56876a",
  pending: "#d5a34c",
  cancelled: "#c56b72",
  completed: "#89505f",
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, service_id, booking_date, start_time, status"
        )
        .order("booking_date", { ascending: false })
        .order("start_time", { ascending: true });

      if (fetchError) throw fetchError;

      setBookings(data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Unable to load booking data. Please try again.");
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

  const normalizedStatus = (status) =>
    (status || "pending").toLowerCase();

  const pendingCount = bookings.filter(
    (booking) => normalizedStatus(booking.status) === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => normalizedStatus(booking.status) === "confirmed"
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => normalizedStatus(booking.status) === "cancelled"
  ).length;

  const completedCount = bookings.filter(
    (booking) => normalizedStatus(booking.status) === "completed"
  ).length;

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
      iconBg: "bg-[#f8eff1]",
    },
    {
      title: "Pending Bookings",
      value: pendingCount,
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    {
      title: "Confirmed Bookings",
      value: confirmedCount,
      icon: CalendarCheck,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
    },
    {
      title: "Cancelled Bookings",
      value: cancelledCount,
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

  const chartData = (() => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const count = bookings.filter(
        (booking) => booking.booking_date === dateKey
      ).length;

      days.push({
        dateKey,
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        bookings: count,
      });
    }

    return days;
  })();

  const statusChartData = [
    {
      name: "Confirmed",
      value: confirmedCount,
      color: STATUS_COLORS.confirmed,
    },
    {
      name: "Pending",
      value: pendingCount,
      color: STATUS_COLORS.pending,
    },
    {
      name: "Cancelled",
      value: cancelledCount,
      color: STATUS_COLORS.cancelled,
    },
    {
      name: "Completed",
      value: completedCount,
      color: STATUS_COLORS.completed,
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="min-h-screen bg-[#fffaf8]">
      <AdminSidebar onLogout={handleLogout} />

      <main className="min-w-0 p-4 sm:p-5 md:ml-64 md:p-6 lg:p-7">
        <div className="mx-auto w-full max-w-360">

          {/* Header */}
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-[2.5px] text-[#89505f]">
                Belleora Beauty
              </p>

              <h1 className="font-serif text-2xl text-[#38232c] sm:text-3xl">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Welcome back! Here is your studio overview.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchBookings(true)}
              disabled={loading || refreshing}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#eadde0] bg-white px-4 py-2.5 text-sm font-medium text-[#89505f] transition hover:bg-[#f8eff1] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </header>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="mb-5 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <p>{error}</p>

              <button
                type="button"
                onClick={() => fetchBookings(true)}
                disabled={refreshing}
                className="self-start rounded-lg border border-red-200 px-3 py-2 font-medium hover:bg-red-100 disabled:opacity-50 sm:self-center"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <section
            aria-label="Booking statistics"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.title}
                  className="min-w-0 rounded-xl border border-[#f0e5e7] bg-white p-3.5 shadow-sm transition hover:shadow-md sm:p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs leading-5 text-gray-500 sm:text-sm">
                      {stat.title}
                    </p>

                    <div className={`shrink-0 rounded-lg p-2 ${stat.iconBg}`}>
                      <Icon size={17} className={stat.iconColor} />
                    </div>
                  </div>

                  <p className="mt-3 text-2xl font-semibold text-[#38232c]">
                    {loading ? (
                      <LoaderCircle
                        size={22}
                        className="animate-spin"
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

          {/* Charts */}
          <section className="mt-5 grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">

            {/* Bookings overview */}
            <article className="min-w-0 overflow-hidden rounded-xl border border-[#f0e5e7] bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
              <h2 className="text-base font-semibold text-[#38232c]">
                Bookings Overview
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Appointments over the last 7 days.
              </p>

              {loading ? (
                <div className="flex h-56 items-center justify-center">
                  <LoaderCircle
                    size={26}
                    className="animate-spin text-[#89505f]"
                  />
                </div>
              ) : (
                <div className="mt-4 h-56 w-full sm:h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 8, left: -22, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="bookingGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#89505f"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#89505f"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#f0e5e7"
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: "#89777c" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: "#89777c" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        formatter={(value) => [value, "Bookings"]}
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #f0e5e7",
                          fontSize: "12px",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="bookings"
                        name="Bookings"
                        stroke="#89505f"
                        strokeWidth={2.5}
                        fill="url(#bookingGradient)"
                        activeDot={{ r: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </article>

            {/* Booking status */}
            <article className="min-w-0 overflow-hidden rounded-xl border border-[#f0e5e7] bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-base font-semibold text-[#38232c]">
                Booking Status
              </h2>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Appointments by status.
              </p>

              {loading ? (
                <div className="flex h-56 items-center justify-center">
                  <LoaderCircle
                    size={26}
                    className="animate-spin text-[#89505f]"
                  />
                </div>
              ) : statusChartData.length === 0 ? (
                <div className="flex h-56 flex-col items-center justify-center text-center">
                  <CalendarDays
                    size={30}
                    className="mb-3 text-[#89505f]"
                  />
                  <p className="text-sm text-gray-500">
                    No booking data available yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mt-3 h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={68}
                          paddingAngle={3}
                        >
                          {statusChartData.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>

                        <Tooltip
                          formatter={(value, name) => [value, name]}
                        />

                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={7}
                          wrapperStyle={{ fontSize: "10px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    {statusChartData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate text-gray-600">
                            {item.name}
                          </span>
                        </div>

                        <span className="font-semibold text-[#38232c]">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </article>
          </section>

        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
