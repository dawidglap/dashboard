import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const GrowthRateWidget = ({
  bruttoUmsatz,
  lastMonthUmsatz,
  timeframeLabel = "Zeitraum",
}) => {
  const growthRate =
    lastMonthUmsatz > 0
      ? ((bruttoUmsatz - lastMonthUmsatz) / lastMonthUmsatz) * 100
      : 0;

  return (
    <div className="border-2 border-white  p-4 bg-transparent rounded-xl shadow-xl text-center flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold">Umsatzwachstum </h2>
        <p className="text-xs">({timeframeLabel})</p>
      </div>
      <p
        className={`text-xl font-semibold flex items-center justify-center ${
          growthRate >= 0 ? "" : ""
        }`}
      >
        {growthRate >= 0 ? (
          <FaArrowTrendUp className="text-green-500 mr-2" />
        ) : (
          <FaArrowTrendDown className="text-red-500 mr-2" />
        )}
        {growthRate.toFixed(2)}%
      </p>
      <p className="text-sm text-gray-500">
        Verglichen mit dem letzten {timeframeLabel.toLowerCase()}
      </p>
    </div>
  );
};

export default GrowthRateWidget;
