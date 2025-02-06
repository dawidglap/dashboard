const ProvisionenOverview = ({ bruttoProvisionen, timeframeLabel }) => {
  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h1 className="text-xl font-bold">
        Brutto Provisionen ({timeframeLabel})
      </h1>
      <p className="text-3xl text-[#8B5CF6] font-semibold">
        CHF {Math.round(bruttoProvisionen).toLocaleString("de-DE")}
      </p>
    </div>
  );
};

export default ProvisionenOverview;
