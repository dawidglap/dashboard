"use client";

import { useSession } from "next-auth/react";
import DashboardContent from "@/components/DashboardContent";

const DashboardPage = () => {
  const { data: session, status } = useSession(); // Access session data
  const user = session?.user;

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!session || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
        <br />
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </div>
    );
  }

  return <DashboardContent user={user} />;
};

export default DashboardPage;
