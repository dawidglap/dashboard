"use client";

import { useState } from "react";
import CompanyTableRow from "./CompanyTableRow";

const CompanyTable = ({ companies, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const companiesPerPage = 12;

  const totalPages = Math.ceil(companies.length / companiesPerPage);
  const displayedCompanies = companies.slice(
    (page - 1) * companiesPerPage,
    page * companiesPerPage
  );

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="table table-xs hover w-full rounded-lg border-indigo-300">
        <thead>
          <tr className="bg-indigo-100 text-slate-700 text-sm">
            <th className="py-2 px-3 w-6">#</th>
            <th className="py-2 px-3 text-left w-auto">🏢 Firmen-Name</th>
            <th className="py-2 px-3 text-left w-36">🆔 ID</th>
            <th className="py-2 px-3 text-left w-32">📋 Plan</th>
            <th className="py-2 px-3 text-left w-36">💰 Plan-Preis</th>
            <th className="py-2 px-3 text-left w-40">👤 Inhaber</th>
            <th className="py-2 px-3 text-left w-36">📅 Ablaufdatum</th>
            <th className="py-2 px-3 text-center w-16">⚙️ Aktion</th>
          </tr>
        </thead>
        <tbody>
          {displayedCompanies.map((company, index) => (
            <CompanyTableRow
              key={company._id}
              company={company}
              index={(page - 1) * companiesPerPage + index + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-xs btn-neutral"
          >
            ← Zurück
          </button>

          <span className="text-gray-700 text-xs">
            Seite {page} von {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="btn btn-xs btn-neutral"
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
