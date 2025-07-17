"use client";

import { useState, useEffect, useRef } from "react";
import { getSession } from "next-auth/react";

const DemoCalls = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const containerRef = useRef(null);
  const fetchedIds = useRef(new Set());

  // ✅ Fetch User Session (to get role)
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.role) {
        setUserRole(session.user.role);
      }
    };

    fetchSession();
  }, []);

  // ✅ Fetch Initial Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (bookings.length > 0) return; // ✅ Evita di ricaricare se già ci sono dati

      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Buchungen.");
        const data = await res.json();

        setBookings(data.data.bookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Infinite Scroll Logic
  const fetchMoreData = async () => {
    if (loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/bookings?cursor=${bookings.length}`);
      if (!res.ok) throw new Error("Fehler beim Abrufen weiterer Buchungen.");
      const data = await res.json();

      const newBookings = data.data.bookings.filter(
        (booking) => !fetchedIds.current.has(booking.id)
      );

      newBookings.forEach((b) => fetchedIds.current.add(b.id));

      setBookings((prev) => [...prev, ...newBookings]);
    } catch (err) {
      console.error("❌ Fehler beim Laden weiterer Buchungen:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ Detect Scroll Position
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        fetchMoreData();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [bookings]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="px-4 lg:px-4 xl:px-6 2xl:px-12">
        <h1 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
          Bevorstehende Demo-Calls
        </h1>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="table table-xs w-full">
            <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50">
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
          </table>
        </div>
      </div>
    );
  }

  return (
   <div className="px-4 md:px-12">
 <h1 className="text-xl sm:text-2xl md:text-4xl text-center mt-8 mb-8 font-extrabold text-base-content">
  Bevorstehende <span className="block sm:inline">Demo-Calls</span>
</h1>


  {/* ✅ CARD VERSIONE MOBILE */}
  <div className="grid gap-4 lg:hidden">
    {bookings.map((booking, index) => (
      <div
        key={`${booking.id}-${index}`}
        className="bg-white  dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4 shadow"
      >
        <h2 className="font-semibold text-sm  sm:text-lg mb-2">{booking.title}</h2>
        <div className="border-b border-indigo-400 mt-2  block sm:hidden mb-2" />
        <p className="mb-1 text-xs sm:text-sm">
          <strong>Datum:</strong>{" "}
          {new Date(booking.startTime).toLocaleString("de-DE", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="mb-1 text-xs sm:text-sm">
          <strong>Teilnehmer:</strong>{" "}
          {booking.attendees[0]?.name || "Unbekannt"}
          
        </p>
        {userRole === "admin" ? (
          <>
            <p className="mb-1 text-xs sm:text-sm">
              <strong>E-Mail:</strong>{" "}
              {booking.attendees[0]?.email || "Keine E-Mail"}
            </p>
            <p className="mb-1 text-xs sm:text-sm">
              <strong>Link:</strong>{" "}
              {booking.metadata.videoCallUrl ? (
                <a
                  href={booking.metadata.videoCallUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline"
                >
                  Beitreten
                </a>
              ) : (
                "Kein Link"
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">Details nur für Admin sichtbar</p>
        )}
      </div>
    ))}
  </div>

  {/* ✅ TABLE VERSIONE DESKTOP */}
  <div
    className="overflow-x-auto max-h-[90vh] overflow-auto rounded-lg shadow-sm hidden lg:block"
    ref={containerRef}
  >
    <table className="table table-xs w-full">
      <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50">
        <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
          <th className="py-3 px-4 text-left">Titel</th>
          <th className="py-3 px-4 text-left">Datum & Zeit</th>
          <th className="py-3 px-4 text-left">Teilnehmer</th>
          <th className="py-3 px-4 text-left">E-Mail</th>
          <th className="py-3 px-4 text-left">Video-Call-Link</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking, index) => (
          <tr
            key={`${booking.id}-${index}`}
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
            <td className="py-4 px-4">
              {booking.attendees[0]?.email ? (
                userRole === "admin" ? (
                  <a
                    href={`mailto:${booking.attendees[0].email}`}
                    className="text-primary hover:underline"
                  >
                    {booking.attendees[0].email}
                  </a>
                ) : (
                  "**********"
                )
              ) : (
                "Keine E-Mail"
              )}
            </td>
            <td className="py-6 px-4">
              {booking.metadata.videoCallUrl ? (
                userRole === "admin" ? (
                  <a
                    href={booking.metadata.videoCallUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white badge bg-indigo-500 hover:bg-indigo-700"
                  >
                    Beitreten
                  </a>
                ) : (
                  <span className="text-gray-400 cursor-not-allowed">
                    Zugang gesperrt
                  </span>
                )
              ) : (
                "Kein Link"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {loadingMore && (
    <p className="text-center text-gray-500 text-xs mt-4">Lade weitere...</p>
  )}
</div>

  );
};

export default DemoCalls;
