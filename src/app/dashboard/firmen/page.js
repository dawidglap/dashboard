"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { getSession } from "next-auth/react";

import CompanyTable from "../../../components/Firmen/CompanyTable";
import DeleteCompanyModal from "../../../components/Firmen/DeleteCompanyModal";
import NewCompanyModal from "../../../components/Firmen/NewCompanyModal";
import EditCompanyModal from "../../../components/Firmen/EditCompanyModal";
import ToastNotification from "../../../components/Firmen/ToastNotification";
import FirmenHeader from "@/components/Firmen/FirmenHeader";

const Firmen = () => {
  const [companies, setCompanies] = useState(null); // ✅ Prevent SSR issues
  const [userRole, setUserRole] = useState(null); // ✅ Store user role
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const companiesPerPage = 6;

  // ✅ Fetch user session for role checking
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.role) {
        setUserRole(session.user.role);
      }
    };

    fetchSession();
  }, []);

  // ✅ Fetch Companies with Pagination
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/companies/all"); // Fetch all companies without pagination

        if (!res.ok) throw new Error("Fehler beim Abrufen der Firmen-Daten.");
        const data = await res.json();
        setCompanies(data.data || []);
        setHasMore(data.hasMore || false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page]);

  // ✅ Handle Delete Company
  const handleDelete = async () => {
    if (!companyToDelete) return;
    try {
      const res = await fetch(`/api/companies/${companyToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen der Firma.");

      setCompanies((prev) =>
        prev.filter((company) => company._id !== companyToDelete._id)
      );
      setCompanyToDelete(null);
      setToastMessage("Firma erfolgreich gelöscht.");
    } catch (error) {
      setToastMessage("Fehler beim Löschen.");
    }
  };

  // ✅ Handle New Company Submission
  const handleNewCompanySubmit = async (newCompany) => {
    const companyData = {
      ...newCompany,
      expiration_date: newCompany.expiration_date,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });

      if (!res.ok) throw new Error("Fehler beim Hinzufügen der neuen Firma.");

      const data = await res.json();
      setCompanies((prev) => [...prev, { ...companyData, _id: data.data }]);
      setShowModal(false);
      setToastMessage("Firma erfolgreich hinzugefügt.");
    } catch (error) {
      setToastMessage("Fehler beim Hinzufügen.");
    }
  };

  // ✅ Handle Editing Company
  const handleEditCompany = async (id, updatedData) => {
    try {
      console.log("🔍 Sending updated data:", updatedData); // ✅ Debugging log

      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren der Firma.");

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...updatedData } : company
        )
      );
      setToastMessage("Firma erfolgreich aktualisiert! ✅");
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren:", error);
      setToastMessage("Fehler beim Aktualisieren: " + error.message);
    }
  };

  // ✅ Loading State (Skeleton UI)
if (loading || companies === null)
  return (
    <div className="px-4 md:px-12">
      {/* Header Responsive */}
      <FirmenHeader userRole={userRole} onAdd={() => setShowModal(true)} />

      {/* Mobile Skeleton Cards */}
      <div className="block md:hidden space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white shadow rounded-xl p-4 border border-gray-100 space-y-2 animate-pulse"
          >
            <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Desktop Skeleton Table */}
      <div className="hidden md:block overflow-x-auto rounded-lg shadow-sm mt-4">
        <table className="table table-xs w-full">
          <thead>
            <tr className="text-sm md:text-md text-base-content border-b border-indigo-300 dark:text-white">
              <th className="py-3 px-4 text-left">
                Kunden Name{" "}
                <span className="text-gray-400 ms-1">
                  <span className="loading loading-spinner loading-xs"></span>
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
                Business Partner
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
            {[...Array(8)].map((_, index) => (
              <tr
                key={index}
                className="animate-pulse border-b border-gray-200"
              >
                {[...Array(9)].map((_, i) => (
                  <td key={i} className="py-4 px-4">
                    <div className="h-4 w-24 bg-gray-300 rounded-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  return (
    <div className="px-4 lg:px-4 xl:px-6 2xl:px-12">
      <FirmenHeader userRole={userRole} onAdd={() => setShowModal(true)} />


      <CompanyTable
        companies={companies}
        onEdit={setCompanyToEdit}
        onDelete={setCompanyToDelete}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
      />

      {/* ✅ Modals */}
      <DeleteCompanyModal
        company={companyToDelete}
        onDelete={handleDelete}
        onCancel={() => setCompanyToDelete(null)}
      />
      <NewCompanyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewCompanySubmit}
      />
      <EditCompanyModal
        company={companyToEdit}
        onSave={handleEditCompany}
        onClose={() => setCompanyToEdit(null)}
      />
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage("")}
      />
    </div>
  );
};

export default Firmen;
