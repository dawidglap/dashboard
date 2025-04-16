"use client";

import { useState } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import ProvisionenOverview from "@/components/Commissions/ProvisionenOverview";
import ProvisionenChart from "@/components/Commissions/ProvisionenChart";
// import ProvisionenBreakdown from "@/components/Commissions/ProvisionenBreakdown";
import ProvisionenGrowth from "@/components/Commissions/ProvisionenGrowth";

const Provisionen = () => {
  const [timeframe, setTimeframe] = useState("yearly"); // Default to monthly
  const { chartData, bruttoProvisionen, commissions, loading, error } =
    useFetchProvisionen(timeframe);

  // Dummy calculations (replace with actual logic)
  const growthRate = bruttoProvisionen > 0 ? Math.random() * 10 - 5 : 0; // Example: Random % change between -5% and +5%
  // const projectedProvisionen = bruttoProvisionen * 1.1; // Example: +10% growth assumption

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const timeframeLabel = {
    
    
    monthly: "Monatlich",
    yearly: "Jährlich",
  }[timeframe];

  return (
    <div className="min-h-screen p-6 grid grid-cols-12 gap-4 bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">
      {/* ✅ Modern Timeframe Selector */}
      <div className="col-span-12 flex justify-between mb-4">
        <h1 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
          Provisionen
        </h1>
        <div className="my-auto">
          <div className="flex h-10 space-x-2 bg-base-200 p-2 px-6 rounded-full shadow">
            {[  "monthly", "yearly"].map((option) => (
              <button
                key={option}
                className={`badge px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  timeframe === option
                    ? "bg-indigo-300 text-black  "
                    : "text-gray-600 hover:bg-gray-300 hover:text-black"
                }`}
                onClick={() => setTimeframe(option)}
              >
                { 
                  option === "monthly"
                  ? "Monatlich"
                  : "Jährlich"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Top Widgets (Balanced 4-4-4 Layout) */}
      {/* <div className="col-span-12 md:col-span-6">
        <ProvisionenOverview
          commissions={commissions}
          timeframeLabel={timeframeLabel}
          timeframe={timeframe}
        />
      </div> */}

      {/* <div className="col-span-12 md:col-span-6">
        <ProvisionenGrowth growthRate={growthRate} />
      </div> */}

      {/* ✅ Commission Chart */}
      <div className="col-span-12 ">
        <ProvisionenChart chartData={chartData} timeframe={timeframe} />
      </div>

      {/* ✅ Commission Breakdown Table */}
      {/* <div className="col-span-12">
        <ProvisionenBreakdown commissions={commissions} />
      </div> */}
    </div>
  );
};

export default Provisionen;

// just some text to commit 