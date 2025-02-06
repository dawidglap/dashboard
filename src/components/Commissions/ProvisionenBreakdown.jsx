const ProvisionenBreakdown = ({ commissions = [] }) => {
  if (!commissions.length) {
    return (
      <div className="bg-base-100 p-4 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold mb-4">
          Detaillierte Provisionsübersicht
        </h2>
        <p className="text-gray-500">Noch keine Provisionen verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Detaillierte Provisionsübersicht
      </h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-gray-600">Name</th>
            <th className="py-2 text-gray-600">Firma</th>
            <th className="py-2 text-gray-600">Provision</th>
            <th className="py-2 text-gray-600">Zahlungsdatum</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map((commission, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{commission.userName}</td>
              <td className="py-2">{commission.companyName}</td>
              <td className="py-2 text-green-500 font-semibold">
                CHF {commission.amount.toLocaleString("de-DE")}
              </td>
              <td className="py-2">
                {new Date(commission.paymentDate).toLocaleDateString("de-DE")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProvisionenBreakdown;
