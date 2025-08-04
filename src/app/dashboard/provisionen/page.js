"use client";

import { useState } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import ProvisionenChart from "@/components/Commissions/ProvisionenChart";
import MarkenbotschafterProvisionenChart from "@/components/Commissions/MarkenbotschafterProvisionenChart";

const Provisionen = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [selectedChart, setSelectedChart] = useState("gesamt");

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
    <div className="min-h-screen p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">
      
      {/* ✅ Header + Selectors */}
    {/* ✅ Header + Selectors */}
<div className="lg:col-span-12 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-4">

  {/* Titolo */}
  <h1 className="text-2xl mt-2 sm:mt-0 sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-base-content text-center lg:text-left">
    Provisionen
  </h1>

  {/* Toggle Container */}
  <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center w-full lg:w-auto">

    {/* Timeframe Toggle */}
    <div className="flex w-full justify-center md:justify-start">
      <div className="flex w-full sm:w-auto justify-center sm:justify-start gap-2 bg-gray-100 rounded-full p-1">
        {["monthly", "yearly"].map((option) => (
          <button
            key={option}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              timeframe === option
                ? "bg-indigo-300 text-black"
                : "bg-white text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setTimeframe(option)}
          >
            {option === "monthly" ? "Monatlich" : "Jährlich"}
          </button>
        ))}
      </div>
    </div>

    {/* Chart Toggle */}
    {/* <div className="flex w-full justify-center md:justify-start">
      <div className="flex w-full sm:w-auto justify-center sm:justify-start gap-2 bg-gray-100 rounded-full p-1">
        {[
          { key: "gesamt", label: "Gesamt Provisionen" },
          { key: "mb", label: "Nur MB Provisionen" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedChart === key
                ? "bg-blue-400 text-black"
                : "bg-white text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedChart(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div> */}
  </div>
</div>


      {/* ✅ Conditional Chart */}
      <div className="md:col-span-12 w-full">
        {/* {selectedChart === "gesamt" ? (
          <ProvisionenChart
            chartData={chartData}
            timeframe={timeframe === "monthly" ? "Monatlich" : "Jährlich"}
          />
        ) : (
          <MarkenbotschafterProvisionenChart timeframe={timeframe} />
        )} */}
        <ProvisionenChart
            chartData={chartData}
            timeframe={timeframe === "monthly" ? "Monatlich" : "Jährlich"}
          />
      </div>
    </div>
  );
};

export default Provisionen;
