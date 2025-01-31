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
        <div className="flex-1 p-6 bg-slate-100 ">{children}</div>
      </div>
    </SessionProvider>
  );
};

export default DashboardLayout;
