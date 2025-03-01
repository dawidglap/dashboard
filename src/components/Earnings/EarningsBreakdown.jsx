const EarningsBreakdown = () => {
  const plans = [
    { name: "BASIC", price: 799 * 12 * 1.081 },
    { name: "PRO", price: 899 * 12 * 1.081 },
    { name: "BUSINESS", price: "Variabel" },
  ];

  return (
    <div className="bg-base-100 p-4 border-2 border-white  bg-transparent rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Umsatzübersicht nach Plan</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-gray-600">Tarif</th>
            <th className="py-2 text-gray-600">Jährlicher Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 font-medium">{plan.name}</td>
              <td className="py-2">
                {typeof plan.price === "number"
                  ? `CHF ${Math.round(plan.price).toLocaleString("de-DE")}`
                  : "Variabel"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EarningsBreakdown;
