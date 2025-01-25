"use client";

import { useState, useEffect } from "react";

const DemoCalls = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">Lädt...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600">
          Keine bevorstehenden Demo-Calls gefunden.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Bevorstehende Demo-Calls
      </h1>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Titel</th>
              <th className="py-4 px-6">Startzeit</th>
              <th className="py-4 px-6">Endzeit</th>
              <th className="py-4 px-6">Teilnehmer</th>
              <th className="py-4 px-6">E-Mail</th>
              <th className="py-4 px-6">Video-Call-Link</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr
                key={booking.id}
                className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                <td className="py-4 px-6">{booking.title}</td>
                <td className="py-4 px-6">
                  {new Date(booking.startTime).toLocaleString("de-DE", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-4 px-6">
                  {new Date(booking.endTime).toLocaleString("de-DE", {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-4 px-6">
                  {booking.attendees[0]?.name || "Unbekannt"}
                </td>
                <td className="py-4 px-6">
                  {booking.attendees[0]?.email ? (
                    <a
                      href={`mailto:${booking.attendees[0].email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {booking.attendees[0].email}
                    </a>
                  ) : (
                    "Keine E-Mail"
                  )}
                </td>
                <td className="py-4 px-6">
                  {booking.metadata.videoCallUrl ? (
                    <a
                      href={booking.metadata.videoCallUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
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
    </div>
  );
};

export default DemoCalls;
