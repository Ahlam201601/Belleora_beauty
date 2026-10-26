
import { useEffect, useMemo, useState } from "react";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
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

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
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
    async function fetchBookings() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, customer_name, customer_email, booking_date, start_time, service_id, status"
        )
        .order("booking_date", { ascending: false });

      if (fetchError) {
        console.error("Error fetching clients:", fetchError);
        setError("Unable to load clients. Please try again.");
        setBookings([]);
      } else {
        setBookings(data || []);
      }

      setLoading(false);
    }

    fetchBookings();
  }, []);

  const clients = useMemo(() => {
    const clientsMap = new Map();

    bookings.forEach((booking) => {
      const email = (booking.customer_email || "").trim().toLowerCase();
      const name = (booking.customer_name || "").trim();

      // Email is used to group bookings belonging to the same client.
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
        (!client.customer_name || client.customer_name === "Unnamed client")
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

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Clients
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Manage your clients and view their booking history.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#89505f]/10 text-[#89505f]">
                <Users size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">Total clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by client name or email..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#89505f] focus:ring-2 focus:ring-[#89505f]/10"
              />
            </div>
          </div>

          {/* Clients table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-162.5 text-left">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Client
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Bookings
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Latest booking
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        Loading clients...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-sm text-red-600"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : paginatedClients.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-sm text-gray-500"
                      >
                        {searchTerm
                          ? "No clients match your search."
                          : "No clients found."}
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => (
                      <tr
                        key={client.id}
                        onClick={() => openClient(client)}
                        className="cursor-pointer transition hover:bg-[#89505f]/5"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#89505f]/10 text-sm font-bold text-[#89505f]">
                              {getInitials(client.customer_name)}
                            </div>

                            <span className="font-medium text-gray-900">
                              {client.customer_name}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.customer_email || "—"}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-semibold text-gray-700">
                            {client.totalBookings}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {client.latestBooking
                            ? formatDate(
                                client.latestBooking.booking_date
                              )
                            : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && !error && filteredClients.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-gray-500">
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <span className="px-2 text-sm text-gray-600">
                    Page {currentPage} of {Math.max(totalPages, 1)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(Math.max(totalPages, 1), page + 1)
                      )
                    }
                    disabled={currentPage >= totalPages}
                    className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Client details popup */}
      <ClientDetailsModal
        client={selectedClient}
        onClose={closeClient}
      />
    </div>
  );
}
