"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import SidebarToggle from "@/components/Sidebar/SidebarToggle";
import SidebarMenu from "@/components/SidebarMenu";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <SessionProvider>
      {/* Toggle animato visibile solo su mobile */}
      <SidebarToggle isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Sidebar mobile con animazione */}
      <AnimatePresence>
        {isSidebarOpen && (
          <SidebarMenu isOpen={true} onClose={toggleSidebar} />
        )}
      </AnimatePresence>

      {/* Sidebar desktop fissa */}
      <div className="hidden md:block">
        <SidebarMenu isOpen={true} />
      </div>

      {/* Contenuto principale */}
      <main className="flex-1 md:ml-64">{children}</main>
    </SessionProvider>
  );
};

export default DashboardLayout;
