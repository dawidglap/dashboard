"use client";

import SidebarMenu from "@/components/SidebarMenu";

const DashboardLayout = ({ children, user }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <SidebarMenu user={user} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-base-100">{children}</div>
    </div>
  );
};

export default DashboardLayout;
