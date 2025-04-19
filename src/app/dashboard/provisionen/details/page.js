"use client";

import { useState, useEffect } from "react";
import ProvisionenBreakdown from "@/components/Commissions/ProvisionenBreakdown";
import { useRouter } from "next/navigation";
import MarkenbotschafterProvisionenTable from "@/components/Commissions/MarkenbotschafterProvisionenTable";
import { motion } from "framer-motion";

const ProvisionenDetails = () => {
  const [commissions, setCommissions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [selectedMB, setSelectedMB] = useState(null);

  const [showAllCompanies, setShowAllCompanies] = useState(true);

  const handleResetToCompanies = () => {
    setSelectedMB(null); // <- questo riporta alla vista iniziale (companie)
  };
  
  


  useEffect(() => {
    const fetchUserAndCommissions = async () => {
      try {
        // Fetch user details
        const userRes = await fetch("/api/users/me");
        if (!userRes.ok) throw new Error("Fehler beim Laden des Benutzers");
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch commissions
        const commissionsRes = await fetch("/api/commissions");
        if (!commissionsRes.ok)
          throw new Error("Fehler beim Laden der Provisionen");
        const commissionsData = await commissionsRes.json();
        setCommissions(commissionsData.commissions || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCommissions();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // ✅ Define the redirect button based on user role
  const isRestricted =
    user?.role === "manager" || user?.role === "markenbotschafter";
  const backButtonText = isRestricted
    ? "← Zurück zu den Aufgaben"
    : "← Zurück zur Übersicht";
  const backButtonLink = isRestricted
    ? "/dashboard/aufgaben"
    : "/dashboard/provisionen";

  return (
    <div className="p-6">
      {/* ✅ Back Button (Dynamic based on user role) */}
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
          Detaillierte Provisionsübersicht
        </h2>
        <button
          onClick={() => router.push(backButtonLink)}
          className="btn btn-sm btn-neutral rounded-full px-4 mt-8 mb-8"
        >
          {backButtonText}
        </button>
      </div>

      {/* ✅ Commission Breakdown Table */}
      <motion.div
  key={selectedMB === null ? "company-table" : "mb-table"} // 👈 importantissimo
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  {selectedMB === null ? (
    <ProvisionenBreakdown
      commissions={commissions}
      selectedMB={selectedMB}
      setSelectedMB={setSelectedMB}
    />
  ) : (
    <MarkenbotschafterProvisionenTable
      selectedMB={selectedMB}
      setSelectedMB={setSelectedMB}
      onResetToCompanies={handleResetToCompanies}
    />
  )}
</motion.div>


    </div>
  );
};

export default ProvisionenDetails;
