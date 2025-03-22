const EarningsOverview = ({ bruttoUmsatz = 0, timeframeLabel, timeframe }) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

  const elapsedDays =
    Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const elapsedWeeks = Math.ceil(elapsedDays / 7);
  const elapsedMonths = currentDate.getMonth() + 1;

  let valuePerPeriod = 0;

  if (timeframe === "daily") valuePerPeriod = bruttoUmsatz / elapsedDays;
  else if (timeframe === "weekly") valuePerPeriod = bruttoUmsatz / elapsedWeeks;
  else if (timeframe === "monthly")
    valuePerPeriod = bruttoUmsatz / elapsedMonths;
  else valuePerPeriod = bruttoUmsatz;

  const steuer = valuePerPeriod * 0.081;
  const nettoUmsatz = valuePerPeriod - steuer;

  return (
    <div className="border-2 border-white bg-transparent rounded-xl shadow-xl p-4">
      <h1 className="text-xl font-bold">Bruttoumsatz ({timeframeLabel})</h1>
      <p className="text-3xl font-semibold">
        CHF {Math.round(valuePerPeriod).toLocaleString("de-DE")}
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
