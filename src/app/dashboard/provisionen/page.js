"use client";

import { useState } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import ProvisionenOverview from "@/components/Commissions/ProvisionenOverview";
import ProvisionenChart from "@/components/Commissions/ProvisionenChart";
import ProvisionenBreakdown from "@/components/Commissions/ProvisionenBreakdown";

const Provisionen = () => {
  const [timeframe, setTimeframe] = useState("monthly"); // Default to monthly
  const { chartData, bruttoProvisionen, commissions, loading, error } =
    useFetchProvisionen(timeframe);

  if (loading) return <p>Loading commission data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const timeframeLabel = {
    daily: "Täglich",
    weekly: "Wöchentlich",
    monthly: "Monatlich",
    yearly: "Jährlich",
  }[timeframe];

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      {/* ✅ Timeframe Selector */}
      <div className="col-span-12 flex justify-end">
        <div className="flex space-x-2 bg-base-200 p-2 rounded-lg shadow">
          {["daily", "weekly", "monthly", "yearly"].map((option) => (
            <button
              key={option}
              className={`px-4 py-2 text-sm font-semibold rounded ${
                timeframe === option
                  ? "bg-[#8B5CF6] text-white"
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

      {/* ✅ Commission Overview */}
      <div className="col-span-12 md:col-span-6">
        <ProvisionenOverview
          bruttoProvisionen={bruttoProvisionen}
          timeframeLabel={timeframeLabel}
        />
      </div>

      {/* ✅ Commission Breakdown (Will be implemented next) */}
      <div className="col-span-12 md:col-span-6">
        <ProvisionenBreakdown />
      </div>

      {/* ✅ Commission Breakdown (Already Implemented) */}
      <div className="col-span-12 md:col-span-6">
        <ProvisionenBreakdown />
      </div>

      {/* 🔍 TEMPORARY DEBUGGING DIV: Display Raw Commissions */}
      <div className="col-span-12 bg-base-200 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">
          🔍 Debugging: Raw Commission Data
        </h2>
        <ul className="text-sm text-gray-700">
          {chartData.length > 0 ? (
            chartData.map((entry, index) => (
              <li key={index} className="border-b py-1">
                <span className="font-semibold">{entry.period}:</span> CHF{" "}
                {entry.earnings.toLocaleString("de-DE")}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Keine Provisionen verfügbar.</p>
          )}
        </ul>
      </div>
      {/* 🔍 TEMPORARY DEBUGGING DIV: Display Commission Details */}
      <div className="col-span-12 bg-base-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">
          🔍 Debugging: Einzelne Provisionen
        </h2>
        <ul className="text-sm text-gray-700">
          {commissions.length > 0 ? (
            commissions.map((commission, index) => (
              <li key={index} className="border-b py-2">
                <span className="font-semibold">{commission.userName}</span>{" "}
                erhielt{" "}
                <span
                  className={
                    commission.amount === 0
                      ? "text-red-500 font-semibold"
                      : "text-green-500 font-semibold"
                  }
                >
                  {commission.amount === 0
                    ? "ADMIN (0 CHF)"
                    : `CHF ${commission.amount.toLocaleString("de-DE")}`}
                </span>{" "}
                für{" "}
                <span className="font-semibold">{commission.companyName}</span>{" "}
                am{" "}
                {new Date(commission.paymentDate).toLocaleDateString("de-DE")}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Keine Provisionen gefunden.</p>
          )}
        </ul>
      </div>

      {/* ✅ Commission Chart */}
      <div className="col-span-12">
        <ProvisionenChart chartData={chartData} timeframe={timeframe} />
      </div>
    </div>
  );
};

export default Provisionen;
