"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import CompanyTable from "../../../components/Firmen/CompanyTable";
import DeleteCompanyModal from "../../../components/Firmen/DeleteCompanyModal";
import NewCompanyModal from "../../../components/Firmen/NewCompanyModal";
import EditCompanyModal from "../../../components/Firmen/EditCompanyModal";
import ToastNotification from "../../../components/Firmen/ToastNotification";

const Firmen = () => {
  const [companies, setCompanies] = useState(null); // ✅ Prevent SSR issues
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

  // ✅ Fetch Companies with Pagination
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/companies?page=${page}&limit=${companiesPerPage}`
        );
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
        <h1 className="text-3xl mt-8 md:text-4xl font-extrabold text-base-content mb-6">
          Firmen
        </h1>
        <div className="overflow-x-auto rounded-lg shadow-sm">
          <table className="table table-xs w-full">
            <thead>
              <tr className="text-sm md:text-md text-base-content border-b border-indigo-300">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Erstellt am</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">
                  Status
                </th>
                <th className="py-3 px-4 text-left hidden md:table-cell">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse border-b border-gray-200"
                >
                  {[...Array(4)].map((_, i) => (
                    <td key={i} className="py-4 px-4">
                      <div className="h-4 w-24 bg-gray-300 rounded"></div>
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
    <div className="px-4 md:px-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className=" text-3xl mt-8 md:text-4xl font-extrabold text-base-content dark:text-white">
          Firmen
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className=" btn btn-neutral px-4 hover:text-white btn-sm dark:text-white dark:hover:bg-slate-900 flex mt-auto rounded-full items-center space-x-2"
        >
          <FaPlus />
          <span>Neue Firma</span>
        </button>
      </div>

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
