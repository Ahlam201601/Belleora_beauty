
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Mail,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

import { supabase } from "../../utils/supabase";
import AdminSidebar from "./AdminSidebar";
import ClientDetailsModal from "./ClientDetailsModal";

const CLIENTS_PER_PAGE = 5;

function getInitials(name) {
  return (name || "Client")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function formatDate(date) {
  if (!date) return "—";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminClients() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchBookings() {
      setLoading(true);
      setError("");

      try {
        const { data, error: fetchError } = await supabase
          .from("bookings")
          .select(
            "id, customer_name, customer_email, booking_date, start_time, service_id, status"
          )
          .order("booking_date", { ascending: false });

        if (fetchError) throw fetchError;

        if (isMounted) {
          setBookings(data || []);
        }
      } catch (err) {
        console.error("Error fetching clients:", err);

        if (isMounted) {
          setError("Unable to load clients. Please try again.");
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const clients = useMemo(() => {
    const clientsMap = new Map();

    bookings.forEach((booking) => {
      const email = (booking.customer_email || "")
        .trim()
        .toLowerCase();

      const name = (booking.customer_name || "").trim();
      const key = email || `booking-${booking.id}`;

      if (!clientsMap.has(key)) {
        clientsMap.set(key, {
          id: key,
          customer_name: name || "Unnamed client",
          customer_email: email,
          bookings: [],
        });
      }

      const client = clientsMap.get(key);

      client.bookings.push(booking);

      if (
        name &&
        (!client.customer_name ||
          client.customer_name === "Unnamed client")
      ) {
        client.customer_name = name;
      }
    });

    return Array.from(clientsMap.values()).map((client) => {
      const sortedBookings = [...client.bookings].sort((a, b) => {
        const dateA = new Date(
          `${a.booking_date || "1970-01-01"}T${a.start_time || "00:00"}`
        );

        const dateB = new Date(
          `${b.booking_date || "1970-01-01"}T${b.start_time || "00:00"}`
        );

        return dateB - dateA;
      });

      return {
        ...client,
        bookings: sortedBookings,
        totalBookings: sortedBookings.length,
        latestBooking: sortedBookings[0] || null,
      };
    });
  }, [bookings]);

  const filteredClients = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return clients;

    return clients.filter((client) => {
      return (
        client.customer_name.toLowerCase().includes(query) ||
        client.customer_email.includes(query)
      );
    });
  }, [clients, searchTerm]);

  const totalPages = Math.ceil(
    filteredClients.length / CLIENTS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * CLIENTS_PER_PAGE;

  const paginatedClients = filteredClients.slice(
    startIndex,
    startIndex + CLIENTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }

    if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  function openClient(client) {
    setSelectedClient(client);
  }

  function closeClient() {
    setSelectedClient(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="min-w-0 px-4 py-5 sm:px-6 sm:py-7 lg:ml-64 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Clients
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Manage your clients and view their booking history.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-6 sm:p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#89505f]/10 text-[#89505f]">
                <Users size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Total clients
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {clients.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
            <label
              htmlFor="client-search"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Search clients
            </label>

            <div className="relative">
              <Search
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="client-search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search by name or email..."
                className="w-full min-w-0 rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#89505f] focus:ring-2 focus:ring-[#89505f]/10"
              />
            </div>
          </div>

          {/* Main content */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {/* Loading */}
            {loading && (
              <div
                className="flex flex-col items-center justify-center px-4 py-16 text-center"
                role="status"
              >
                <div className="mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#89505f]" />

                <p className="text-sm text-gray-500">
                  Loading clients...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="px-4 py-12 text-center sm:px-6">
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-lg bg-[#89505f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#754352]"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading &&
              !error &&
              filteredClients.length === 0 && (
                <div className="flex flex-col items-center justify-center px-4 py-14 text-center sm:py-16">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    {searchTerm ? (
                      <Search size={25} />
                    ) : (
                      <Users size={25} />
                    )}
                  </div>

                  <h2 className="text-base font-semibold text-gray-900">
                    {searchTerm
                      ? "No matching clients"
                      : "No clients found"}
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    {searchTerm
                      ? "Try another name or email address."
                      : "Clients will appear here when bookings are available."}
                  </p>

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="mt-4 text-sm font-semibold text-[#89505f] hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}

            {/* Desktop / tablet table */}
            {!loading &&
              !error &&
              paginatedClients.length > 0 && (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-162.5 text-left">
                      <thead className="bg-gray-50">
                        <tr className="border-b border-gray-100">
                          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-6">
                            Client
                          </th>

                          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-6">
                            Email
                          </th>

                          <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-6">
                            Bookings
                          </th>

                          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 lg:px-6">
                            Latest booking
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-gray-100">
                        {paginatedClients.map((client) => (
                          <tr
                            key={client.id}
                            onClick={() => openClient(client)}
                            onKeyDown={(event) => {
                              if (
                                event.key === "Enter" ||
                                event.key === " "
                              ) {
                                event.preventDefault();
                                openClient(client);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label={`View details for ${client.customer_name}`}
                            className="cursor-pointer transition hover:bg-[#89505f]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#89505f]"
                          >
                            <td className="px-5 py-4 lg:px-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#89505f]/10 text-sm font-bold text-[#89505f]">
                                  {getInitials(
                                    client.customer_name
                                  )}
                                </div>

                                <span className="max-w-50 truncate font-medium text-gray-900">
                                  {client.customer_name}
                                </span>
                              </div>
                            </td>

                            <td className="max-w-55 truncate px-5 py-4 text-sm text-gray-600 lg:px-6">
                              {client.customer_email || "—"}
                            </td>

                            <td className="px-5 py-4 text-center lg:px-6">
                              <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-semibold text-gray-700">
                                {client.totalBookings}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 lg:px-6">
                              {formatDate(
                                client.latestBooking?.booking_date
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile client cards */}
                  <div className="divide-y divide-gray-100 md:hidden">
                    {paginatedClients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => openClient(client)}
                        className="block w-full p-4 text-left transition hover:bg-[#89505f]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#89505f] sm:p-5"
                        aria-label={`View details for ${client.customer_name}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#89505f]/10 text-sm font-bold text-[#89505f]">
                            {getInitials(client.customer_name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h2 className="wrap-break-word text-sm font-semibold text-gray-900 sm:text-base">
                                {client.customer_name}
                              </h2>

                              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#89505f]/10 px-2.5 py-1 text-xs font-semibold text-[#89505f]">
                                <ClipboardList size={13} />
                                {client.totalBookings}
                              </span>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex min-w-0 items-start gap-2 text-sm text-gray-500">
                                <Mail
                                  size={15}
                                  className="mt-0.5 shrink-0"
                                />

                                <span className="break-all">
                                  {client.customer_email || "No email"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CalendarDays
                                  size={15}
                                  className="shrink-0"
                                />

                                <span>
                                  Latest booking:{" "}
                                  {formatDate(
                                    client.latestBooking?.booking_date
                                  )}
                                </span>
                              </div>
                            </div>

                            <p className="mt-3 text-xs font-medium text-[#89505f]">
                              View client details →
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
                    <p className="text-center text-sm text-gray-500 md:text-left">
                      Showing{" "}
                      <span className="font-medium text-gray-900">
                        {startIndex + 1}
                      </span>
                      {"–"}
                      <span className="font-medium text-gray-900">
                        {Math.min(
                          startIndex + CLIENTS_PER_PAGE,
                          filteredClients.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-gray-900">
                        {filteredClients.length}
                      </span>{" "}
                      clients
                    </p>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.max(1, page - 1)
                          )
                        }
                        disabled={currentPage <= 1}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </button>

                      <span className="whitespace-nowrap px-1 text-xs text-gray-600 sm:px-2 sm:text-sm">
                        Page {currentPage} of {Math.max(totalPages, 1)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(totalPages, page + 1)
                          )
                        }
                        disabled={currentPage >= totalPages}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
          </div>
        </div>
      </main>

      {/* Client details modal */}
      <ClientDetailsModal
        client={selectedClient}
        onClose={closeClient}
      />
    </div>
  );
}
