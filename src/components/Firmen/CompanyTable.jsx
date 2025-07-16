"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import CompanyTableRow from "./CompanyTableRow";
import EditCompanyModal from "./EditCompanyModal";
import CompanyFilters from "./CompanyFilters";
import { FiRefreshCw } from "react-icons/fi";
import CompanyCard from "./CompanyCard";



const CompanyTable = ({ onEdit, onDelete }) => {
  const [companies, setCompanies] = useState([]); // ✅ Store API-fetched companies
  const [users, setUsers] = useState([]); // ✅ Store users
  const [totalCompanies, setTotalCompanies] = useState(0); // ✅ Store total companies count
  const [userRole, setUserRole] = useState(null); // ✅ Store user role
  const [loading, setLoading] = useState(true); // ✅ Add loading state
  const [selectedCompany, setSelectedCompany] = useState(""); // ✅ Filter state
  const [editingCompany, setEditingCompany] = useState(null); // ✅ Track company being edited
  const [toastMessage, setToastMessage] = useState(null); // ✅ New state for toast
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedMarkenbotschafter, setSelectedMarkenbotschafter] = useState("");
  const [session, setSession] = useState(null);



  // ✅ Auto-clear toast after 2 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);

      return () => clearTimeout(timer); // ✅ Clear timeout if component unmounts
    }
  }, [toastMessage]);

  // ✅ Fetch session for user role
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      if (sessionData?.user?.role) {
        setUserRole(sessionData.user.role);
      }
      setSession(sessionData); // ✅ salva sessione
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

  // ✅ Fetch companies from API
  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ Function to handle saving (updating) company
  const handleSave = async (companyId, updatedData) => {
    try {
      const res = await fetch(`/api/companies/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren der Firma");

      console.log("✅ Firma erfolgreich aktualisiert");
      await fetchCompanies(); // ✅ Refresh the table
      setEditingCompany(null); // ✅ Close the modal
    } catch (error) {
      console.error("❌ Fehler beim Speichern:", error);
    }
  };

  // ✅ Function to open the modal with the selected company
  const handleEdit = (company) => {
    setEditingCompany(company);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };


  // ✅ Get user by ID
  const getUserById = (userId) => users.find((u) => u._id === userId);

  // ✅ Apply filtering on already loaded data (⚠️ API call might be needed in the future)
  const filteredCompanies = companies.filter((company) => {
    const matchesCompany =
      selectedCompany === "" || company.company_name === selectedCompany;
    const matchesManager =
      selectedManager === "" || company.manager_id === selectedManager;
    const matchesMarkenbotschafter =
      selectedMarkenbotschafter === "" ||
      company.markenbotschafter_id === selectedMarkenbotschafter;

    return matchesCompany && matchesManager && matchesMarkenbotschafter;
  });



  return (
    <div className="overflow-x-auto rounded-xl">
      {/* ✅ Company Filter Dropdown */}
      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-start gap-4 mb-4 w-full xl:w-auto">
        {/* Filtro compagnie (Alle Kunden) */}
        {companies.length > 0 && (
          <select
            className="order-1 select select-sm select-bordered rounded-full bg-indigo-100 text-sm
        w-full sm:w-2/3 md:w-1/2 xl:w-72 px-4 ms-0 "
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Alle Kunden</option>
            {[...new Set(companies.map((c) => c.company_name))].map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>
        )}

        {/* Bottone reset */}
        <button
          onClick={() => {
            setSelectedCompany("");
            setSelectedManager("");
            setSelectedMarkenbotschafter("");
          }}
          className="order-3 xl:order-2 btn btn-outline btn-sm rounded-full
      w-full sm:w-2/3 md:w-1/2 xl:w-16 xl:px-4 xl:h-8
      flex items-center justify-center"
          title="Filter zurücksetzen"
        >
          <span className="xl:hidden">Filter zurücksetzen</span>
          <span className="hidden xl:flex">
            <FiRefreshCw size={20} />
          </span>
        </button>

        {/* Filtri Manager e Markenbotschafter */}
        {(userRole === "admin" || userRole === "manager") && (
          <div className="order-2 xl:order-3 w-full xl:w-auto">
            <CompanyFilters
              users={users}
              selectedManager={selectedManager}
              selectedMarkenbotschafter={selectedMarkenbotschafter}
              onManagerChange={setSelectedManager}
              onMarkenbotschafterChange={setSelectedMarkenbotschafter}
              userRole={userRole}
              currentUserId={users.find(
                (u) => u.email === session?.user?.email
              )?._id}
            />
          </div>
        )}
      </div>




      {/* ✅ New CompanyFilters Component */}



      {/* ✅ Scrollable Table with Fixed Header */}
      {/* ✅ Responsive layout: Table for desktop, Cards for mobile/tablet */}
      <div className="hidden xl:block max-h-[90vh] overflow-auto">
        <table className="table table-xs w-full">
          <thead className="sticky top-0 z-50 bg-white">
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300 z-10 dark:text-white">
              <th className="py-3 px-4 text-left">
                Kunden Name{" "}
                <span className="text-gray-400">({filteredCompanies.length})</span>
              </th>
              <th className="py-3 px-4 text-left">Paket</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Preis <br /> (CHF)
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Inhaber
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Business<br />Partner
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Markenbotschafter
              </th>
              <th className="py-3 px-4 text-left">Ablauf</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Provision <br /> (CHF)
              </th>
              {userRole === "admin" && (
                <th className="py-3 px-4 text-center">Aktion</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan="9" className="py-4 text-center">
                    <div className="skeleton h-6 w-full"></div>
                  </td>
                </tr>
              ))
            ) : filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-6 text-center text-gray-500">
                  Keine Firmen gefunden.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, index) => {
                const manager = getUserById(company.manager_id);
                const markenbotschafter = getUserById(company.markenbotschafter_id);
                return (
                  <CompanyTableRow
                    key={company._id}
                    company={company}
                    index={index + 1}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                    manager={manager}
                    markenbotschafter={markenbotschafter}
                    userRole={userRole}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Mobile / Tablet Card View */}
      <div className="xl:hidden space-y-4">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="skeleton h-32 w-full rounded-xl"></div>
          ))
        ) : filteredCompanies.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">Keine Firmen gefunden.</p>
        ) : (
          filteredCompanies.map((company, index) => {
            const manager = getUserById(company.manager_id);
            const markenbotschafter = getUserById(company.markenbotschafter_id);
            return (
              <CompanyCard
                key={company._id}
                company={company}
                manager={manager}
                markenbotschafter={markenbotschafter}
                onEdit={handleEdit}
                onDelete={onDelete}
                userRole={userRole}
              />
            );
          })
        )}
      </div>

      {/* ✅ Edit Company Modal */}
      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleSave}
          setParentToast={setToastMessage} // ✅ Pass to child
        />
      )}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
