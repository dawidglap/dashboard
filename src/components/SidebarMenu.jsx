"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react"; // Import signOut

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

  const isActive = (route) => {
    if (route === "/dashboard") {
      // Highlight Home only for exact match
      return pathname === route;
    }
    // Highlight other items if the path starts with their respective route
    return pathname.startsWith(route);
  };

  const menuItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: <FaHome />,
      color: "text-blue-500",
      activeBg: "bg-blue-100",
    },
    {
      title: "Firmen",
      href: "/dashboard/firmen",
      icon: <FaBuilding />,
      color: "text-green-500",
      activeBg: "bg-green-100",
    },
    {
      title: "Demo Calls",
      href: "/dashboard/demo-calls",
      icon: <FaPhone />,
      color: "text-indigo-500",
      activeBg: "bg-indigo-100",
    },
    {
      title: "Aufgaben",
      href: "/dashboard/aufgaben",
      icon: <FaTasks />,
      color: "text-yellow-500",
      activeBg: "bg-yellow-100",
    },
    {
      title: "Support",
      href: "/dashboard/support",
      icon: <FaLifeRing />,
      color: "text-gray-500",
      activeBg: "bg-gray-100",
    },
    {
      title: "Logout",
      href: "#", // Use "#" since we're handling logout with onClick
      icon: <FaSignOutAlt />,
      color: "text-red-500",
      activeBg: "bg-red-100",
      isLogout: true, // Mark this as the logout item
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to /login after sign out
  };

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
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`flex items-center space-x-4 rounded-lg ${
                isActive(item.href) ? item.activeBg : "hover:bg-gray-100"
              }`}
            >
              {item.isLogout ? (
                <button
                  onClick={handleLogout} // Call handleLogout for logout
                  className="flex items-center space-x-4 p-2 w-full"
                >
                  <div className={`${item.color} h-6 w-6`}>{item.icon}</div>
                  <span className="font-semibold text-red-500">
                    {item.title}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-4 p-2 w-full"
                >
                  <div className={`${item.color} h-6 w-6`}>{item.icon}</div>
                  <span
                    className={`${
                      isActive(item.href)
                        ? "font-bold text-black"
                        : "text-gray-700"
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              )}
            </li>
          ))}
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
