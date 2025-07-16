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
  FaLink
} from "react-icons/fa";
import SidebarLogout from "./Sidebar/SidebarLogout";
import { GoDownload } from "react-icons/go";


const SidebarMenu = ({ isOpen, onClose }) => {

  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
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
      {
        title: (
          <div className="flex items-center gap-2">
            <span>Aufgaben</span>
            {pendingCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {pendingCount}
              </span>

            )}
          </div>
        ),
        href: "/dashboard/aufgaben",
        icon: <FaTasks />,

      },
      ...(user.role === "admin"
        ? [{ title: "Affiliate-Klicks", href: "/dashboard/ref", icon: <FaLink /> }]
        : []),

      { title: "Materialien", href: "/dashboard/materialien", icon: <GoDownload /> },
    ];
  }

  const fetchPendingCount = async () => {
    if (!user) return; // 👈 evita fetch se user non è ancora pronto

    try {
      const res = await fetch("/api/notifications/tasks-pending");
      const data = await res.json();
      if (res.ok) {
        setPendingCount(data.count || 0);
      } else {
        console.warn("❌ Failed to load pending tasks notification");
      }
    } catch (err) {
      console.error("❌ Error loading notification:", err);
    }
  };


  useEffect(() => {

    if (!loading && user) {
      fetchPendingCount();
    }
  }, [loading, user]);

  useEffect(() => {
    const handleStatusChange = () => {
      if (user) {
        fetchPendingCount(); // ✅ ora user è accessibile
      } else {
        // ⏳ Se user non è ancora pronto, ritenta tra 100ms
        const retryInterval = setInterval(() => {
          if (user) {
            fetchPendingCount();
            clearInterval(retryInterval);
          }
        }, 100);
      }
    };

    window.addEventListener("taskStatusUpdated", handleStatusChange);
    return () => {
      window.removeEventListener("taskStatusUpdated", handleStatusChange);
    };
  }, [user]); // ✅ aggiunto user nelle dipendenze



  // Funzione per determinare se l’item è attivo
  const isActive = (href) => pathname?.startsWith(href);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ duration: 0.175 }}
      className={`
      fixed top-0 left-0 h-screen 
      w-full md:w-64 
      z-[100]
      bg-base-100
      border-r shadow-lg 
      flex flex-col overflow-y-auto 
      md:translate-x-0
    `}
    >


      {/* 👤 Profilo utente in alto su mobile */}
      <div className="md:hidden pt-16 pb-4 px-4 border-b">
        <SidebarProfile user={user} loading={loading} />
      </div>

      {/* 🖋️ Branding desktop */}
      <div className="hidden md:flex items-center justify-center pt-6">
        <h2 className="text-xl font-extrabold text-base-content">
          Webomo Business
        </h2>
      </div>

      {/* 📌 Navigazione */}
      <nav className="mt-4 md:mt-6 flex-grow px-2 md:px-0">
        <ul className="flex flex-col space-y-1">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              active={isActive(item.href)}
              onClick={onClose} // ✅ chiude menu mobile
            />
          ))}


          <SidebarDropdown />

          <SidebarItem
            title="Support"
            href="/dashboard/hilfe"
            icon={<FaQuestionCircle />}
            active={isActive("/dashboard/hilfe")}
          />
        </ul>

        <div className="mt-4 md:mt-6">
          <SidebarLogout />
        </div>
      </nav>

      {/* 👤 Profilo in basso solo su desktop */}
      <div className="hidden md:block mt-auto px-4 pb-4">
        <SidebarProfile user={user} loading={loading} />
      </div>
    </motion.div>
  );

};

export default SidebarMenu;
