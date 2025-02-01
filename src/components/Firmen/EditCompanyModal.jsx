"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";

const EditCompanyModal = ({ company, onClose, onSave }) => {
  const { formData, handleChange, setFormData } = useCompanyForm(
    {
      company_name: "",
      company_street: "",
      company_street_number: "",
      company_post_code: "",
      company_city: "",
      company_email: "",
      telephone: "",
      mobile: "",
      plan: "BASIC",
      company_owner: "",
      plan_price: "",
      expiration_date: "",
      manager_id: "",
      markenbotschafter_id: "",
    },
    company
  );

  const [users, setUsers] = useState([]); // ✅ Store all users
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  // ✅ Populate fields when opening the modal
  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || "",
        company_street: company.company_street || "",
        company_street_number: company.company_street_number || "",
        company_post_code: company.company_post_code || "",
        company_city: company.company_city || "",
        company_email: company.company_email || "",
        telephone: company.telephone || "",
        mobile: company.mobile || "",
        plan: company.plan || "BASIC",
        company_owner: company.company_owner || "", // ✅ Added Inhaber
        plan_price: company.plan_price || "",
        expiration_date: company.expiration_date
          ? new Date(company.expiration_date).toISOString().split("T")[0]
          : "",
        manager_id: company.manager_id || "",
        markenbotschafter_id: company.markenbotschafter_id || "",
      });

      setIsSaving(false);
    }
  }, [company, setFormData]);

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
      setIsSaving(true);
      await onSave(company._id, updatedData);
      setToastMessage("✅ Firma erfolgreich aktualisiert!");

      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      setIsSaving(false);
      console.error("Update error:", error);
      setToastMessage("❌ Fehler beim Aktualisieren!");
    }
  };

  if (!company) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box w-3/4 max-w-5xl space-y-4 bg-indigo-100 shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700">
          ✏️ Firma bearbeiten
        </h3>

        <div className="grid grid-cols-2 gap-4">
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
            <label className="text-sm font-medium">📍 Straße</label>
            <input
              type="text"
              name="company_street"
              value={formData.company_street}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">🏠 Hausnummer</label>
            <input
              type="text"
              name="company_street_number"
              value={formData.company_street_number}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">📮 Postleitzahl</label>
            <input
              type="text"
              name="company_post_code"
              value={formData.company_post_code}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">🏙️ Stadt</label>
            <input
              type="text"
              name="company_city"
              value={formData.company_city}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          {/* Inhaber (Company Owner) */}
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

          {/* Contact Information */}
          <div>
            <label className="text-sm font-medium">📧 Firmen-E-Mail</label>
            <input
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">📞 Telefon</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">📱 Mobil</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="input input-sm input-bordered w-full"
            />
          </div>

          {/* Manager Selection */}
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
                    {user.name} {user.surname}
                  </option>
                ))}
            </select>
          </div>

          {/* Markenbotschafter Selection */}
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
                    {user.name} {user.surname}
                  </option>
                ))}
            </select>
          </div>
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
            {isSaving ? <FaSpinner className="animate-spin" /> : "✅ Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;
