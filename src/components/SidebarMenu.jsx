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
    },
    {
      title: "Firmen",
      href: "/dashboard/firmen",
      icon: <FaBuilding />,
    },
    {
      title: "Demo Calls",
      href: "/dashboard/demo-calls",
      icon: <FaPhone />,
    },
    {
      title: "Aufgaben",
      href: "/dashboard/aufgaben",
      icon: <FaTasks />,
    },
    {
      title: "Support",
      href: "/dashboard/support",
      icon: <FaLifeRing />,
    },
    {
      title: "Logout",
      href: "#", // Use "#" since we're handling logout with onClick
      icon: <FaSignOutAlt />, // Icon for Logout
      isLogout: true, // Mark this as the logout item
    },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" }); // Redirect to /login after sign out
  };

  return (
    <div className="w-64 h-screen bg-base-200 shadow-lg flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Sidebar Title */}
        <div className="p-6 text-center font-bold text-2xl text-primary">
          Webomo Business
        </div>

        {/* Menu Items */}
        <ul className="menu menu-compact p-4 space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.isLogout ? (
                <button
                  onClick={handleLogout} // Call handleLogout for logout
                  className={`flex items-center space-x-4 p-2 rounded-lg text-error hover:bg-error hover:text-white transition-all duration-300`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.title}</span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 p-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-neutral"
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

      {/* Bottom Section (User Info) */}
      <div className="p-4 flex flex-col items-center border-t border-base-300">
        <div className="avatar">
          <div className="w-16 h-16 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase() || "C"}
          </div>
        </div>
        <p className="mt-2 text-lg font-semibold">{user?.name || "Cengiz"}</p>
        <p className="text-sm text-neutral">{user?.surname || "Cokickli"}</p>
      </div>
    </div>
  );
};

export default SidebarMenu;
