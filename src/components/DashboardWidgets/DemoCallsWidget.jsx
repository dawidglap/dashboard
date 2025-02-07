"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DemoCallsWidget = () => {
  const [demoCallsCount, setDemoCallsCount] = useState(null);
  const [nextCall, setNextCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemoCalls = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        const demoCalls = data?.data?.bookings || [];

        // ✅ Set total demo calls count
        setDemoCallsCount(demoCalls.length);

        // ✅ Find the next scheduled call
        const futureCalls = demoCalls
          .filter((call) => new Date(call.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        if (futureCalls.length > 0) {
          const next = futureCalls[0];
          setNextCall({
            date: new Date(next.startTime).toLocaleDateString("de-DE", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
            time: new Date(next.startTime).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching demo calls:", error);
        setDemoCallsCount(0);
        setNextCall(null);
        setLoading(false);
      }
    };

    fetchDemoCalls();
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold">Demo Calls</h2>
        <p className="text-3xl font-bold">
          {loading ? (
            <span className="skeleton h-8 w-10 bg-gray-300 rounded animate-pulse"></span>
          ) : demoCallsCount !== null ? (
            demoCallsCount
          ) : (
            "N/A"
          )}
        </p>
      </div>

      {/* ✅ Display Next Scheduled Call */}
      <div className="mt-4 text-sm opacity-90">
        {loading ? (
          <>
            <p className="skeleton h-6 w-24 bg-gray-300 rounded animate-pulse"></p>
            <p className="skeleton h-6 w-32 bg-gray-300 rounded animate-pulse mt-2"></p>
          </>
        ) : nextCall ? (
          <p>
            Nächster Anruf:{" "}
            <strong>
              {nextCall.date} - {nextCall.time}
            </strong>
          </p>
        ) : (
          <p>Kein geplanter Anruf.</p>
        )}
      </div>

      {/* ✅ CTA Button */}
      <Link
        href="/dashboard/demo-calls"
        className="mt-4 inline-block bg-white text-indigo-600 px-4 py-2 rounded-full text-center font-semibold hover:bg-gray-200 transition"
      >
        Anrufe anzeigen →
      </Link>
    </div>
  );
};

export default DemoCallsWidget;
