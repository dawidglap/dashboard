"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardContent from "@/components/DashboardContent";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies/all");
        if (!res.ok) throw new Error("Fehler beim Laden der Firmen.");
        const data = await res.json();
        setCompanies(data.data || []);
      } catch (err) {
        console.error("❌ Fehler beim Abrufen der Firmen:", err.message);
        setError(err.message);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [user]);

  if (status === "loading" || loadingCompanies) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
        <br />
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </div>
    );
  }

  return <DashboardContent user={user} companies={companies} />;
};

export default DashboardPage;
