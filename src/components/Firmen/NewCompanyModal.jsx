"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-box max-w-5xl bg-base-100 shadow-lg rounded-2xl p-8   "
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-base-content">
            ➕ Neue Firma hinzufügen
          </h3>
        </div>

        {loadingUsers ? (
          <p className="text-center text-lg font-medium">Lade Benutzer...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-4 gap-3 mt-6">
            {/* Firmen-Name */}
            <div className="col-span-4">
              <label className="text-sm font-medium"> Firmen-Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Straße & Hausnummer */}
            <div className="col-span-3">
              <label className="text-sm font-medium"> Straße</label>
              <input
                type="text"
                name="company_street"
                value={formData.company_street}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium"> Hausnummer</label>
              <input
                type="text"
                name="company_street_number"
                value={formData.company_street_number}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* PLZ & Stadt */}
            <div className="col-span-1">
              <label className="text-sm font-medium"> PLZ</label>
              <input
                type="text"
                name="company_post_code"
                value={formData.company_post_code}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium"> Stadt</label>
              <input
                type="text"
                name="company_city"
                value={formData.company_city}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Ablaufdatum */}
            <div className="col-span-2">
              <label className="text-sm font-medium"> Ablaufdatum</label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                min={today}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Firmen-E-Mail */}
            <div className="col-span-2">
              <label className="text-sm font-medium"> Firmen-E-Mail</label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Telefon & Mobile */}
            <div className="col-span-2">
              <label className="text-sm font-medium"> Telefon</label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium"> Mobil</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Manager Auswahl */}
            <div className="col-span-2">
              <label className="text-sm font-medium">Manager</label>
              <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="select select-sm select-bordered w-full rounded-full"
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
            <div className="col-span-2">
              <label className="text-sm font-medium"> Markenbotschafter</label>
              <select
                name="markenbotschafter_id"
                value={formData.markenbotschafter_id}
                onChange={handleChange}
                className="select select-sm select-bordered w-full rounded-full"
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
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline rounded-full"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-sm btn-neutral hover:text-white rounded-full flex items-center"
          >
            {isSaving ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Speichern"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewCompanyModal;
