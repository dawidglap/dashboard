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

  // Generate demo data (for visualization purposes)
  useEffect(() => {
    const generateDemoData = () => {
      const data = [];
      const startDate = new Date(2024, 0, 1); // January 2024
      const endDate = new Date(2025, 0, 1); // January 2025

      while (startDate <= endDate) {
        const earnings = Math.floor(Math.random() * 20000 + 5000); // Between 5K and 25K
        data.push({
          month: `${startDate.toLocaleString("de-DE", {
            month: "short",
          })} '${startDate.getFullYear().toString().slice(-2)}`,
          earnings,
        });
        startDate.setMonth(startDate.getMonth() + 1);
      }

      setChartData(data);
    };

    generateDemoData();
  }, []);

  // Filter the last 6 months for display
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const filteredData = chartData.slice(-6); // Get only the last 6 months

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Monthly Earnings</h1>

      {/* Area Chart */}
      <div className="mb-10">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={filteredData} // Use filteredData here
            margin={{
              top: 10,
              right: 30,
              left: 50, // Added padding for CHF visibility
              bottom: 10,
            }}
          >
            {/* Grid */}
            <CartesianGrid horizontal={true} vertical={false} />

            {/* X-Axis */}
            <XAxis
              dataKey="month"
              padding={{ left: 20, right: 20 }} // Add space at the ends
              tickFormatter={(tick) => tick} // Keep German month format
              minTickGap={5}
            />

            {/* Y-Axis */}
            <YAxis
              domain={[0, 25000]} // Start from 0 to 25K
              tickFormatter={(value) =>
                value === 0
                  ? ""
                  : `CHF ${value >= 1000 ? `${value / 1000}K` : value}`
              }
              ticks={[5000, 10000, 15000, 20000, 25000]} // Tick intervals
              allowDecimals={false}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorEarnings)"
              activeDot={{ r: 8 }}
            />

            {/* Gradient for the area */}
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Earnings;
