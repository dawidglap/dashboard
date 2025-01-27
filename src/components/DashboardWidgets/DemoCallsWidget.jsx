"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPhone } from "react-icons/fa";

const DemoCallsWidget = () => {
  const [demoCallsCount, setDemoCallsCount] = useState(null);

  useEffect(() => {
    const fetchDemoCalls = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        const demoCalls = data?.data?.bookings || [];
        setDemoCallsCount(demoCalls.length);
      } catch (error) {
        console.error("Error fetching demo calls:", error);
        setDemoCallsCount(0);
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
          <p className="text-2xl font-extrabold">
            {demoCallsCount !== null ? (
              demoCallsCount
            ) : (
              <span className="skeleton h-8 w-24 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default DemoCallsWidget;
