"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DashboardContent = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const [demoCallsCount, setDemoCallsCount] = useState(null);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch the number of demo calls
  useEffect(() => {
    const fetchDemoCalls = async () => {
      try {
        const response = await fetch("/api/bookings");
        const data = await response.json();
        const demoCalls = data?.data?.bookings || [];
        setDemoCallsCount(demoCalls.length); // Set the count
      } catch (error) {
        console.error("Error fetching demo calls:", error);
        setDemoCallsCount(0); // Default to 0 on error
      }
    };

    fetchDemoCalls();
  }, []);

  const gridData = [
    {
      title: "Firmen",
      count: 10,
      link: "/dashboard/firmen",
      width: "col-span-3",
      color: "bg-gradient-to-r from-blue-50 to-blue-100",
      text: "text-gray-800",
    },
    {
      title: "Earnings",
      count: "CHF 12,500",
      link: "/dashboard/earnings",
      width: "col-span-3",
      color: "bg-gradient-to-r from-green-50 to-green-100",
      text: "text-gray-800",
    },
    {
      title: "Demo Calls",
      count: demoCallsCount,
      link: "/dashboard/demo-calls",
      width: "col-span-4 relative",
      color: "bg-gradient-to-r from-indigo-50 to-indigo-100",
      text: "text-gray-800",
    },
    {
      title: "Team",
      count: 5,
      link: "/dashboard/team",
      width: "col-span-2",
      color: "bg-gradient-to-r from-purple-50 to-purple-100",
      text: "text-gray-800",
    },
    {
      title: "Aufgaben",
      count: 8,
      link: "/dashboard/aufgaben",
      width: "col-span-4",
      color: "bg-gradient-to-r from-yellow-50 to-yellow-100",
      text: "text-gray-800",
    },
    {
      title: "Profile",
      link: "/dashboard/profile",
      width: "col-span-3",
      color: "bg-gradient-to-r from-pink-50 to-pink-100",
      text: "text-gray-800",
    },
    {
      title: "Support",
      link: "/dashboard/support",
      width: "col-span-5",
      color: "bg-gradient-to-r from-gray-50 to-gray-100",
      text: "text-gray-800",
    },
    {
      title: "Webomo Academy",
      tooltip: "Coming Soon",
      disabled: true,
      width: "col-span-12",
      color: "bg-gray-100",
      text: "text-gray-400",
    },
  ];

  return (
    <div className="p-6 flex-1">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Willkommen zurück{user?.name ? `, ${user.name}` : ""}!
        </h1>
        <div className="text-right">
          <p className="text-lg font-medium text-gray-600">
            {time.toLocaleTimeString("de-DE")}
          </p>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {gridData.map((item, index) => (
          <div
            key={index}
            className={`card shadow-lg rounded-2xl p-6 ${item.color} ${
              item.text
            } ${
              item.disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-800"
            } ${item.width} hover:shadow-2xl transition-transform duration-300`}
            title={item.tooltip || ""}
          >
            {item.disabled ? (
              <div className="card-body text-center">
                <h2 className="card-title text-lg font-semibold">
                  {item.title}
                </h2>
                {item.tooltip && (
                  <p className="text-sm italic">{item.tooltip}</p>
                )}
              </div>
            ) : (
              <Link href={item.link} className="card-body text-center">
                <h2 className="card-title text-lg font-semibold relative">
                  {item.title}
                  {item.count !== null && index === 2 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 transform translate-x-3 -translate-y-3 shadow-md">
                      {item.count}
                    </span>
                  )}
                </h2>
                {item.count && index !== 2 && (
                  <p className="text-xl font-bold mt-2">{item.count}</p>
                )}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
