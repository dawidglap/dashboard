"use client";

import React from "react";

const MemberCompanies = ({ companies }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full table-xs border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
            <th className="py-3 px-4 text-left">Firmen-Name</th>
            <th className="py-3 px-4 text-left">Plan</th>
            <th className="py-3 px-4 text-left">Rolle</th>
            <th className="py-3 px-4 text-left">Erstellt am</th>
          </tr>
        </thead>
        <tbody>
          {companies.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center p-3 text-gray-500">
                Keine Unternehmen gefunden.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr
                key={company._id}
                className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
              >
                <td className="py-4 px-4 font-medium">
                  {company.company_name}
                </td>
                <td className="py-4 px-4">{company.plan || "N/A"}</td>
                <td className="py-4 px-4 font-semibold">
                  {company.manager_id === company.markenbotschafter_id
                    ? "Manager & Markenbotschafter"
                    : company.manager_id === company._id
                    ? "Manager"
                    : "Markenbotschafter"}
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
  );
};

export default MemberCompanies;
