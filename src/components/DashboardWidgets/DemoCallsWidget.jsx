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
    <div className="relative border-white border-2 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-gray-800 dark:text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold">Demo Calls</h2>
        <p className="text-4xl mt-1 font-extrabold">
          {loading ? (
            <span className="skeleton h-8 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></span>
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
            <p className="skeleton h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></p>
            <p className="skeleton h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mt-2"></p>
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

      {/* ✅ Updated CTA Button */}
      <Link
        href="/dashboard/demo-calls"
        className=" mt-4 md:mt-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:from-indigo-500 dark:to-purple-400"
      >
        Demo-calls anzeigen →
      </Link>
    </div>
  );
};

export default DemoCallsWidget;
