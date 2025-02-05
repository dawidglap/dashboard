"use client";

import { SessionProvider } from "next-auth/react";
import SidebarMenu from "@/components/SidebarMenu";

const DashboardLayout = ({ children }) => {
  return (
    <SessionProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <SidebarMenu />

        {/* Main Content */}
        <div className="flex-1 ">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default DashboardLayout;
