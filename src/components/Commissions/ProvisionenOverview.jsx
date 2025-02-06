const ProvisionenOverview = ({ bruttoProvisionen, timeframeLabel }) => {
  return (
    <div className="bg-base-100 border-l-2 border-b-2 border-black p-4 rounded-2xl shadow-lg h-full flex flex-col justify-between">
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
