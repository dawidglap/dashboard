"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";

const NewCompanyModal = ({ isOpen, onClose, onSubmit }) => {
  const adminId = "679396cd375db32de1bbfd01"; // Default Admin ID
  const today = new Date().toISOString().split("T")[0]; // ✅ Ensure only future dates can be selected

  const { formData, handleChange, setFormData } = useCompanyForm({
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
    expiration_date: today, // ✅ Default to today
    manager_id: adminId, // Default to Admin
    markenbotschafter_id: adminId, // Default to Admin
  });

  const [users, setUsers] = useState([]); // Store users
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch users only when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
        setError(error.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  // ✅ Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      setToastMessage(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      // ✅ Ensure default values are set if no selection is made
      const finalData = {
        ...formData,
        manager_id: formData.manager_id || adminId,
        markenbotschafter_id: formData.markenbotschafter_id || adminId,
      };

      await onSubmit(finalData);
      setToastMessage("✅ Firma erfolgreich hinzugefügt!");

      // Reset form & close after success
      setTimeout(() => {
        setToastMessage(null);
        setFormData({
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
          expiration_date: today, // ✅ Reset to today's date
          manager_id: adminId,
          markenbotschafter_id: adminId,
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setToastMessage("❌ Fehler beim Speichern der Firma.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4 bg-indigo-100 shadow-lg rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-700">
          ➕ Neue Firma hinzufügen
        </h3>

        {loadingUsers ? (
          <p>Lade Benutzer...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
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
            <div className="grid grid-cols-2 gap-2">
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
                <label className="text-sm font-medium">📮 PLZ</label>
                <input
                  type="text"
                  name="company_post_code"
                  value={formData.company_post_code}
                  onChange={handleChange}
                  className="input input-sm input-bordered w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">🏙 Stadt</label>
                <input
                  type="text"
                  name="company_city"
                  value={formData.company_city}
                  onChange={handleChange}
                  className="input input-sm input-bordered w-full"
                />
              </div>
            </div>

            {/* Ablaufdatum */}
            <div>
              <label className="text-sm font-medium">📅 Ablaufdatum</label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                min={today} // ✅ Prevent past dates
                onChange={handleChange}
                className="input input-sm input-bordered w-full"
              />
            </div>

            {/* Kontaktinformationen */}
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
            {/* Manager Auswahl */}
            <div>
              <label className="text-sm font-medium">🧑‍💼 Manager</label>
              <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="select select-sm select-bordered w-full"
              >
                <option value={adminId}>-- Standard: Admin --</option>
                {users
                  .filter(
                    (user) => user.role === "manager" || user.role === "admin"
                  )
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} {user.surname} ({user.email})
                    </option>
                  ))}
              </select>
            </div>

            {/* Markenbotschafter Auswahl */}
            <div>
              <label className="text-sm font-medium">
                🎤 Markenbotschafter
              </label>
              <select
                name="markenbotschafter_id"
                value={formData.markenbotschafter_id}
                onChange={handleChange}
                className="select select-sm select-bordered w-full"
              >
                <option value={adminId}>-- Standard: Admin --</option>
                {users
                  .filter(
                    (user) =>
                      user.role === "markenbotschafter" || user.role === "admin"
                  )
                  .map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} {user.surname} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          </>
        )}

        <div className="modal-action flex justify-between">
          <button onClick={onClose} className="btn btn-error">
            ❌ Abbrechen
          </button>
          <button onClick={handleSubmit} className="btn btn-success">
            {isSaving ? <FaSpinner className="animate-spin" /> : "✅ Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCompanyModal;
