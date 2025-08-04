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
import { useEffect, useState, useMemo } from "react";

const ProvisionenChart = ({ chartData, timeframe }) => {
  const { data: session } = useSession();
  const isMarkenbotschafter = session?.user?.role === "markenbotschafter";
  const isManager = session?.user?.role === "manager";

  const [mbEarningsMap, setMbEarningsMap] = useState({});

  useEffect(() => {
    const fetchMB = async () => {
      try {
        const res = await fetch(`/api/users/${session?.user?._id}/markenbotschafter`);
        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          const mbs = data.users;

          const earningsMap = {};
          chartData.forEach((entry) => {
            earningsMap[entry.period] = 0;
          });

          for (const mb of mbs) {
            const createdAt = new Date(mb.createdAt);

            chartData.forEach((entry) => {
              const [monthStr, yearStr] = entry.period.split(" ");
              const periodDate = new Date(`${monthStr} 1, ${yearStr}`);

              if (
                periodDate.getMonth() === createdAt.getMonth() &&
                periodDate.getFullYear() === createdAt.getFullYear()
              ) {
                earningsMap[entry.period] += 300;
              }
            });

          }

          console.log("✅ MB earnings map (via API):", earningsMap);
          setMbEarningsMap(earningsMap);
        } else {
          console.warn("⚠️ Nessun markenbotschafter trovato");
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden der MB (API):", err);
      }
    };

    if (
      session?.user?.role &&
      session.user.role !== "manager" &&
      session.user.role !== "markenbotschafter"
    ) {
      fetchMB();
    }
  }, [session?.user?._id, session?.user?.role, timeframe, chartData]);





  // ✅ calcolo solo quando la mappa è pronta
  const adjustedChartData = useMemo(() => {
    return chartData.map((entry) => {
      const base =
        isManager || isMarkenbotschafter
          ? Math.round(entry.earnings / 2)
          : entry.earnings;

      const mbE = !isManager && !isMarkenbotschafter
        ? mbEarningsMap[entry.period] || 0
        : 0;

      console.log("📅 entry.period:", entry.period, "→ mbEarnings:", mbE);

      return {
        ...entry,
        earnings: base,
        mbEarnings: mbE,
      };
    });
  }, [chartData, mbEarningsMap, isManager, isMarkenbotschafter]);

  if (!adjustedChartData || adjustedChartData.length < 2) {
    return (
      <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl text-center">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center lg:text-left">
          Provisionen über die Zeit
        </h2>
        <p className="text-gray-500">Nicht genug Daten für das Diagramm.</p>
      </div>
    );
  }

  const xAxisLabel = timeframe === "Monatlich" ? "Monat" : "Jahr";

  return (
    <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center lg:text-left">
        Provisionen über die Zeit
      </h2>
      <div className="h-[60vh]">
        <ResponsiveContainer width="100%" height="100%">
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
              formatter={(value, name) => {
                const labelMap = {
                  earnings: "Provisionen",
                  mbEarnings: "MB Fixe Provisionen",
                };
                return [`CHF ${value.toLocaleString("de-DE")}`, labelMap[name] || name];
              }}
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
    </div>
  );
};

export default ProvisionenChart;
