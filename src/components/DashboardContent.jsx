"use client";

import { useState, useEffect } from "react";

const DashboardContent = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState({
    city: null,
    country: null,
    error: null,
  });

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval); // Cleanup
  }, []);

  // Retrieve user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toFixed(2);
          const longitude = position.coords.longitude.toFixed(2);

          // Fetch city and country using the API
          try {
            const res = await fetch(
              `https://ipapi.co/${latitude},${longitude}/json/`
            );
            const data = await res.json();

            if (data && data.city && data.country_name) {
              setLocation({ city: data.city, country: data.country_name });
            } else {
              setLocation({
                city: null,
                country: null,
                error: "Ort nicht gefunden",
              });
            }
          } catch (error) {
            console.error("Fehler beim Abrufen des Ortes:", error);
            setLocation({
              city: null,
              country: null,
              error: "Fehler beim Abrufen des Ortes",
            });
          }
        },
        (error) => {
          console.error("Fehler beim Abrufen des Standorts:", error);
          setLocation({
            city: null,
            country: null,
            error: "Standort konnte nicht abgerufen werden",
          });
        }
      );
    } else {
      setLocation({
        city: null,
        country: null,
        error: "Geolocation wird von Ihrem Browser nicht unterstützt",
      });
    }
  }, []);

  return (
    <div className="p-6 flex-1">
      {/* Welcome Message */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        {/* Current Time and Date */}
        <div className="text-right">
          <p className="text-xl font-semibold">
            {time.toLocaleTimeString("de-DE")} {/* Current Time */}
          </p>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            {/* Current Date */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
