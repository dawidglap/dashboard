"use client";

import { useState, useEffect } from "react";
import CompanyTableRow from "./CompanyTableRow";

const CompanyTable = ({
  companies,
  onEdit,
  onDelete,
  page,
  setPage,
  hasMore,
}) => {
  const [users, setUsers] = useState([]); // Store users
  const [totalCompanies, setTotalCompanies] = useState(0); // ✅ Store the total count of companies
  const itemsPerPage = 6; // Number of items per page

  // ✅ Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzer");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Fetch total number of companies (independent of pagination)
  useEffect(() => {
    const fetchTotalCompanies = async () => {
      try {
        const res = await fetch("/api/companies/all");
        if (!res.ok) throw new Error("Fehler beim Laden der Firmenanzahl");
        const data = await res.json();
        setTotalCompanies(data.data.length || 0);
      } catch (error) {
        console.error("Fehler beim Laden der Firmenanzahl:", error);
      }
    };

    fetchTotalCompanies();
  }, []);

  // ✅ Get user by ID
  const getUserById = (userId) => users.find((u) => u._id === userId);

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
          <thead>
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300 dark:text-white">
              {/* ✅ Show Total Companies in Header */}
              <th className="py-3 px-4 text-left">
                Firmen-Name{" "}
                <span className="text-gray-400">({totalCompanies})</span>
              </th>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Preis (CHF)
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Inhaber
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Manager
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Markenbotschafter
              </th>
              <th className="py-3 px-4 text-left">Ablauf</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Provision (CHF)
              </th>
              <th className="py-3 px-4 text-center">Aktion</th>
            </tr>
          </thead>

          <tbody>
            {companies.length === 0 ? (
              // ✅ No Data Found
              <tr>
                <td colSpan="9" className="py-6 text-center text-gray-500">
                  Keine Firmen gefunden.
                </td>
              </tr>
            ) : (
              companies.map((company, index) => {
                const manager = getUserById(company.manager_id);
                const markenbotschafter = getUserById(
                  company.markenbotschafter_id
                );

                return (
                  <CompanyTableRow
                    key={company._id}
                    company={company}
                    index={(page - 1) * itemsPerPage + index + 1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    manager={manager}
                    markenbotschafter={markenbotschafter}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ Pagination UI */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-xs rounded-full px-4 btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-xs">Seite {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="btn btn-xs rounded-full px-4 btn-neutral"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
};

export default CompanyTable;
