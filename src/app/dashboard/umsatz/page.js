"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetchEarnings from "@/hooks/useFetchEarnings";
import EarningsOverview from "@/components/Earnings/EarningsOverview";
import EarningsChart from "@/components/Earnings/EarningsChart";
import EarningsBreakdown from "@/components/Earnings/EarningsBreakdown";
import GrowthRateWidget from "@/components/Earnings/GrowthRateWidget";

const Earnings = () => {
  const [timeframe, setTimeframe] = useState("yearly"); // Default to monthly
  const { chartData, bruttoUmsatz, lastMonthUmsatz, loading, error } =
    useFetchEarnings(timeframe);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // ✅ Convert timeframe to German for widget titles
  const timeframeLabel =
    {
      // daily: "Tag",
      
      monthly: "Monat",
      yearly: "Jahr",
    }[timeframe] || "Zeitraum"; // ✅ Default fallback

  return (
    <div className="p-6 grid grid-cols-12 gap-4 bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg shadow-xl">
      {/* ✅ Timeframe Selector with Framer Motion */}
      <div className="col-span-12 flex justify-between mb-4">
        <h1 className="text-3xl md:text-4xl mt-8 mb-8 font-extrabold text-base-content">
          Umsatz
        </h1>
        <div className="my-auto">
          <div className="flex space-x-2 bg-base-200 p-2 px-6 rounded-full shadow">
            {[ "monthly", "yearly"].map((option) => (
              <motion.button
                key={option}
                className={`badge px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                  timeframe === option
                    ? "bg-indigo-400 text-white shadow-lg"
                    : "text-gray-600"
                }`}
                onClick={() => setTimeframe(option)}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {
                 option === "monthly"
                  ? "Monatlich"
                  : "Jährlich"}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ Animated Content Section */}
      <AnimatePresence mode="wait">
        {/* Earnings Overview */}
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

        {/* Earnings Breakdown */}
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

        {/* Earnings Chart */}
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
