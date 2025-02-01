"use client";

import { useState } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";

const EditCompanyModal = ({ company, onClose, onSave }) => {
  const { formData, handleChange } = useCompanyForm(
    {
      company_name: "",
      plan: "BASIC",
      company_owner: "",
      plan_price: "",
      expiration_date: "",
    },
    company
  );

  const [toastMessage, setToastMessage] = useState(null);

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
      await onSave(company._id, updatedData);
      setToastMessage("✅ Firma erfolgreich aktualisiert!");

      // Delay closing the modal to allow toast visibility
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
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
            className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
          >
            ✅ Speichern
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
