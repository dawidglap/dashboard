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

const EarningsChart = ({ chartData, timeframe }) => {
  // ✅ Ensure X-Axis labels are readable
  const xAxisLabel =
    timeframe === "Tag"
      ? "Tag"
      : timeframe === "Woche"
      ? "Woche"
      : timeframe === "Monat"
      ? "Monat"
      : "Jahr";

  return (
    <div className="bg-base-100 p-4 rounded-2xl shadow-lg border-b-2 border-indigo-400 ">
      <h2 className="text-xl font-bold mb-4">Umsatz über die Zeit</h2>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          {/* Soft Background Grid */}
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />

          {/* X-Axis with Dynamic Labels */}
          <XAxis
            dataKey="period"
            tick={{ fontSize: 12 }}
            angle={-15} // ✅ Rotates for better readability
            textAnchor="end"
          />

          {/* Y-Axis with currency formatting */}
          <YAxis
            tickFormatter={(value) => `CHF ${value.toLocaleString("de-DE")}`}
            tick={{ fontSize: 12 }}
          />

          {/* Interactive Tooltip */}
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

          {/* ✅ Smooth Area Chart Instead of Line Chart */}
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor=" #a5b4fc" stopOpacity={0.6} />
              <stop offset="95%" stopColor=" #a5b4fc" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="earnings"
            stroke=" #a5b4fc"
            strokeWidth={2}
            fill="url(#colorEarnings)"
            dot={{ r: 4, strokeWidth: 2, fill: " #818cf8" }}
            activeDot={{ r: 6, fill: " #4338ca" }}
          />

          {/* ✅ Legend in German */}
          <Legend
            wrapperStyle={{ paddingTop: 10 }}
            formatter={() => "Umsatz (CHF)"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
