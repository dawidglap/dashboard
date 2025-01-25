"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBuilding,
  FaDollarSign,
  FaPhone,
  FaTasks,
  FaUser,
  FaLifeRing,
} from "react-icons/fa";

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
        setDemoCallsCount(demoCalls.length);
      } catch (error) {
        console.error("Error fetching demo calls:", error);
        setDemoCallsCount(0);
      }
    };

    fetchDemoCalls();
  }, []);

  const gridData = [
    {
      title: "Firmen",
      count: 10,
      link: "/dashboard/firmen",
      icon: <FaBuilding className="text-blue-500 text-4xl" />,
      color: "bg-gradient-to-r from-blue-50 to-blue-100",
    },
    {
      title: "Earnings",
      count: "CHF 12,500",
      link: "/dashboard/earnings",
      icon: <FaDollarSign className="text-green-500 text-4xl" />,
      color: "bg-gradient-to-r from-green-50 to-green-100",
    },
    {
      title: "Demo Calls",
      count: demoCallsCount,
      link: "/dashboard/demo-calls",
      icon: <FaPhone className="text-indigo-500 text-4xl" />,
      color: "bg-gradient-to-r from-indigo-50 to-indigo-100",
    },
    {
      title: "Team",
      count: 5,
      link: "/dashboard/team",
      avatarGroup: true, // Mark this for avatar group
      color: "bg-gradient-to-r from-purple-50 to-purple-100",
    },
    {
      title: "Aufgaben",
      count: 8,
      link: "/dashboard/aufgaben",
      icon: <FaTasks className="text-yellow-500 text-4xl" />,
      color: "bg-gradient-to-r from-yellow-50 to-yellow-100",
    },
    {
      title: "Profile",
      link: "/dashboard/profile",
      icon: <FaUser className="text-pink-500 text-4xl" />,
      color: "bg-gradient-to-r from-pink-50 to-pink-100",
    },
    {
      title: "Support",
      link: "/dashboard/support",
      icon: <FaLifeRing className="text-gray-500 text-4xl" />,
      color: "bg-gradient-to-r from-gray-50 to-gray-100",
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

      {/* Grid */}
      <div className="grid grid-cols-12 gap-6">
        {gridData.map((item, index) => (
          <div
            key={index}
            className={`card p-4 rounded-lg shadow-lg ${
              item.color
            } hover:shadow-2xl transition duration-300 col-span-12 sm:col-span-6 lg:${
              item.width || "col-span-4"
            }`}
          >
            <Link href={item.link} className="flex items-center space-x-4">
              {item.avatarGroup ? (
                <div className="avatar-group -space-x-4 h-12">
                  <div className="avatar ">
                    <img
                      src="https://i.ibb.co/njXQwm0/Progetto-senza-titolo-33.png"
                      alt="Avatar 1"
                      className="w-12 h-12 rounded-full" // Set image to 50px x 50px
                    />
                  </div>
                  <div className="avatar">
                    <img
                      src="https://i.ibb.co/njXQwm0/Progetto-senza-titolo-33.png"
                      alt="Avatar 2"
                      className="w-12 h-12 rounded-full" // Set image to 50px x 50px
                    />
                  </div>
                  <div className="avatar">
                    <img
                      src="https://i.ibb.co/njXQwm0/Progetto-senza-titolo-33.png"
                      alt="Avatar 2"
                      className="w-12 h-12 rounded-full" // Set image to 50px x 50px
                    />
                  </div>
                  <div className="avatar">
                    <img
                      src="https://i.ibb.co/njXQwm0/Progetto-senza-titolo-33.png"
                      alt="Avatar 2"
                      className="w-12 h-12 rounded-full" // Set image to 50px x 50px
                    />
                  </div>
                  {/* <div className="avatar">
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full text-sm font-bold">
                      +{item.count - 2}
                    </div>
                  </div> */}
                </div>
              ) : (
                item.icon
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {item.title}
                </h2>
                {item.count && (
                  <p className="text-2xl font-extrabold">{item.count}</p>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
