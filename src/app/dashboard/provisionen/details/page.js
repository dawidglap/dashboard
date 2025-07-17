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
  // const [selectedMB, setSelectedMB] = useState("__none__");
  const [filterCompany, setFilterCompany] = useState("");




  const [showAllCompanies, setShowAllCompanies] = useState(true);

  const handleResetToCompanies = () => {
    setShowAllCompanies(true);
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
    ? "← Zurück zur Übersicht"
    : "← Zurück zur Übersicht";
  const backButtonLink = isRestricted
    ? "/dashboard/provisionen"
    : "/dashboard/provisionen";

  return (
    <div className="px-6 lg:px-4 xl:px-6 2xl:px-12">
      {/* ✅ Back Button (Dynamic based on user role) */}
      <div className="flex justify-between mb-2">
        <h2 className="text-xl md:text-4xl text-center sm:text-start mt-8 mb-8 font-extrabold text-base-content">
          Detaillierte Provisionsübersicht
        </h2>
        
        {/* <button
          onClick={() => router.push(backButtonLink)}
          className="btn btn-sm btn-neutral rounded-full px-4 mt-8 mb-8"
        >
          {backButtonText}
        </button> */}
      </div>
<div className="flex flex-col sm:flex-row sm:space-x-2 mb-4 lg:justify-end sm:justify-start justify-center items-center sm:items-start">
  <button
    onClick={() => setShowAllCompanies(true)}
    className={`w-full sm:w-auto p-2 px-4 text-sm rounded-full border ${
      showAllCompanies
        ? "bg-indigo-600 text-white"
        : "bg-indigo-50 text-gray-700"
    } ${showAllCompanies ? "font-semibold" : "font-semibold"} lg:font-normal`}
  >
    Alle Kunden
  </button>

  <button
    onClick={() => setShowAllCompanies(false)}
    className={`w-full sm:w-auto p-2 mt-2 sm:mt-0 px-4 text-sm rounded-full border ${
      !showAllCompanies
        ? "bg-indigo-600 text-white"
        : "bg-indigo-50 text-gray-700"
    } ${!showAllCompanies ? "font-semibold" : "font-semibold"} lg:font-normal`}
  >
    Alle Markenbotschafter
  </button>
</div>





      {/* ✅ Commission Breakdown Table */}
      <motion.div
  key={showAllCompanies ? "company-table" : "mb-table"}// aggiorna key
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
{showAllCompanies ? (
  <ProvisionenBreakdown
  commissions={commissions}
  onResetCompaniesFilter={() => setFilterCompany("")}
/>

) : (
<MarkenbotschafterProvisionenTable
  onResetToCompanies={handleResetToCompanies}
/>
)}


</motion.div>



    </div>
  );
};

export default ProvisionenDetails;
