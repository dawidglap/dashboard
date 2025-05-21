"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const UmsatzWidget = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Auto-refresh ogni minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeframe((prev) => prev); // Trigger aggiornamento
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUmsatzData = async () => {
      try {
        const response = await fetch("/api/companies/all");
        const data = await response.json();
        const companies = data?.data || [];

        const earningsByMonth = Array(12).fill(0);
        let total = 0;
        let net = 0;

        companies.forEach((company) => {
          const earnings =
            company.plan === "BASIC"
              ? 299 * 12 * 1.081
              : company.plan === "PRO"
                ? 399 * 12 * 1.081
                : company.plan === "BUSINESS" && company.plan_price
                  ? parseFloat(company.plan_price)
                  : 0;

          const commission = 1000;
          total += earnings;
          net += earnings - commission;

          const startDate = new Date(company.createdAt || company.created_at);
          const month = startDate.getMonth(); // 0-11

          if (month >= 0 && month < 12) {
            earningsByMonth[month] += earnings / 12; // distribuzione semplificata
          }
        });

        setBruttoUmsatz(total);
        setNettoUmsatz(net);

        const chartFormatted = earningsByMonth.map((value, idx) => ({
          period: new Date(2025, idx).toLocaleString("de-DE", {
            month: "short",
          }),
          earnings: Math.round(value),
        }));

        setChartData(chartFormatted);
      } catch (err) {
        console.error("❌ Umsatz Fetch Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUmsatzData();
  }, [timeframe]);

  return (
    <div className="border-2 border-white p-4 rounded-xl shadow-xl flex flex-col h-full">
      <Link href="/dashboard/umsatz" className="flex flex-col space-y-4">
        <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">
          Umsatz
        </h2>
        <p className="text-2xl font-bold text-green-500">
          {loading
            ? "Loading..."
            : `CHF ${Math.round(bruttoUmsatz).toLocaleString("de-DE")}`}
        </p>

        {/* <p className="text-sm text-gray-600">
          Netto Umsatz:{" "}
          {loading
            ? "..."
            : `CHF ${Math.round(nettoUmsatz).toLocaleString("de-DE")}`}
        </p> */}

        {/* ✅ Grafico Mini come ProvisionenWidget */}
        <div className="mt-auto h-24">
          {chartData && chartData.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="period" hide />
                <YAxis hide />
                {/* <Tooltip
                  formatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
                /> */}
                <defs>
                  <linearGradient id="colorUmsatz" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorUmsatz)"
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
      <Link
        href="/dashboard/umsatz"
        className="mt-8 inline-flex items-center justify-center w-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:from-indigo-500 dark:to-purple-400"
      >
        Umsatz anzeigen →
      </Link>
    </div>
  );
};

export default UmsatzWidget;
