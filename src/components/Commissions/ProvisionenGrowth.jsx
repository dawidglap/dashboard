import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const ProvisionenGrowth = ({ growthRate = 0, timeframeLabel = "Zeitraum" }) => {
  return (
    <div className="bg-base-100 p-4 rounded-2xl shadow-lg border-l-2 border-b-2 border-yellow-300 text-center flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold">Provisionen Wachstum</h2>
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

export default ProvisionenGrowth;
