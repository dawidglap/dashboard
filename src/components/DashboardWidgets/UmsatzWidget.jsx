"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const UmsatzWidget = () => {
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);
  const [comparisonToLastMonth, setComparisonToLastMonth] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        const companies = data?.data || [];

        let totalEarnings = 0;
        let totalNetEarnings = 0;
        let dailyEarnings = {};

        companies.forEach((company) => {
          const date = new Date(company.created_at);
          const dayKey = date.toISOString().split("T")[0]; // Format YYYY-MM-DD

          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price)
              : 0;

          const commission = 1000; // Assume fixed commission

          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;

          if (!dailyEarnings[dayKey]) {
            dailyEarnings[dayKey] = 0;
          }
          dailyEarnings[dayKey] += earnings;
        });

        const formattedChartData = Object.entries(dailyEarnings).map(
          ([date, earnings]) => ({
            period: date,
            earnings,
          })
        );

        // ✅ Comparison Calculation
        const currentDate = new Date();
        const lastMonthKey = `${currentDate.getFullYear()}-${(
          "0" +
          (currentDate.getMonth() + 1)
        ).slice(-2)}`;
        const earningsLastMonth = dailyEarnings[lastMonthKey] || 0;
        const comparison =
          earningsLastMonth > 0
            ? ((totalEarnings - earningsLastMonth) / earningsLastMonth) * 100
            : 0;

        setBruttoUmsatz(totalEarnings);
        setNettoUmsatz(totalNetEarnings);
        setComparisonToLastMonth(comparison.toFixed(2));
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchEarningsData();
  }, []);

  return (
    <div className="border-2 border-white p-6 rounded-xl shadow-xl flex flex-col h-full">
      <Link href="/dashboard/umsatz" className="flex flex-col space-y-4">
        {/* ✅ Umsatz Title */}
        <div>
          <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">
            Umsatz
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {bruttoUmsatz > 0
              ? `CHF ${Math.round(bruttoUmsatz).toLocaleString("de-DE")}`
              : "Loading..."}
          </p>
        </div>

        {/* ✅ Netto Umsatz & Comparison */}
        <div>
          <p className="text-sm text-gray-600">
            Netto Umsatz:{" "}
            {nettoUmsatz > 0 ? (
              `CHF ${Math.round(nettoUmsatz).toLocaleString("de-DE")}`
            ) : (
              <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>

          {/* ✅ Show comparison (optional) */}
          {/* <p className="text-sm text-gray-600 flex items-center">
            Vergleich:{" "}
            {comparisonToLastMonth > 0 ? (
              <FaArrowUp className="text-green-500 ml-1" />
            ) : comparisonToLastMonth < 0 ? (
              <FaArrowDown className="text-red-500 ml-1" />
            ) : (
              <FaEquals className="text-gray-500 ml-1" />
            )}
            {comparisonToLastMonth}%
          </p> */}
        </div>

        {/* ✅ Umsatz Mini Chart */}
        <div className="h-24 flex items-end justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="period" hide /> {/* Hide X-Axis Labels */}
                <Tooltip
                  formatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
                />
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-base-100 p-4 rounded-2xl text-center">
              <h2 className="text-sm font-bold text-gray-700">
                Umsatz über die Zeit
              </h2>
              <p className="text-gray-500 text-xs">Noch keine Daten.</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default UmsatzWidget;
