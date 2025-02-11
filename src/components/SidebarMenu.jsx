"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SidebarItem from "./sidebar/SidebarItem";
import SidebarDropdown from "./sidebar/SidebarDropdown";
import SidebarProfile from "./sidebar/SidebarProfile";
import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaTasks,
  FaVideo,
  FaQuestionCircle,
} from "react-icons/fa";
import SidebarLogout from "./Sidebar/SidebarLogout";

const SidebarMenu = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const isAdmin = user?.role === "admin";

  const menuItems = [
    { title: "Home", href: "/dashboard", icon: <FaHome /> },

    // Admin-only pages
    ...(isAdmin
      ? [
          { title: "Firmen", href: "/dashboard/firmen", icon: <FaBuilding /> },
          {
            title: "Demo Calls",
            href: "/dashboard/demo-calls",
            icon: <FaVideo />,
          },
          { title: "Umsatz", href: "/dashboard/umsatz", icon: <FaChartBar /> },
          { title: "Team", href: "/dashboard/team", icon: <FaUsers /> }, // ✅ Only Admins
        ]
      : []),

    // Visible to Everyone
    { title: "Aufgaben", href: "/dashboard/aufgaben", icon: <FaTasks /> },
    { title: "Support", href: "/dashboard/hilfe", icon: <FaQuestionCircle /> },
  ];

  return (
    <motion.div className="fixed top-0 left-0 h-screen w-64 z-[100] border-r shadow-lg flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center justify-center">
        <h2 className="text-xl font-extrabold text-base-content">
          Webomo Business
        </h2>
      </div>

      <nav className="mt-6 flex-grow">
        <ul className="flex flex-col space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
          <SidebarDropdown />
        </ul>
        <SidebarLogout />
      </nav>

      <SidebarProfile user={user} loading={loading} />
    </motion.div>
  );
};

export default SidebarMenu;
