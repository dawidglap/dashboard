const EarningsOverview = ({ chartData = [], timeframeLabel }) => {
  console.log("🔍 Debug: chartData in EarningsOverview", chartData); // Debugging

  if (!chartData.length) {
    return (
      <div className="bg-base-100 border-l-2 border-b-2 border-black p-4 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold">Bruttoumsatz ({timeframeLabel})</h1>
        <p className="text-3xl font-semibold text-gray-400">
          Daten werden geladen...
        </p>
      </div>
    );
  }

  // ✅ Dynamically Calculate Umsatz from chartData
  const filteredChartData =
    timeframeLabel === "Tag"
      ? chartData.slice(-1) // Last day
      : timeframeLabel === "Woche"
      ? chartData.slice(-1) // Last week
      : timeframeLabel === "Monat"
      ? chartData // Sum all available weeks in a month
      : chartData; // Yearly: Use everything

  const bruttoUmsatz = filteredChartData.reduce(
    (sum, entry) => sum + (entry.earnings || 0),
    0
  );

  const steuer = bruttoUmsatz * 0.081;
  const nettoUmsatz = bruttoUmsatz - steuer;

  return (
    <div className="bg-base-100 border-l-2 border-b-2 border-black p-4 rounded-2xl shadow-lg">
      <h1 className="text-xl font-bold">Bruttoumsatz ({timeframeLabel})</h1>
      <p className="text-3xl font-semibold">
        CHF {Math.round(bruttoUmsatz).toLocaleString("de-DE")}
      </p>

      <h2 className="text-lg font-medium mt-4">Steuer (8.1%)</h2>
      <p className="text-xl">
        CHF {Math.round(steuer).toLocaleString("de-DE")}
      </p>

      <h2 className="text-lg font-medium mt-4">Netto Umsatz</h2>
      <p className="text-xl font-semibold">
        CHF {Math.round(nettoUmsatz).toLocaleString("de-DE")}
      </p>
    </div>
  );
};

export default EarningsOverview;
