"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaSignOutAlt,
  FaQuestionCircle,
  FaMoneyBillWave,
  FaVideo, // ✅ Added icon for Demo Calls
} from "react-icons/fa";

const ROLE_COLORS = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  markenbotschafter: "bg-green-500",
};

const SidebarMenu = ({ onLogout }) => {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { title: "Home", href: "/dashboard", icon: <FaHome /> },
    { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
    { title: "Demo Calls", href: "/dashboard/demo-calls", icon: <FaVideo /> }, // ✅ Added Demo Calls
    { title: "Team", href: "/dashboard/team", icon: <FaUsers /> },
    { title: "Umsatz", href: "/dashboard/umsatz", icon: <FaChartBar /> },
    {
      title: "Provisionen",
      href: "/dashboard/provisionen",
      icon: <FaMoneyBillWave />,
    },
    { title: "Aufgaben", href: "/dashboard/aufgaben", icon: <FaTasks /> },
    { title: "Hilfe", href: "/dashboard/support", icon: <FaQuestionCircle /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Fehler beim Laden des Profils");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen w-60 bg-slate-50 dark:bg-gray-900 border-r-2 border-indigo-200 shadow-lg flex flex-col py-2 px-2">
      {/* Logo */}
      <div className="flex items-center justify-start w-full">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white ps-2 pt-2">
          Webomo Business
        </h2>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-grow">
        <ul className="flex flex-col space-y-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center w-full text-sm font-normal px-4 py-1 rounded-full transition 
                ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-4">{item.title}</span>
              </Link>
            </li>
          ))}

          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-1 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
          >
            <FaSignOutAlt className="text-md" />
            <span className="ml-4 text-sm">Logout</span>
          </button>
        </ul>
      </nav>

      {/* Help & Logout */}
      <div className="mt-auto w-full">
        {/* User Profile (Avatar, Name, Role) */}
        <Link
          href="/dashboard/profil"
          className="flex flex-col items-center mt-4 group mb-4 "
        >
          {loading ? (
            // Skeleton Loader
            <>
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
              <p className="mt-2 w-20 h-4 bg-gray-300 animate-pulse"></p>
              <span className="w-16 h-3 bg-gray-300 animate-pulse mt-1"></span>
            </>
          ) : (
            // Profile Info
            <>
              <div
                className={`w-12 h-12 flex items-center justify-center text-white text-lg font-bold rounded-full ${
                  ROLE_COLORS[user?.role] || "bg-gray-500"
                }`}
              >
                {user?.name?.charAt(0) || "?"}
                {user?.surname?.charAt(0) || "?"}
              </div>
              <p className="mt-2 font-semibold text-gray-800 dark:text-gray-100 group-hover:underline">
                {user?.name || "Unbekannt"} {user?.surname || ""}
              </p>
              <span className="text-gray-600 text-sm">
                {user?.role || "Unbekannt"}
              </span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default SidebarMenu;
