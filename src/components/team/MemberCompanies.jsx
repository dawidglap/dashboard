import React from "react";
import { useRouter } from "next/navigation";

const MemberCompanies = ({ companies, userId }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* ✅ Table */}
      <div className="overflow-x-auto flex-grow">
        <table className="table w-full table-xs rounded-lg">
          <thead>
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left">
                Kunden Name{" "}
                <span className="text-gray-400">({companies.length})</span>
              </th>
              <th className="py-3 px-4 text-left">Paket</th>
              <th className="py-3 px-4 text-left">Rolle</th>
              <th className="py-3 px-4 text-left">Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-3 text-gray-500">
                  Keine Kunden gefunden.
                </td>
              </tr>
            ) : (
              companies.map((company, index) => (
                <tr
                  key={company._id}
                  className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                >
                  <td className="py-4 px-4 font-medium">
                    {company.company_name}
                  </td>
                  <td className="py-4 px-4">{company.plan || "N/A"}</td>
                  <td className="py-4 px-4 font-semibold">
                    {company.manager_id === userId &&
                    company.markenbotschafter_id === userId
                      ? "Manager & Markenbotschafter"
                      : company.manager_id === userId
                      ? "Manager"
                      : company.markenbotschafter_id === userId
                      ? "Markenbotschafter"
                      : "Keine Rolle"}
                  </td>
                  <td className="py-4 px-4">
                    {company.created_at
                      ? new Date(company.created_at).toLocaleDateString("de-DE")
                      : "Kein Datum"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberCompanies;
