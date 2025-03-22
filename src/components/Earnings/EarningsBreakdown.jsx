"use client";

import useBreakdownByPlan from "@/hooks/useBreakdownByPlan";

const EarningsBreakdown = ({
  timeframeLabel = "Monat",
  timeframe = "monthly",
}) => {
  const { breakdown, loading, error } = useBreakdownByPlan(timeframe);

  const planNames = {
    BASIC: "Basic",
    PRO: "Pro",
    BUSINESS: "Business",
  };

  return (
    <div className="bg-base-100 p-4 border-2 border-white bg-transparent rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">
        Umsatzübersicht nach Plan ({timeframeLabel})
      </h2>

      {loading ? (
        <div className="text-gray-500">Lade Daten...</div>
      ) : error ? (
        <div className="text-red-500">Fehler: {error}</div>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-600">Tarif</th>
              <th className="py-2 text-gray-600">Umsatz</th>
            </tr>
          </thead>
          <tbody>
            {["BASIC", "PRO", "BUSINESS"].map((plan) => (
              <tr key={plan} className="border-t">
                <td className="py-2 font-medium">{planNames[plan]}</td>
                <td className="py-2">
                  {breakdown[plan]
                    ? `CHF ${Math.round(breakdown[plan]).toLocaleString(
                        "de-DE"
                      )}`
                    : "CHF 0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EarningsBreakdown;
