"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Import icons from React Icons
import {
  FaHome,
  FaBuilding,
  FaPhone,
  FaTasks,
  FaLifeRing,
  FaSignOutAlt,
} from "react-icons/fa";

const SidebarMenu = ({ user }) => {
  const pathname = usePathname(); // Get the current route

  const isActive = (route) => pathname.startsWith(route); // Check if the route matches or starts with

  return (
    <div className="w-64 h-screen bg-base-200 shadow-md flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Title */}
        <div className="p-6 text-center font-bold text-2xl text-indigo-500">
          Webomo Business
        </div>

        {/* Menu Items */}
        <ul className="menu p-4 space-y-4 text-lg">
          {/* Home */}
          <li className={isActive("/dashboard") ? "active" : ""}>
            <Link href="/dashboard" className="flex items-center space-x-4">
              <FaHome className="h-6 w-6" />
              <span>Home</span>
            </Link>
          </li>

          {/* Firmen */}
          <li className={isActive("/firmen") ? "active" : ""}>
            <Link href="/firmen" className="flex items-center space-x-4">
              <FaBuilding className="h-6 w-6" />
              <span>Firmen</span>
            </Link>
          </li>

          {/* Demo Calls */}
          <li className={isActive("/demo-calls") ? "active" : ""}>
            <Link href="/demo-calls" className="flex items-center space-x-4">
              <FaPhone className="h-6 w-6" />
              <span>Demo Calls</span>
            </Link>
          </li>

          {/* Aufgaben */}
          <li className={isActive("/aufgaben") ? "active" : ""}>
            <Link href="/aufgaben" className="flex items-center space-x-4">
              <FaTasks className="h-6 w-6" />
              <span>Aufgaben</span>
            </Link>
          </li>

          {/* Support */}
          <li className={isActive("/support") ? "active" : ""}>
            <Link href="/support" className="flex items-center space-x-4">
              <FaLifeRing className="h-6 w-6" />
              <span>Support</span>
            </Link>
          </li>

          {/* Logout */}
          <li className={isActive("/logout") ? "active" : ""}>
            <Link href="/logout" className="flex items-center space-x-4">
              <FaSignOutAlt className="h-6 w-6" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom Section (User Info) */}
      <div className="p-4 flex flex-col items-center border-t border-gray-300">
        <div className="avatar">
          <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        </div>
        <p className="mt-2 text-lg font-semibold">{user?.name || "Cengiz"}</p>
        <p className="text-sm text-gray-500">{user?.surname || "Cokickli"}</p>
      </div>
    </div>
  );
};

export default SidebarMenu;
