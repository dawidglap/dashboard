"use client";

import { useState } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import ProvisionenChart from "@/components/Commissions/ProvisionenChart";
import MarkenbotschafterProvisionenChart from "@/components/Commissions/MarkenbotschafterProvisionenChart";

const Provisionen = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [selectedChart, setSelectedChart] = useState("gesamt"); // "gesamt" | "mb"

  const { chartData, bruttoProvisionen, commissions, loading, error } =
    useFetchProvisionen(timeframe);

  const growthRate = bruttoProvisionen > 0 ? Math.random() * 10 - 5 : 0;

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
      {/* ✅ Header + Selectors */}
      <div className="col-span-12 flex flex-col md:flex-row justify-between gap-4 mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
          Provisionen
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Timeframe Selector */}
          <div className="flex h-10 space-x-2 bg-base-200 p-2 px-6 rounded-full shadow">
            {["monthly", "yearly"].map((option) => (
              <button
                key={option}
                className={`badge px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  timeframe === option
                    ? "bg-indigo-300 text-black"
                    : "text-gray-600 hover:bg-gray-300 hover:text-black"
                }`}
                onClick={() => setTimeframe(option)}
              >
                {option === "monthly" ? "Monatlich" : "Jährlich"}
              </button>
            ))}
          </div>

          {/* Chart Type Toggle */}
          <div className="flex h-10 space-x-2 bg-base-200 p-2 px-6 rounded-full shadow">
            {[
              { key: "gesamt", label: "Gesamt Provisionen" },
              { key: "mb", label: "Nur MB Provisionen" },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`badge px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  selectedChart === key
                    ? "bg-blue-400 text-black"
                    : "text-gray-600 hover:bg-gray-300 hover:text-black"
                }`}
                onClick={() => setSelectedChart(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Conditional Chart */}
      <div className="col-span-12">
        {selectedChart === "gesamt" ? (
          <ProvisionenChart
            chartData={chartData}
            timeframe={timeframe === "monthly" ? "Monatlich" : "Jährlich"}
          />
        ) : (
          <MarkenbotschafterProvisionenChart timeframe={timeframe} />
        )}
      </div>
    </div>
  );
};

export default Provisionen;
