import { useState } from "react";

const ProvisionenBreakdown = ({ commissions = [] }) => {
  const [filter, setFilter] = useState("");

  if (!commissions.length) {
    return (
      <div className="bg-base-100 p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4 border-b-2 border-indigo-300 pb-2">
          Detaillierte Provisionsübersicht
        </h2>
        <p className="text-gray-500">Noch keine Provisionen verfügbar.</p>
      </div>
    );
  }

  // ✅ Filter commissions based on selected user
  const filteredCommissions = filter
    ? commissions.filter((c) => c.userName.includes(filter))
    : commissions;

  return (
    <div className="bg-base-100 rounded-2xl w-full">
      {/* Header with filter */}
      <div className="flex justify-between items-center mb-4">
        {/* ✅ User Filter Dropdown */}
        <select
          className="p-2 px-4 rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Alle Benutzer</option>
          {[...new Set(commissions.map((c) => c.userName))].map((user, i) => (
            <option key={i} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Commission Table */}
      <div className="overflow-x-auto rounded-2xl">
        <table className="table table-xs w-full text-left">
          <thead>
            <tr className="text-sm text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-left">Firma</th>
              <th className="py-3 px-4 text-left">Provision</th>
              <th className="py-3 px-4 text-left">Startdatum</th>
              <th className="py-3 px-4 text-left">Zahlungsdatum</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommissions.map((commission, index) => {
              const createdAt = new Date(commission.startDatum);
              const payDate = new Date(
                createdAt.getFullYear(),
                createdAt.getMonth() + 1, // ✅ Next month
                25
              );

              return (
                <tr
                  key={index}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-4 px-4 font-medium">
                    {commission.userName}
                  </td>
                  <td className="py-4 px-4 capitalize">{commission.role}</td>
                  <td className="py-4 px-4">{commission.companyName}</td>
                  <td className="py-4 px-4 text-green-500 font-semibold">
                    CHF {commission.amount.toLocaleString("de-DE")}
                  </td>
                  <td className="py-4 px-4">
                    {createdAt.toLocaleDateString("de-DE")}
                  </td>
                  <td className="py-4 px-4">
                    {payDate.toLocaleDateString("de-DE")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProvisionenBreakdown;
