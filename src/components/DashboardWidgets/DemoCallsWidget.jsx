"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPhone } from "react-icons/fa";

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

        // Set total demo calls count
        setDemoCallsCount(demoCalls.length);

        // Find the next call
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
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-indigo-50 to-indigo-100 col-span-4">
      <Link href="/dashboard/demo-calls" className="flex items-start space-x-4">
        <FaPhone className="text-indigo-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Demo Calls</h2>
          {loading ? (
            <>
              <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
              <p className="skeleton h-6 w-16 bg-gray-300 rounded animate-pulse mt-2"></p>
            </>
          ) : (
            <>
              <p className="text-2xl font-extrabold">
                {demoCallsCount !== null ? demoCallsCount : "N/A"}
              </p>
              {nextCall ? (
                <p className="text-gray-600 text-sm">
                  Nächster Anruf:{" "}
                  <strong>
                    {nextCall.date} Zeit: {nextCall.time}
                  </strong>
                </p>
              ) : (
                <p className="text-gray-600 text-sm">Kein geplanter Anruf.</p>
              )}
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default DemoCallsWidget;
