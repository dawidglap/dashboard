"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardContent from "@/components/DashboardContent";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const [companies, setCompanies] = useState([]);
  const [commissions, setCommissions] = useState([]); // ⬅️ aggiunto
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingCommissions, setLoadingCommissions] = useState(true); // ⬅️ aggiunto
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    // Fetch companies
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

    // Fetch commissions
    const fetchCommissions = async () => {
      try {
        const res = await fetch("/api/commissions");
        if (!res.ok) throw new Error("Fehler beim Laden der Provisionen.");
        const data = await res.json();
        setCommissions(data.commissions || []);
      } catch (err) {
        console.error("❌ Fehler beim Abrufen der Provisionen:", err.message);
      } finally {
        setLoadingCommissions(false);
      }
    };

    fetchCompanies();
    fetchCommissions();
  }, [user]);

  // Mostra loading finché uno dei due non è pronto
  if (status === "loading" || loadingCompanies || loadingCommissions) {
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

  return (
    <DashboardContent
      user={user}
      companies={companies}
      commissions={commissions}
    />
  );
};

export default DashboardPage;
