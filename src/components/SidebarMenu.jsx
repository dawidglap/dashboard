"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaQuestionCircle,
  FaMoneyBillWave,
  FaUser,
} from "react-icons/fa";

const SidebarMenu = ({ onLogout }) => {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "Home", href: "/dashboard", icon: <FaHome /> },
    { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
    { title: "Team", href: "/dashboard/team", icon: <FaUsers /> },
    { title: "Umsatz", href: "/dashboard/umsatz", icon: <FaChartBar /> },
    {
      title: "Provisionen",
      href: "/dashboard/provisionen",
      icon: <FaMoneyBillWave />,
    },
    { title: "Aufgaben", href: "/dashboard/aufgaben", icon: <FaTasks /> },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-200 dark:bg-gray-900 border-r-2 border-indigo-200 shadow-lg flex flex-col py-4 
      transition-all duration-300 ${expanded ? "w-60 px-4" : "w-16 pr-1 pl-1"}`}
    >
      {/* Logo & Expand Button */}
      <div className="flex items-center justify-between w-full px-4">
        {expanded && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Webomo <br /> Business
          </h2>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {expanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center">
          <FaUser />
        </div>
        {expanded && (
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              User Name
            </p>
            <p className="text-xs text-gray-500">Role</p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-grow">
        <ul className="flex flex-col space-y-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center w-full text-sm font-bold px-4 py-2 rounded-lg transition 
                ${
                  pathname === item.href
                    ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {expanded && <span className="ml-4">{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Help & Logout */}
      <div className="mt-auto w-full">
        <Link
          href="/help"
          className="flex items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FaQuestionCircle className="text-md" />
          {expanded && <span className="ml-4">Help</span>}
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition"
        >
          <FaSignOutAlt className="text-md" />
          {expanded && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
