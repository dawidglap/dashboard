"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import { motion } from "framer-motion";
import { signOut } from "next-auth/react"; // ✅ Import NextAuth's signOut
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaSignOutAlt,
  FaQuestionCircle,
  FaMoneyBillWave,
  FaVideo,
} from "react-icons/fa";

const ROLE_COLORS = {
  admin: "bg-red-500",
  manager: "bg-blue-500",
  markenbotschafter: "bg-green-500",
};

const SidebarMenu = () => {
  const pathname = usePathname();
  const router = useRouter(); // ✅ Use router for navigation
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown

  const menuItems = [
    { title: "Home", href: "/dashboard", icon: <FaHome /> },
    { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
    { title: "Demo Calls", href: "/dashboard/demo-calls", icon: <FaVideo /> },
    { title: "Team", href: "/dashboard/team", icon: <FaUsers /> },
    { title: "Aufgaben", href: "/dashboard/aufgaben", icon: <FaTasks /> },
    { title: "Umsatz", href: "/dashboard/umsatz", icon: <FaChartBar /> },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (!res.ok) throw new Error("Fehler beim Laden des Profils");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Fehler:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    await signOut({ redirect: false }); // ✅ Sign out without auto redirection
    router.push("/login"); // ✅ Manually redirect user to login page
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0  h-screen w-64 z-[100] border-r shadow-lg flex flex-col p-4 overflow-y-auto"
    >
      {/* Logo */}
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-extrabold text-base-content">
          Webomo Business
        </h2>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-grow">
        <ul className="flex flex-col space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={() => setOpenDropdown(null)} // Close dropdown when clicking another item
                className={`flex items-center px-4 py-2 rounded-full transition-all text-sm 
                ${
                  pathname === item.href
                    ? "bg-indigo-200 text-indigo-600 dark:bg-indigo-900 dark:text-white shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="ml-4">{item.title}</span>
              </Link>
            </li>
          ))}

          {/* Provisionen Dropdown */}
          <li>
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "provisionen" ? null : "provisionen"
                )
              }
              className={`flex items-center justify-between w-full px-4 py-2 rounded-full transition-all text-sm 
                ${
                  pathname.includes("/dashboard/provisionen")
                    ? "bg-indigo-200 text-indigo-600 dark:bg-indigo-900 dark:text-white shadow"
                    : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
                }`}
            >
              <div className="flex items-center">
                <FaMoneyBillWave className="text-lg" />
                <span className="ml-4">Provisionen</span>
              </div>
            </button>

            {openDropdown === "provisionen" && (
              <ul className="ml-8 mt-2 space-y-1">
                <li>
                  <Link
                    href="/dashboard/provisionen"
                    className={`block px-4 py-2 rounded-full transition-all text-sm ${
                      pathname === "/dashboard/provisionen"
                        ? "bg-indigo-200 text-indigo-600 dark:bg-indigo-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Übersicht
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/provisionen/details"
                    className={`block px-4 py-2 rounded-full transition-all text-sm ${
                      pathname === "/dashboard/provisionen/details"
                        ? "bg-indigo-200 text-indigo-600 dark:bg-indigo-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Details
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Hilfe (Support) */}
          <li>
            <Link
              href="/dashboard/hilfe"
              onClick={() => setOpenDropdown(null)}
              className={`flex items-center px-4 py-2 rounded-full transition-all text-sm 
              ${
                pathname === "/dashboard/support"
                  ? "bg-indigo-200 text-indigo-600 dark:bg-indigo-900 dark:text-white shadow"
                  : "text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800"
              }`}
            >
              <FaQuestionCircle className="text-lg" />
              <span className="ml-4">Hilfe</span>
            </Link>
          </li>

          {/* Logout Button */}
          <button
            onClick={handleLogout} // ✅ Attach logout function
            className="flex items-center w-full px-4 py-2 mt-4 rounded-full text-error hover:bg-error/20 transition-all"
          >
            <FaSignOutAlt className="text-md" />
            <span className="ml-4 text-sm">Logout</span>
          </button>
        </ul>
      </nav>

      {/* User Profile (Avatar, Name, Role) */}
      <div className="mt-auto flex flex-col items-center">
        <Link
          href="/dashboard/profil"
          className="flex flex-col items-center group mb-4"
        >
          {loading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse"></div>
              <p className="mt-2 w-20 h-4 bg-gray-300 animate-pulse"></p>
              <span className="w-16 h-3 bg-gray-300 animate-pulse mt-1"></span>
            </>
          ) : (
            <>
              <div
                className={`w-12 h-12 flex items-center justify-center text-white text-lg font-bold rounded-full ${
                  ROLE_COLORS[user?.role] || "bg-gray-500"
                }`}
              >
                {user?.name?.charAt(0) || "?"}
                {user?.surname?.charAt(0) || "?"}
              </div>
              <p className="mt-2 font-semibold text-base-content group-hover:underline">
                {user?.name || "Unbekannt"} {user?.surname || ""}
              </p>
              <span className="text-gray-600 text-sm dark:text-gray-400">
                {user?.role || "Unbekannt"}
              </span>
            </>
          )}
        </Link>
      </div>
    </motion.div>
  );
};

export default SidebarMenu;
