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

const ProvisionenChart = ({ chartData, timeframe }) => {
  if (!chartData || chartData.length < 2) {
    return (
      <div className="bg-base-100 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold mb-4">
          Provisionen über Zeit ({timeframe})
        </h2>
        <p className="text-gray-500">Nicht genug Daten für das Diagramm.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Provisionen über Zeit ({timeframe})
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
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
            labelFormatter={(label) => `Zeitraum: ${label}`}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <defs>
            <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="earnings"
            stroke="#22c55e"
            strokeWidth={3}
            fill="url(#colorCommissions)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProvisionenChart;
