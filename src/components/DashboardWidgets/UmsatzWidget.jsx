"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowUp, FaArrowDown, FaEquals } from "react-icons/fa";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

const UmsatzWidget = () => {
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);
  const [comparisonToLastMonth, setComparisonToLastMonth] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies");
        const data = await response.json();
        const companies = data?.data || [];

        let totalEarnings = 0;
        let totalNetEarnings = 0;

        const tempChartData = companies.map((company) => {
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
              ? 700
              : company.plan === "PRO"
              ? 800
              : company.plan === "BUSINESS"
              ? 1000
              : 0;

          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;

          return {
            month: new Date(company.created_at).toLocaleString("de-DE", {
              month: "short",
            }),
            earnings,
          };
        });

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const lastMonth = new Date(currentYear, currentMonth - 1);

        const earningsLastMonth = tempChartData
          .filter(
            (item) =>
              new Date(item.month).getMonth() === lastMonth.getMonth() &&
              new Date(item.month).getFullYear() === lastMonth.getFullYear()
          )
          .reduce((sum, item) => sum + item.earnings, 0);

        const comparison =
          earningsLastMonth > 0
            ? ((totalEarnings - earningsLastMonth) / earningsLastMonth) * 100
            : 0;

        setBruttoUmsatz(totalEarnings);
        setNettoUmsatz(totalNetEarnings);
        setComparisonToLastMonth(comparison.toFixed(2));
        setChartData(tempChartData);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-green-50 to-green-100 col-span-8 row-span-2">
      <Link href="/dashboard/earnings" className="flex items-start space-x-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-800">Umsatz</h2>
          <p className="text-2xl font-extrabold">
            {bruttoUmsatz > 0 ? (
              `CHF ${Math.round(bruttoUmsatz).toLocaleString("de-DE")}`
            ) : (
              <span className="skeleton h-8 w-24 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
          <p className="text-sm text-gray-600 pt-6">
            {nettoUmsatz > 0 ? (
              `Netto Umsatz: CHF ${Math.round(nettoUmsatz).toLocaleString(
                "de-DE"
              )}`
            ) : (
              <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
            )}
          </p>
          <p className="text-sm text-gray-600">
            Vergleich:
            {comparisonToLastMonth > 0 ? (
              <FaArrowUp className="text-green-500" />
            ) : comparisonToLastMonth < 0 ? (
              <FaArrowDown className="text-red-500" />
            ) : (
              <FaEquals className="text-gray-500" />
            )}
            {comparisonToLastMonth > 0
              ? ` ${comparisonToLastMonth}%`
              : comparisonToLastMonth < 0
              ? ` ${Math.abs(comparisonToLastMonth)}%`
              : " 0%"}
          </p>
        </div>
        <div className="flex-1">
          {chartData.length > 0 && bruttoUmsatz > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#colorEarnings)"
                />
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-[150px] skeleton bg-gray-200 animate-pulse rounded"></div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default UmsatzWidget;
