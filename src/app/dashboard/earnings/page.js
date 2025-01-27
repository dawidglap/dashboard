"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Earnings = () => {
  const [chartData, setChartData] = useState([]);
  const [bruttoUmsatz, setBruttoUmsatz] = useState(0);
  const [gesamtProvisionen, setGesamtProvisionen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real data from the database
  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Error fetching companies data.");
        const data = await response.json();

        let totalEarnings = 0;
        let totalCommissions = 0;

        // Process data to create chart data
        const formattedData = data.data.map((company) => {
          const createdAt = new Date(company.created_at);
          const earnings =
            company.plan === "BASIC"
              ? 799 * 12 * 1.081 // BASIC plan price (yearly + tax)
              : company.plan === "PRO"
              ? 899 * 12 * 1.081 // PRO plan price (yearly + tax)
              : company.plan === "BUSINESS" && company.plan_price
              ? parseFloat(company.plan_price) // Custom BUSINESS plan price
              : 0; // Default earnings if no plan price

          const commission =
            company.plan === "BASIC"
              ? 700
              : company.plan === "PRO"
              ? 800
              : company.plan === "BUSINESS"
              ? 1000
              : 0; // Default commission

          totalEarnings += earnings;
          totalCommissions += commission;

          return {
            month: `${createdAt.toLocaleString("de-DE", {
              month: "short",
            })} '${createdAt.getFullYear().toString().slice(-2)}`,
            commissions: commission,
            earnings: earnings - commission, // Net earnings (above commissions)
          };
        });

        // Update state
        setChartData(formattedData);
        setBruttoUmsatz(totalEarnings);
        setGesamtProvisionen(totalCommissions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, []);

  if (loading) return <p>Loading earnings data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {/* Bruttoumsatz */}
      <h1 className="text-4xl font-bold mb-6">
        Bruttoumsatz: CHF{" "}
        <span className="text-[#8B5CF6]">
          {Math.round(bruttoUmsatz).toLocaleString("de-DE")}
        </span>
      </h1>
      {/* Gesamtprovisionen */}
      <h2 className="text-2xl font-semibold mt-6">
        Gesamtprovisionen: CHF{" "}
        <span className="text-success">
          {gesamtProvisionen.toLocaleString("de-DE")}
        </span>
      </h2>

      {/* Stacked Area Chart */}
      <div className="mb-10 mt-10">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 20,
            }}
          >
            {/* Grid */}
            <CartesianGrid horizontal={true} vertical={false} />

            {/* X-Axis */}
            <XAxis
              dataKey="month"
              padding={{ left: 20, right: 20 }}
              tickFormatter={(tick) => tick}
              minTickGap={150}
            />

            {/* Y-Axis */}
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(value) =>
                value === 0
                  ? ""
                  : `CHF ${value >= 1000 ? `${value / 1000}K` : value}`
              }
              allowDecimals={false}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value, name) => {
                if (name === "earnings") {
                  return [`CHF ${value.toLocaleString("de-DE")}`, "Umsatz"];
                } else if (name === "commissions") {
                  return [
                    `CHF ${value.toLocaleString("de-DE")}`,
                    "Provisionen",
                  ];
                }
                return [`CHF ${value.toLocaleString("de-DE")}`, name];
              }}
              labelFormatter={(label) => `Monat: ${label}`} // Optional: Add a label for the month
            />

            {/* Area for Commissions */}
            <Area
              type="monotone"
              dataKey="commissions"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorCommissions)"
              stackId="1"
              name="Provisionen"
            />

            {/* Area for Net Earnings */}
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorEarnings)"
              stackId="1"
              name="Umsatz"
            />

            {/* Gradient for Earnings */}
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>

              {/* Gradient for Commissions */}
              <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Earnings;
