"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import CompanyTableRow from "./CompanyTableRow";

const CompanyTable = ({ onEdit, onDelete }) => {
  const [companies, setCompanies] = useState([]); // ✅ Store API-fetched companies
  const [users, setUsers] = useState([]); // ✅ Store users
  const [totalCompanies, setTotalCompanies] = useState(0); // ✅ Store total companies count
  const [userRole, setUserRole] = useState(null); // ✅ Store user role
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [selectedCompany, setSelectedCompany] = useState(""); // ✅ Filter state

  // ✅ Fetch session for user role
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.role) {
        setUserRole(session.user.role);
      }
    };

    fetchSession();
  }, []);

  // ✅ Fetch users
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

  // ✅ Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true); // ✅ Start loading
      try {
        const res = await fetch("/api/companies/all");
        if (!res.ok) throw new Error("Fehler beim Laden der Firmen");
        const data = await res.json();
        setCompanies(data.data || []);
        setTotalCompanies(data.data.length || 0);
      } catch (error) {
        console.error("Fehler beim Laden der Firmen:", error);
      } finally {
        setLoading(false); // ✅ Stop loading when done
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Get user by ID
  const getUserById = (userId) => users.find((u) => u._id === userId);

  // ✅ Apply filtering on already loaded data (⚠️ API call might be needed in the future)
  const filteredCompanies = selectedCompany
    ? companies.filter((company) => company.company_name === selectedCompany)
    : companies;

  return (
    <div className="overflow-x-auto rounded-xl">
      {/* ✅ Company Filter Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 px-4 my-2 ms-1 w-36 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <option value="">Alle Firmen</option>
          {[...new Set(companies.map((c) => c.company_name))].map((name, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>

        {/* ✅ Dynamic Total Count (Filtered/All) */}
        {/* <p className="p-2 px-4 text-sm rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300">
          Gesamtfirmen:{" "}
          <span className="text-indigo-600 font-bold">
            {filteredCompanies.length}
          </span>
        </p> */}
      </div>

      {/* ✅ Scrollable Table with Fixed Header */}
      <div className="max-h-[90vh] overflow-auto">
        <table className="table table-xs w-full">
          <thead className="sticky top-0 z-50 bg-white">
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300 z-10 dark:text-white">
              <th className="py-3 px-4 text-left">
                Firmen-Name{" "}
                <span className="text-gray-400">
                  ({filteredCompanies.length})
                </span>
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
            {loading ? (
              // ✅ DaisyUI Skeleton Loader while loading
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan="1" className="py-4 text-center">
                    <div className="skeleton h-6 w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredCompanies.length === 0 ? (
              // ✅ Only show "No Companies Found" after loading finishes
              <tr>
                <td colSpan="9" className="py-6 text-center text-gray-500">
                  Keine Firmen gefunden.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, index) => {
                const manager = getUserById(company.manager_id);
                const markenbotschafter = getUserById(
                  company.markenbotschafter_id
                );

                return (
                  <CompanyTableRow
                    key={company._id}
                    company={company}
                    index={index + 1} // ✅ Fix index (now global, no pagination)
                    onEdit={onEdit}
                    onDelete={onDelete}
                    manager={manager}
                    markenbotschafter={markenbotschafter}
                    userRole={userRole} // ✅ Pass user role to table row
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyTable;
