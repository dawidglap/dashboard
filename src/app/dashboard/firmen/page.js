"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import CompanyTable from "../../../components/Firmen/CompanyTable";
import DeleteCompanyModal from "../../../components/Firmen/DeleteCompanyModal";
import NewCompanyModal from "../../../components/Firmen/NewCompanyModal";
import EditCompanyModal from "../../../components/Firmen/EditCompanyModal";
import ToastNotification from "../../../components/Firmen/ToastNotification";

const Firmen = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/companies");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Firmen-Daten.");
        const data = await res.json();
        setCompanies(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

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

  const handleSave = async (updatedCompany) => {
    console.log("Updating company:", updatedCompany);

    try {
      const res = await fetch(`/api/companies/${updatedCompany._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCompany),
      });

      const responseData = await res.json();
      console.log("Server Response:", responseData);

      if (!res.ok)
        throw new Error(
          responseData.error || "Fehler beim Aktualisieren der Firma."
        );

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === updatedCompany._id
            ? { ...company, ...updatedCompany }
            : company
        )
      );

      setToastMessage("Firma erfolgreich aktualisiert! ✅");
    } catch (error) {
      console.error("Error updating company:", error);
      setToastMessage("Fehler beim Aktualisieren: " + error.message);
    }
  };

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

  const handleEditCompany = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData), // `_id` is NOT included here
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren der Firma.");

      const updatedCompany = await res.json();

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...updatedData } : company
        )
      );
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Fehler beim Aktualisieren: " + error.message);
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Firmen</h1>
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <div className="flex justify-center py-10">
            <progress className="progress w-56"></progress>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Firmen</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-warning btn-sm flex items-center space-x-2"
        >
          <FaPlus />
          <span>Neue Firma</span>
        </button>
      </div>

      <CompanyTable
        companies={companies}
        onEdit={setCompanyToEdit}
        onDelete={setCompanyToDelete}
      />
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

// just wrote something to create a proepr commit
