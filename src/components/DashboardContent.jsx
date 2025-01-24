"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DashboardContent = ({ user }) => {
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const gridData = [
    {
      title: "Firmen",
      count: 10,
      link: "/dashboard/firmen",
      width: "col-span-3",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },

    {
      title: "Earnings",
      count: "CHF 12,500",
      link: "/dashboard/earnings",
      width: "col-span-3",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Demo Calls",
      count: 3,
      link: "/dashboard/demo-calls",
      width: "col-span-4",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Team",
      count: 5,
      link: "/dashboard/team",
      width: "col-span-2",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Aufgaben",
      count: 8,
      link: "/dashboard/aufgaben",
      width: "col-span-4",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Profile",
      link: "/dashboard/profile",
      width: "col-span-3",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Support",
      link: "/dashboard/support",
      width: "col-span-5",
      color: "bg-slate-200",
      text: "text-black uppercase",
    },
    {
      title: "Webomo Academy",
      tooltip: "Coming Soon",
      disabled: true,
      width: "col-span-12",
      color: "bg-slate-50",
      text: "text-black uppercase",
    },
  ];

  return (
    <div className="p-6 flex-1">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white">
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
            className={`card shadow-md p-6 ${item.color} ${item.text} ${
              item.disabled ? "text-gray-500 cursor-not-allowed" : "text-black"
            } ${
              item.width
            } hover:shadow-lg hover:scale-105 transition-transform duration-300`}
            title={item.tooltip || ""}
          >
            {item.disabled ? (
              <div className="card-body text-center">
                <h2 className="card-title text-3xl font-bold">{item.title}</h2>
                {item.tooltip && (
                  <p className="text-lg italic">{item.tooltip}</p>
                )}
              </div>
            ) : item.isButton ? (
              <Link
                href={item.link}
                className="card-body flex items-center justify-center"
              >
                <span className="text-5xl font-bold text-gray-800">
                  {item.icon}
                </span>
                <span className="ml-4 text-3xl font-bold">{item.title}</span>
              </Link>
            ) : (
              <Link href={item.link} className="card-body">
                <h2 className="card-title text-3xl font-bold">{item.title}</h2>
                {item.count && (
                  <p className="text-5xl font-extrabold">{item.count}</p>
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
