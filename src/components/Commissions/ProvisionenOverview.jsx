const ProvisionenOverview = ({
  commissions = [],
  timeframeLabel,
  timeframe,
}) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const elapsedDays =
    Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const elapsedWeeks = Math.ceil(elapsedDays / 7);
  const elapsedMonths = currentDate.getMonth() + 1;

  const total = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);

  let valuePerPeriod = 0;
  if (timeframe === "daily") valuePerPeriod = total / elapsedDays;
  else if (timeframe === "weekly") valuePerPeriod = total / elapsedWeeks;
  else if (timeframe === "monthly") valuePerPeriod = total / elapsedMonths;
  else valuePerPeriod = total;

  return (
    <div className="border-2 border-white p-4 bg-transparent rounded-xl shadow-xl h-full flex flex-col justify-between">
      <h1 className="text-xl font-bold">
        Brutto Provisionen ({timeframeLabel})
      </h1>
      <p className="text-3xl font-semibold">
        CHF {Math.round(valuePerPeriod).toLocaleString("de-DE")}
      </p>
    </div>
  );
};

export default ProvisionenOverview;
