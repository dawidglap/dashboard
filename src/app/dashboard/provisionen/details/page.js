"use client";

import { useState } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import ProvisionenBreakdown from "@/components/Commissions/ProvisionenBreakdown";
import { useRouter } from "next/navigation";

const ProvisionenDetails = () => {
  const [timeframe, setTimeframe] = useState("monthly"); // Default to monthly
  const { commissions, loading, error } = useFetchProvisionen(timeframe);
  const router = useRouter();

  if (loading) return <p>Loading commission data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {/* ✅ Back Button */}
      <div className="flex justify-between mb-4">
        <h2 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
          Detaillierte Provisionsübersicht
        </h2>
        <button
          onClick={() => router.push("/dashboard/provisionen")}
          className="btn btn-sm btn-neutral rounded-full px-4 mt-8 mb-8"
        >
          ← Zurück zur Übersicht
        </button>
      </div>

      {/* ✅ Commission Breakdown Table */}
      <ProvisionenBreakdown commissions={commissions} />
    </div>
  );
};

export default ProvisionenDetails;
