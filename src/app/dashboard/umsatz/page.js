"use client";

import { useState } from "react";
import useFetchEarnings from "@/hooks/useFetchEarnings";
import EarningsOverview from "@/components/Earnings/EarningsOverview";
import EarningsChart from "@/components/Earnings/EarningsChart";
import EarningsBreakdown from "@/components/Earnings/EarningsBreakdown";
import GrowthRateWidget from "@/components/Earnings/GrowthRateWidget";
import ProjectedRevenueWidget from "@/components/Earnings/ProjectedRevenueWidget";

const Earnings = () => {
  const [timeframe, setTimeframe] = useState("monthly"); // Default to monthly
  const { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error } =
    useFetchEarnings(timeframe);

  if (loading) return <p>Loading earnings data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // ✅ Convert timeframe to German for widget titles
  const timeframeLabel =
    {
      daily: "Tag",
      weekly: "Woche",
      monthly: "Monat",
      yearly: "Jahr",
    }[timeframe] || "Zeitraum"; // ✅ Default fallback

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      {/* ✅ Modern Timeframe Selector */}
      <div className="col-span-12 flex justify-end mb-4">
        <div className="flex space-x-2 bg-base-200 p-2 px-6 rounded-full shadow">
          {["daily", "weekly", "monthly", "yearly"].map((option) => (
            <button
              key={option}
              className={`badge px-4 py-2 text-sm font-semibold rounded-full ${
                timeframe === option
                  ? "bg-indigo-300 text-black"
                  : "text-gray-600"
              }`}
              onClick={() => setTimeframe(option)}
            >
              {option === "daily"
                ? "Täglich"
                : option === "weekly"
                ? "Wöchentlich"
                : option === "monthly"
                ? "Monatlich"
                : "Jährlich"}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Brutto Umsatz, Steuer, Netto Umsatz (Now Displays Selected Timeframe) */}
      <div className="col-span-12 md:col-span-5">
        <EarningsOverview
          bruttoUmsatz={bruttoUmsatz}
          timeframeLabel={timeframeLabel}
        />
      </div>

      {/* Earnings Breakdown */}
      <div className="col-span-12 md:col-span-5">
        <EarningsBreakdown />
      </div>

      {/* Growth Rate Widget */}
      <div className="col-span-12 md:col-span-2">
        <GrowthRateWidget
          bruttoUmsatz={bruttoUmsatz}
          lastMonthUmsatz={lastMonthUmsatz}
        />
      </div>

      {/* Projected Revenue Widget */}
      {/* <div className="col-span-12 md:col-span-2">
        <ProjectedRevenueWidget bruttoUmsatz={bruttoUmsatz} />
      </div> */}

      {/* Earnings Chart */}
      <div className="col-span-12">
        <EarningsChart chartData={chartData} timeframe={timeframe} />
      </div>
    </div>
  );
};

export default Earnings;
