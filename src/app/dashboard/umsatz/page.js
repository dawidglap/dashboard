"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetchEarnings from "@/hooks/useFetchEarnings";
import EarningsOverview from "@/components/Earnings/EarningsOverview";
import EarningsChart from "@/components/Earnings/EarningsChart";
import EarningsBreakdown from "@/components/Earnings/EarningsBreakdown";
import GrowthRateWidget from "@/components/Earnings/GrowthRateWidget";

const Earnings = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error } =
    useFetchEarnings(timeframe);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const timeframeLabel = {
    monthly: "Monat",
    yearly: "Jahr",
  }[timeframe] || "Zeitraum";

  return (
    <div className="overflow-x-hidden p-6 grid grid-cols-12 gap-4 bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">

      {/* Titolo + Selettori */}
      <div className="col-span-12 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        {/* Titolo */}
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-extrabold text-base-content text-center lg:text-left">
          Umsatz
        </h1>

        {/* Timeframe Toggle */}
        <div className="flex w-full lg:w-auto justify-center lg:justify-end">
          <div className="flex w-full sm:w-auto justify-center sm:justify-start gap-2 bg-gray-100 rounded-full p-1">
            {["monthly", "yearly"].map((option) => (
              <motion.button
                key={option}
                className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  timeframe === option
                    ? "bg-indigo-300 text-black"
                    : "bg-white text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setTimeframe(option)}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {option === "monthly" ? "Monatlich" : "Jährlich"}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Content */}
      <AnimatePresence mode="wait">
        {/* Overview */}
        <motion.div
          key={`overview-${timeframe}`}
          className="col-span-12 md:col-span-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <EarningsOverview
            bruttoUmsatz={bruttoUmsatz}
            timeframe={timeframe}
            timeframeLabel={timeframeLabel}
          />
        </motion.div>

        {/* Breakdown */}
        <motion.div
          key={`breakdown-${timeframe}`}
          className="col-span-12 md:col-span-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <EarningsBreakdown
            timeframe={timeframe}
            timeframeLabel={timeframeLabel}
          />
        </motion.div>

        {/* Chart */}
        <motion.div
          key={`chart-${timeframe}`}
          className="col-span-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <EarningsChart chartData={chartData} timeframe={timeframe} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Earnings;
