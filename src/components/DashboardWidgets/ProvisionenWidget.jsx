"use client";

import { useState, useEffect } from "react";
import useFetchProvisionen from "@/hooks/useFetchProvisionen";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSession } from "next-auth/react";


const ProvisionenWidget = ({ commissions = [] }) => {
  const { data: session } = useSession();

  // if (!session) {
  //   return (
  //     <div className="flex justify-center py-4">
  //       <span className="loading loading-spinner loading-lg"></span>
  //     </div>
  //   );
  // }

  const isMarkenbotschafter = session?.user?.role === "markenbotschafter";
  const isManager = session?.user?.role === "manager";


  const totalCommissions = commissions.reduce((sum, c) => {
    const isHalf = isManager || isMarkenbotschafter;
    return sum + (isHalf ? c.amount / 2 : c.amount);
  }, 0);



  const [timeframe, setTimeframe] = useState("monthly"); // Default view
  const { chartData, bruttoProvisionen, loading, error } =
    useFetchProvisionen(timeframe);
  const adjustedChartData = (isManager || isMarkenbotschafter)
    ? chartData.map((entry) => ({
      ...entry,
      earnings: Math.round(entry.earnings / 2),
    }))
    : chartData;



  useEffect(() => {
    // Auto-update data every minute
    const interval = setInterval(() => {
      setTimeframe((prev) => prev); // Refresh trigger
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="border-2 border-white p-4 rounded-xl shadow-xl  flex flex-col h-full">
      <Link href="/dashboard/provisionen" className="flex flex-col space-y-4">
        <h2 className="text-lg font-extrabold text-gray-800 dark:text-white">
          Provisionen
        </h2>
        <p className="text-2xl font-bold text-indigo-500">
          {totalCommissions > 0
            ? `${totalCommissions.toLocaleString("de-DE")} CHF`
            : "Keine Daten"}
        </p>


        {/* ✅ Display Chart or "Not Enough Data" Message */}
        <div className="mt-auto h-24">
          {chartData && chartData.length >= 3 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={adjustedChartData}>

                <XAxis dataKey="period" hide />
                <YAxis hide />
                {/* <Tooltip
                    formatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
                  /> */}
                <defs>
                  <linearGradient
                    id="colorCommissions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#colorCommissions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-base-100 p-4 rounded-2xl text-center">
              <h2 className="text-sm font-bold text-gray-700">
                Provisionen über die Zeit
              </h2>
              <p className="text-gray-500 text-xs">
                Nicht genug Daten für das Diagramm.
              </p>
            </div>
          )}
        </div>
      </Link>
      <Link
        href="/dashboard/provisionen"
        className="mt-8 inline-flex items-center justify-center w-64 rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:from-indigo-500 dark:to-purple-400"
      >
        Provisionen anzeigen →
      </Link>
    </div>
  );
};

export default ProvisionenWidget;
