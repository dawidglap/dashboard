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
        let monthlyEarnings = {};

        // ✅ Ensure correct date parsing
        companies.forEach((company) => {
          const date = new Date(company.created_at);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price)
              : 0;

          const commission =
            company.plan === "BASIC"
              ? 1000
              : company.plan === "PRO"
              ? 1000
              : company.plan === "BUSINESS"
              ? 1000
              : 0;

          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;

          if (!monthlyEarnings[monthYear]) {
            monthlyEarnings[monthYear] = 0;
          }
          monthlyEarnings[monthYear] += earnings;
        });

        // ✅ Format chart data correctly
        const formattedChartData = Object.entries(monthlyEarnings).map(
          ([month, earnings]) => ({
            month,
            earnings,
          })
        );

        // ✅ Calculate last month comparison correctly
        const currentMonth = new Date();
        const lastMonth = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
        const earningsLastMonth = monthlyEarnings[lastMonth] || 0;
        const comparison =
          earningsLastMonth > 0
            ? ((totalEarnings - earningsLastMonth) / earningsLastMonth) * 100
            : 0;

        // ✅ Set final state values
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
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

        {/* ✅ Umsatz Mini Chart or "Not Enough Data" Message */}
        <div className="h-24 flex items-end justify-center">
          {chartData.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="month" hide />
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
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
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
              <p className="text-gray-500 text-xs">
                Nicht genug Daten für das Diagramm.
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default UmsatzWidget;
