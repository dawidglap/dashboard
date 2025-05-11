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
import { useEffect, useState } from "react";

const MarkenbotschafterProvisionenChart = ({ timeframe }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMB = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();

                if (!data.success || !Array.isArray(data.users)) return;

                const markenbotschafter = data.users.filter(
                    (u) =>
                        u.role === "markenbotschafter" &&
                        u.status_provisionen_markenbotschafter === true
                );

                const monthNames = [
                    "Jan", "Feb", "Mär", "Apr", "Mai", "Jun",
                    "Jul", "Aug", "Sep", "Okt", "Nov", "Dez",
                ];

                const earningsMap = {};
                const now = new Date();
                const nowYear = now.getFullYear();
                const nowMonth = now.getMonth();

                for (const mb of markenbotschafter) {
                    const createdAt = new Date(mb.createdAt);
                    const year = createdAt.getFullYear();
                    const month = createdAt.getMonth();

                    if (timeframe === "monthly") {
                        for (let y = year; y <= nowYear; y++) {
                            const startMonth = y === year ? month : 0;
                            const endMonth = y === nowYear ? nowMonth : 11;

                            for (let m = startMonth; m <= endMonth; m++) {
                                const key = `${monthNames[m]} ${y}`; // ✅ mese + anno

                                if (!earningsMap[key]) earningsMap[key] = 0;
                                earningsMap[key] += 300;
                            }
                        }
                    } else if (timeframe === "yearly") {
                        for (let y = year; y <= nowYear; y++) {
                            const key = `${y}`;
                            if (!earningsMap[key]) earningsMap[key] = 0;
                            earningsMap[key] += 300;
                        }
                    }
                }

                const finalChartData = Object.entries(earningsMap)
                    .map(([period, value]) => {
                        const [monthStr, yearStr] = period.split(" ");
                        const monthIndex = monthNames.indexOf(monthStr);
                        const date = new Date(Number(yearStr), monthIndex); // Usato solo per ordinamento
                        return { period, mbEarnings: value, date };
                    })
                    .sort((a, b) => a.date - b.date) // ✅ Ordinamento cronologico
                    .map(({ period, mbEarnings }) => ({ period, mbEarnings })); // 🔁 Rimuovi il campo `date` ora che è ordinato


                setChartData(finalChartData);
            } catch (err) {
                console.error("Fehler beim Laden der MB:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMB();
    }, [timeframe]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    }

    if (!chartData.length) {
        return <p className="text-center text-gray-500">Keine MB Provisionen gefunden.</p>;
    }

    const xAxisLabel = timeframe === "monthly" ? "Monat" : "Jahr";

    return (
        <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">MB Provisionen Fix über die Zeit</h2>
            <ResponsiveContainer width="100%" height={400}>
                <AreaChart
                    data={chartData}
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
                        formatter={(value) => [`CHF ${value.toLocaleString("de-DE")}`, "MB Fix Provisionen"]}
                        labelFormatter={(label) => `${xAxisLabel}: ${label}`}
                    />
                    <defs>
                        <linearGradient id="colorMB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="mbEarnings"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fill="url(#colorMB)"
                        dot={{ r: 4, strokeWidth: 2, fill: "#2563eb" }}
                        activeDot={{ r: 6, fill: "#1d4ed8" }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: 10 }}
                        formatter={() => "MB Provisionen Fix (CHF)"}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarkenbotschafterProvisionenChart;
