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

  // ✅ Get user by ID
  const getUserById = (userId) => users.find((u) => u._id === userId);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md bg-white">
      <table className="table table-xs hover w-full rounded-lg border-indigo-300">
        <thead>
          <tr className="bg-indigo-100 text-slate-700 text-sm">
            <th className="py-2 px-3 text-left w-auto">🏢 Firmen-Name</th>
            <th className="py-2 px-3 text-left w-24">📋 Plan</th>
            <th className="py-2 px-3 text-left w-32">💰 Plan-Preis</th>
            <th className="py-2 px-3 text-left w-40">👤 Inhaber</th>
            <th className="py-2 px-3 text-left w-40">🧑‍💼 Manager</th>
            <th className="py-2 px-3 text-left w-40">🎤 Markenbotschafter</th>
            <th className="py-2 px-3 text-left w-[60px]">📅 Ablaufdatum</th>
            <th className="py-2 px-3 text-left w-32">💸 Provisionen</th>
            <th className="py-2 px-3 text-center w-18">⚙️ Aktion</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company, index) => {
            const manager = getUserById(company.manager_id);
            const markenbotschafter = getUserById(company.markenbotschafter_id);

            return (
              <CompanyTableRow
                key={company._id}
                company={company}
                index={index + 1}
                onEdit={onEdit}
                onDelete={onDelete}
                manager={manager}
                markenbotschafter={markenbotschafter}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;
