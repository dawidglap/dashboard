"use client";

import { useState, useEffect } from "react";

const DemoCalls = () => {
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // ✅ Number of items per page

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Buchungen.");
        const data = await res.json();
        setBookings(data.data.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Calculate pagination
  const totalItems = bookings?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasMore = page < totalPages;

  const paginatedBookings = bookings?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // ✅ Loading state (skeleton UI)
  if (loading || bookings === null) {
    return (
      <div className="px-4 md:px-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-base-content mb-6">
          Bevorstehende Demo-Calls
        </h1>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="table table-xs w-full">
            <thead>
              <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
                <th className="py-3 px-4 text-left">Titel</th>
                <th className="py-3 px-4 text-left">Datum & Zeit</th>
                <th className="py-3 px-4 text-left">Teilnehmer</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">
                  E-Mail
                </th>
                <th className="py-3 px-4 text-left hidden md:table-cell">
                  Video-Call-Link
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(itemsPerPage)].map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse border-b border-gray-200"
                >
                  {[...Array(5)].map((_, i) => (
                    <td key={i} className="py-4 px-4">
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-error">{error}</p>
      </div>
    );
  }

  // ✅ No bookings found
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-base-content">
          Keine bevorstehenden Demo-Calls gefunden.
        </p>
      </div>
    );
  }

  // ✅ Main content with pagination
  return (
    <div className="px-4 md:px-12">
      <h1 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
        Bevorstehende Demo-Calls
      </h1>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className=" table-xs table w-full">
          <thead>
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left">Titel</th>
              <th className="py-3 px-4 text-left">Datum & Zeit</th>
              <th className="py-3 px-4 text-left">Teilnehmer</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                E-Mail
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Video-Call-Link
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((booking, index) => (
              <tr
                key={booking.id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
              >
                <td className="py-4 px-4 font-medium">{booking.title}</td>
                <td className="py-4 px-4">
                  {new Date(booking.startTime).toLocaleString("de-DE", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-4 px-4">
                  {booking.attendees[0]?.name || "Unbekannt"}
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  {booking.attendees[0]?.email ? (
                    <a
                      href={`mailto:${booking.attendees[0].email}`}
                      className="text-primary hover:underline"
                    >
                      {booking.attendees[0].email}
                    </a>
                  ) : (
                    "Keine E-Mail"
                  )}
                </td>
                <td className="py-6 px-4 hidden md:table-cell">
                  {booking.metadata.videoCallUrl ? (
                    <a
                      href={booking.metadata.videoCallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white badge bg-indigo-500 hover:bg-indigo-700"
                    >
                      Beitreten
                    </a>
                  ) : (
                    "Kein Link"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination UI */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-xs btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-xs">Seite {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="btn btn-xs btn-neutral"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
};

export default DemoCalls;
