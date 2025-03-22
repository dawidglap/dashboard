"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

const UmsatzWidget = () => {
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [nettoUmsatz, setNettoUmsatz] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch("/api/companies/all"); // ✅ Stesso endpoint di FirmenWidget
        const data = await response.json();
        const companies = data?.data || [];

        let monthlyEarnings = Array(12).fill(0); // ✅ Array con 12 mesi inizializzati a 0
        let totalEarnings = 0;
        let totalNetEarnings = 0;

        companies.forEach((company) => {
          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081
              : company.plan === "PRO"
              ? 899 * 12 * 1.081
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price)
              : 0;

          const commission = 1000;
          totalEarnings += earnings;
          totalNetEarnings += earnings - commission;

          // ✅ Distribuiamo i guadagni nel corso dell'anno (ipotizziamo crescita costante)
          for (let i = 0; i < 12; i++) {
            monthlyEarnings[i] += earnings / 12; // Dividiamo equamente nei mesi
          }
        });

        setBruttoUmsatz(totalEarnings);
        setNettoUmsatz(totalNetEarnings);

        // ✅ Creiamo il dataset per il grafico con tutti i mesi
        const chartData = monthlyEarnings.map((earnings, index) => ({
          period: new Date(2025, index).toLocaleString("de-DE", {
            month: "short",
          }),
          earnings,
        }));

        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  return (
    <div className="border-2 border-white p-6 rounded-xl shadow-xl flex flex-col h-full">
      <Link href="/dashboard/umsatz" className="flex flex-col space-y-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">
            Umsatz
          </h2>
          <p className="text-2xl font-bold text-green-500">
            {loading
              ? "Loading..."
              : `CHF ${Math.round(bruttoUmsatz).toLocaleString("de-DE")}`}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            Netto Umsatz:{" "}
            {loading ? (
              <span className="skeleton h-6 w-32 bg-gray-200 rounded animate-pulse"></span>
            ) : (
              `CHF ${Math.round(nettoUmsatz).toLocaleString("de-DE")}`
            )}
          </p>
        </div>

        {/* ✅ Umsatz Mini Chart */}
        <div className="h-24 flex items-end justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="period" hide />
                <Tooltip
                  contentStyle={{ display: "none" }}
                  cursor={{ stroke: "transparent" }}
                />

                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#a5b4fc" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#a5b4fc"
                  strokeWidth={2}
                  fill="url(#colorEarnings)"
                  dot={false}
                  activeDot={false}
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
