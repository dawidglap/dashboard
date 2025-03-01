const ProvisionenOverview = ({ bruttoProvisionen, timeframeLabel }) => {
  return (
    <div className="border-2 border-white  p-4 bg-transparent rounded-xl shadow-xl h-full flex flex-col justify-between">
      <h1 className="text-xl font-bold">
        Brutto Provisionen ({timeframeLabel})
      </h1>
      <p className="text-3xl font-semibold">
        CHF {Math.round(bruttoProvisionen).toLocaleString("de-DE")}
      </p>
    </div>
  );
};

export default ProvisionenOverview;
