"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import SidebarItem from "./Sidebar/SidebarItem";
import SidebarDropdown from "./Sidebar/SidebarDropdown";
import SidebarProfile from "./Sidebar/SidebarProfile";
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
import { GoDownload } from "react-icons/go";

const SidebarMenu = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

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

  let menuItems = [];

  if (!loading && user) {
    menuItems = [
      { title: "Home", href: "/dashboard", icon: <FaHome /> },
      { title: "Kunden", href: "/dashboard/firmen", icon: <FaBuilding /> },
      { title: "Demo Calls", href: "/dashboard/demo-calls", icon: <FaVideo /> },
      { title: "Umsatz", href: "/dashboard/umsatz", icon: <FaChartBar /> },
      ...(user.role !== "markenbotschafter"
        ? [{ title: "Team", href: "/dashboard/team", icon: <FaUsers /> }]
        : []),
      { title: "Aufgaben", href: "/dashboard/aufgaben", icon: <FaTasks /> },
      { title: "Materialien", href: "/dashboard/materialien", icon: <GoDownload /> },
    ];
  }


  // Funzione per determinare se l’item è attivo
  const isActive = (href) => pathname?.startsWith(href);

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
            <SidebarItem
              key={index}
              {...item}
              active={isActive(item.href)}
            />
          ))}

          <SidebarDropdown />

          {/* ✅ Support sotto il dropdown */}
          <SidebarItem
            title="Support"
            href="/dashboard/hilfe"
            icon={<FaQuestionCircle />}
            active={isActive("/dashboard/hilfe")}
          />
        </ul>

        <SidebarLogout />
      </nav>

      <SidebarProfile user={user} loading={loading} />
    </motion.div>
  );
};

export default SidebarMenu;
