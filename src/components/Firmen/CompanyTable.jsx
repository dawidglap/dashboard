"use client";

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import CompanyTableRow from "./CompanyTableRow";
import EditCompanyModal from "./EditCompanyModal";
import CompanyFilters from "./CompanyFilters";
import { FiRefreshCw } from "react-icons/fi";



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
    setEditingCompany(company); // ✅ Set company to be edited
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
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* Mostra solo il filtro delle compagnie per Manager/Markenbotschafter */}
          {companies.length > 0 && (
            <select
              className=" px-4 my-2  ms-1 w-72 select select-sm select-bordered rounded-full bg-indigo-100 text-sm"
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
          <button
            onClick={() => {
              setSelectedCompany("");
              setSelectedManager("");
              setSelectedMarkenbotschafter("");
            }}
            className="my-2  h-8 px-4  relative top-[10px] ms-2 rounded-full border-neutral-800 border  hover:bg-black hover:text-gray-200 transition duration-150"
            title="Filter zurücksetzen"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>

        {/* Filtro per Manager o Markenbotschafter */}
        {(userRole === "admin" || userRole === "manager") && (
          <CompanyFilters
            users={users}
            selectedManager={selectedManager}
            selectedMarkenbotschafter={selectedMarkenbotschafter}
            onManagerChange={setSelectedManager}
            onMarkenbotschafterChange={setSelectedMarkenbotschafter}
            userRole={userRole}
            currentUserId={users.find(u => u.email === session?.user?.email)?._id} // serve per manager
          />
        )}

        {/* 🔄 Pulsante di reset filtri */}


      </div>

      {/* ✅ New CompanyFilters Component */}



      {/* ✅ Scrollable Table with Fixed Header */}
      <div className="max-h-[90vh] overflow-auto">
        <table className="table table-xs w-full">
          <thead className="sticky top-0 z-50 bg-white">
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300 z-10 dark:text-white">
              <th className="py-3 px-4 text-left">
                Kunden Name{" "}
                <span className="text-gray-400">
                  ({filteredCompanies.length})
                </span>
              </th>

              <th className="py-3 px-4 text-left">Paket</th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Preis <br />
                (CHF)
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Inhaber
              </th>
              <th className="py-3 px-4 text-left hidden md:table-cell">
                Business
                <br />
                Partner
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
                    index={index + 1}
                    onEdit={handleEdit} // ✅ CORRECT: now clicking Edit opens modal
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
