"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBuilding,
  FaPhone,
  FaTasks,
  FaLifeRing,
  FaSignOutAlt,
  FaChevronRight,
  FaChevronLeft,
  FaChevronDown,
  FaQuestionCircle,
  FaUser,
} from "react-icons/fa";

const SidebarMenu = () => {
  const [expanded, setExpanded] = useState(false);
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { title: "Dashboard", href: "/dashboard", icon: <FaHome /> },
    { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
    { title: "Demo Calls", href: "/dashboard/demo-calls", icon: <FaPhone /> },
    { title: "Support", href: "/dashboard/support", icon: <FaLifeRing /> },
    {
      title: "Aufgaben",
      href: "/dashboard/aufgaben",
      icon: <FaTasks />,
      isDropdown: true,
      subItems: [
        { title: "Alle Aufgaben", href: "/dashboard/aufgaben" },
        { title: "Meine Aufgaben", href: "/dashboard/aufgaben/meine" },
        { title: "Erledigt", href: "/dashboard/aufgaben/erledigt" },
      ],
    },
  ];

  return (
    <div
      className={` h-screen bg-white dark:bg-gray-900 border-r-2  border-indigo-200 shadow-lg flex flex-col py-4 transition-all duration-300 ${
        expanded ? "w-60 px-4   " : "w-16 pr-1 pl-1"
      }`}
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
      <nav className="mt-6 w-full">
        <ul className="flex flex-col space-y-3">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.isDropdown ? (
                <div className="flex flex-col">
                  <button
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition ${
                      pathname.startsWith(item.href)
                        ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setTasksExpanded(!tasksExpanded)}
                  >
                    <div className="flex items-center">
                      <span className="text-lg">{item.icon}</span>
                      {expanded && (
                        <span className="ml-4 text-sm font-bold">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {expanded && (
                      <FaChevronDown
                        className={`transition ${
                          tasksExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {tasksExpanded && expanded && (
                    <ul className="pl-8 mt-2 space-y-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-lg  text-sm transition ${
                              pathname === subItem.href
                                ? "bg-indigo-200 text-indigo-700 dark:bg-indigo-800"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center w-full text-sm font-bold px-4 py-2 rounded-lg transition ${
                    pathname === item.href
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {expanded && <span className="ml-4">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Help & Logout Section */}
      <div className="mt-auto w-full">
        <Link
          href="/help"
          className="flex items-center px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FaQuestionCircle className="text-md" />
          {expanded && <span className="ml-4">Help</span>}
        </Link>
        <button className="flex items-center w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition">
          <FaSignOutAlt className="text-md" />
          {expanded && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
