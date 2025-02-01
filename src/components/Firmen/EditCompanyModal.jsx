"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";

const EditCompanyModal = ({ company, onClose, onSave }) => {
  const { formData, handleChange } = useCompanyForm(
    {
      company_name: "",
      company_address: "",
      plan: "BASIC",
      company_owner: "",
      plan_price: "",
      expiration_date: "",
      manager_id: "",
      markenbotschafter_id: "",
    },
    company
  );

  const [users, setUsers] = useState([]); // Store all users
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // ✅ Track saving state

  // ✅ Fetch users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
        setToastMessage("❌ Fehler beim Laden der Benutzer");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (company) {
      setIsSaving(false); // ✅ Reset loading state when a new company is opened
    }
  }, [company]);

  const handleSubmit = async () => {
    if (!company || !company._id) {
      console.error("Error: Company ID is missing!");
      setToastMessage("❌ Fehler: Firmen-ID fehlt!");
      return;
    }

    const { _id, ...updatedData } = {
      ...formData,
      plan_price: formData.plan_price || null,
    };

    console.log("Submitting update with data:", updatedData);

    try {
      setIsSaving(true); // ✅ Show loader while saving

      await onSave(company._id, updatedData);
      setToastMessage("✅ Firma erfolgreich aktualisiert!");

      // Delay closing the modal to allow toast visibility
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      setIsSaving(false); // ✅ Hide loader after success/error

      console.error("Update error:", error);
      setToastMessage("❌ Fehler beim Aktualisieren!");
    }
  };

  if (!company) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4 bg-indigo-100 shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700">
          ✏️ Firma bearbeiten
        </h3>

        {/* Firmen-Name */}
        <div>
          <label className="text-sm font-medium">🏢 Firmen-Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Firmen-Adresse */}
        <div>
          <label className="text-sm font-medium">📍 Firmen-Adresse</label>
          <input
            type="text"
            name="company_address"
            value={formData.company_address}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Plan Auswahl */}
        <div>
          <label className="text-sm font-medium">📋 Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            className="select select-sm select-bordered w-full"
          >
            <option value="BASIC">BASIC</option>
            <option value="PRO">PRO</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>
        </div>

        {/* Plan-Preis (Nur für BUSINESS) */}
        {formData.plan === "BUSINESS" && (
          <div>
            <label className="text-sm font-medium">💰 Plan-Preis</label>
            <input
              type="number"
              name="plan_price"
              value={formData.plan_price}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>
        )}

        {/* Inhaber */}
        <div>
          <label className="text-sm font-medium">👤 Inhaber</label>
          <input
            type="text"
            name="company_owner"
            value={formData.company_owner}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Ablaufdatum */}
        <div>
          <label className="text-sm font-medium">📅 Ablaufdatum</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Manager Auswahl */}
        <div>
          <label className="text-sm font-medium">🧑‍💼 Manager</label>
          <select
            name="manager_id"
            value={formData.manager_id}
            onChange={handleChange}
            className="select select-sm select-bordered w-full"
          >
            <option value="">-- Manager auswählen --</option>
            {users
              .filter(
                (user) => user.role === "manager" || user.role === "admin"
              )
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname} ({user.role})
                </option>
              ))}
          </select>
        </div>

        {/* Markenbotschafter Auswahl */}
        <div>
          <label className="text-sm font-medium">🎤 Markenbotschafter</label>
          <select
            name="markenbotschafter_id"
            value={formData.markenbotschafter_id}
            onChange={handleChange}
            className="select select-sm select-bordered w-full"
          >
            <option value="">-- Markenbotschafter auswählen --</option>
            {users
              .filter(
                (user) =>
                  user.role === "markenbotschafter" || user.role === "admin"
              )
              .map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname} ({user.role})
                </option>
              ))}
          </select>
        </div>

        {/* Modal Actions */}
        <div className="modal-action flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-sm bg-red-400 hover:bg-red-500 text-white"
          >
            ❌ Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className={`btn btn-sm text-white ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed" // ✅ Change color & disable during saving
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isSaving} // ✅ Disable button while saving
          >
            {isSaving ? <FaSpinner className="animate-spin" /> : "✅ Speichern"}
          </button>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      {toastMessage && (
        <div className="toast fixed bottom-4 right-4 z-50">
          <div className="alert alert-success shadow-lg px-2 py-1">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompanyModal;
