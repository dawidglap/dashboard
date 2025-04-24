"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const ProvisionenChart = ({ chartData, timeframe }) => {
  const { data: session } = useSession();
  const isMarkenbotschafter = session?.user?.role === "markenbotschafter";
  const isManager = session?.user?.role === "manager";

  const [mbEarningsMap, setMbEarningsMap] = useState({});

  useEffect(() => {
    const fetchMB = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          const mbs = data.users.filter((u) => u.role === "markenbotschafter");

          const earningsMap = {};
          const monthNames = [
            "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
            "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"
          ];

          for (const mb of mbs) {
            const createdAt = new Date(mb.createdAt);
            const year = createdAt.getFullYear();
            const month = createdAt.getMonth(); // 0-based
            let key = "";

            if (timeframe === "Jährlich") {
              key = `${year}`;
            } else if (timeframe === "Monatlich") {
              key = monthNames[month]; // es. "Mär"
            }

            if (!earningsMap[key]) earningsMap[key] = 0;
            earningsMap[key] += 300;
          }

          setMbEarningsMap(earningsMap);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der MB:", err);
      }
    };

    if (!isManager && !isMarkenbotschafter) {
      fetchMB();
    }
  }, [isManager, isMarkenbotschafter, timeframe]);

  const adjustedChartData = chartData.map((entry) => {
    const base =
      isManager || isMarkenbotschafter
        ? Math.round(entry.earnings / 2)
        : entry.earnings;

    const mbE = !isManager && !isMarkenbotschafter
      ? mbEarningsMap[entry.period] || 0
      : 0;

    return {
      ...entry,
      earnings: base,
      mbEarnings: mbE,
    };
  });

  if (!adjustedChartData || adjustedChartData.length < 2) {
    return (
      <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">Provisionen über die Zeit</h2>
        <p className="text-gray-500">Nicht genug Daten für das Diagramm.</p>
      </div>
    );
  }

  const xAxisLabel = timeframe === "Monatlich" ? "Monat" : "Jahr";

  return (
    <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Provisionen über die Zeit</h2>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart
          data={adjustedChartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            tickFormatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
              padding: "10px",
            }}
            formatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
            labelFormatter={(label) => `${xAxisLabel}: ${label}`}
          />

          <defs>
            <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#55e389" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorMB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorCommissions)"
            dot={{ r: 4, strokeWidth: 2, fill: "#16a34a" }}
            activeDot={{ r: 6, fill: "#166534" }}
          />

          {!isManager && !isMarkenbotschafter && (
            <Area
              type="monotone"
              dataKey="mbEarnings"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorMB)"
              dot={{ r: 4, strokeWidth: 2, fill: "#2563eb" }}
              activeDot={{ r: 6, fill: "#1d4ed8" }}
            />
          )}

          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={(value) =>
              value === "earnings"
                ? "Provisionen (CHF)"
                : value === "mbEarnings"
                  ? "MB Provisionen Fix (CHF)"
                  : value
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProvisionenChart;
