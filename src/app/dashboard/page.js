"use client";

import { useSession } from "next-auth/react";
import DashboardContent from "@/components/DashboardContent";

const DashboardPage = () => {
  const { data: session, status } = useSession(); // Access session data
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Laden...</p>
      </div>
    );
  }

  if (!session || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </div>
    );
  }

  return <DashboardContent user={user} />;
};

export default DashboardPage;
