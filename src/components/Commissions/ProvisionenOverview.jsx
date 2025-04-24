const ProvisionenOverview = ({
  commissions = [],
  markenbotschafter = [],
  timeframeLabel,
  timeframe,
}) => {
  const currentDate = new Date();
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

  // ✅ Filtra solo le commissioni dell’anno corrente e con amount > 0
  const filteredCommissions = commissions.filter((c) => {
    const createdAt = new Date(c.startDatum);
    return createdAt >= startOfYear && c.amount > 0;
  });

  const fixedCommission = markenbotschafter.length * 300;
  const totalWithFixed = total + fixedCommission;


  const total = filteredCommissions.reduce((sum, c) => sum + c.amount, 0);

  const elapsedDays =
    Math.floor((currentDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const elapsedWeeks = Math.ceil(elapsedDays / 7);
  const elapsedMonths = currentDate.getMonth() + 1;

  let valuePerPeriod = 0;
  if (timeframe === "daily") valuePerPeriod = totalWithFixed / elapsedDays;
  else if (timeframe === "weekly") valuePerPeriod = totalWithFixed / elapsedWeeks;
  else if (timeframe === "monthly") valuePerPeriod = totalWithFixed / elapsedMonths;
  else valuePerPeriod = totalWithFixed;


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
