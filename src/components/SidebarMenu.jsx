"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

// Import icons from React Icons
import {
  FaHome,
  FaBuilding,
  FaPhone,
  FaTasks,
  FaLifeRing,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const SidebarMenu = () => {
  const { data: session } = useSession(); // Get user session
  const user = session?.user; // Extract user data
  const pathname = usePathname();
  const [tasksExpanded, setTasksExpanded] = useState(
    pathname.startsWith("/dashboard/aufgaben")
  );

  const isActive = (route) => {
    if (route === "/dashboard") return pathname === route;
    return pathname.startsWith(route);
  };

  // Define menu items based on user role
  const menuItems = [
    { title: "Home", href: "/dashboard", icon: <FaHome /> },
    { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
    { title: "Demo Calls", href: "/dashboard/demo-calls", icon: <FaPhone /> },
    { title: "Support", href: "/dashboard/support", icon: <FaLifeRing /> },
  ];

  // Include the "Aufgaben" section for Admins and Managers
  if (user?.role === "admin" || user?.role === "manager") {
    menuItems.push({
      title: "Aufgaben",
      href: "/dashboard/aufgaben",
      icon: <FaTasks />,
      isDropdown: true,
      subItems: [
        { title: "Alle Aufgaben", href: "/dashboard/aufgaben" },
        { title: "Meine Aufgaben", href: "/dashboard/aufgaben/meine" },
        { title: "Erledigt", href: "/dashboard/aufgaben/erledigt" },
      ],
    });
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="w-64 h-screen bg-gray-100 border-r flex flex-col justify-between shadow-lg">
      {/* Top Section */}
      <div>
        <div className="p-6 text-center font-bold text-xl text-gray-800">
          Webomo Business
        </div>

        <ul className="menu p-4 space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.isDropdown ? (
                <>
                  <div
                    className={`flex items-center justify-between space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-blue-500 text-white"
                        : "text-gray-800 hover:bg-gray-300"
                    }`}
                    onClick={() => setTasksExpanded(!tasksExpanded)}
                  >
                    <div className="flex items-center space-x-4">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <FaChevronDown
                      className={`text-sm transition-transform duration-300 ${
                        tasksExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {tasksExpanded && (
                    <ul className="pl-8 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            href={subItem.href}
                            className={`block p-2 rounded-lg transition ${
                              pathname === subItem.href
                                ? "bg-blue-400 text-white"
                                : "hover:bg-gray-200"
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-300 transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-blue-500 text-white"
                      : "text-gray-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Section (User Info + Logout) */}
      <div className="p-4 flex flex-col items-center border-t border-gray-300">
        <div className="avatar">
          <div className="w-16 h-16 rounded-full bg-gray-700 text-white flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || "C"}
          </div>
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-800">
          {user?.name || "Cengiz"}
        </p>
        <p className="text-sm text-gray-600">{user?.surname || "Cokickli"}</p>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <FaSignOutAlt className="inline mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
