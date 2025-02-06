const ProvisionenProjected = ({
  projectedProvisionen = 0,
  timeframeLabel = "Zeitraum",
}) => {
  const projectedValue = projectedProvisionen * 1.05; // Example projection: +5% growth

  return (
    <div className="bg-base-100 p-4 rounded-2xl shadow-lg border-l-2 border-b-2 border-indigo-300 text-center flex flex-col justify-between h-full">
      <div>
        <h2 className="text-sm font-bold">Voraussichtliche Provisionen</h2>
        <p className="text-xs">({timeframeLabel})</p>
      </div>
      <div>
        <p className="text-xl font-semibold text-blue-400">
          {Math.round(projectedValue).toLocaleString("de-DE")}
        </p>
        <p className="text-md">CHF</p>
      </div>

      <p className="text-sm text-gray-500">
        Erwartete Provisionen für das nächste {timeframeLabel.toLowerCase()}
      </p>
    </div>
  );
};

export default ProvisionenProjected;
