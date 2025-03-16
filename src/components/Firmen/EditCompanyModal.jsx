"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

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
      company_owner: "",
      plan: company?.plan ?? "BASIC",
      plan_price: company?.plan_price ?? "", // ✅ Prevents errors if company is null
      expiration_date: company?.expiration_date
        ? new Date(company.expiration_date).toISOString().split("T")[0]
        : "",
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
        plan_price:
          company.plan === "BUSINESS"
            ? company.plan_price || ""
            : company.plan === "PRO"
            ? 899 * 12 * 1.081
            : 799 * 12 * 1.081,
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
    // ✅ Validate required fields before submitting
    const requiredFields = [
      { name: "company_name", label: "Firmen-Name" },
      { name: "company_street", label: "Straße" },
      { name: "company_post_code", label: "PLZ" },
      { name: "company_city", label: "Stadt" },
      { name: "company_email", label: "Firmen-E-Mail" },
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field.name]
    );

    if (missingFields.length > 0) {
      const missingLabels = missingFields
        .map((field) => field.label)
        .join(", ");
      setToastMessage(`❌ Fehlende Pflichtfelder: ${missingLabels}`);
      return;
    }

    if (!company || !company._id) {
      console.error("Error: Company ID is missing!");
      setToastMessage("❌ Fehler: Firmen-ID fehlt!");
      return;
    }

    const { _id, ...updatedData } = {
      ...formData,
      plan_price:
        formData.plan === "BUSINESS"
          ? formData.plan_price || null
          : formData.plan === "PRO"
          ? 899 * 12 * 1.081
          : 799 * 12 * 1.081,
    };

    console.log("Submitting update with data:", updatedData);

    try {
      setIsSaving(true);
      await onSave(company._id, updatedData);
      setToastMessage("Firma erfolgreich aktualisiert!");

      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      setIsSaving(false);
      console.error("Update error:", error);
      setToastMessage("Fehler beim Aktualisieren!");
    }
  };

  if (!company) return null;

  return (
    <div className="modal modal-open">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-box max-w-5xl bg-base-100 shadow-lg rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-base-content">
            Kunde bearbeiten
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          {/* Firmen-Name */}
          <div className="col-span-4">
            <label className="text-sm font-medium">Kunden Name</label>
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
            <label className="text-sm font-medium">Strasse</label>
            <input
              type="text"
              name="company_street"
              value={formData.company_street}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm font-medium">Hausnummer</label>
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
            <label className="text-sm font-medium">PLZ</label>
            <input
              type="text"
              name="company_post_code"
              value={formData.company_post_code}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>
          <div className="col-span-3">
            <label className="text-sm font-medium">Ort</label>
            <input
              type="text"
              name="company_city"
              value={formData.company_city}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>

          {/* Inhaber */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Inhaber</label>
            <input
              type="text"
              name="company_owner"
              value={formData.company_owner}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>

          {/* Firmen-E-Mail */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Kunden E-Mail</label>
            <input
              type="email"
              name="company_email"
              value={formData.company_email}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>
          {/* Ablaufdatum */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Ablaufdatum</label>
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>

          {/* Telefon & Mobile */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Telefon</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium">Mobil</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="input input-sm input-bordered w-full rounded-full"
            />
          </div>

          {/* Manager Selection */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Business Partner</label>
            <select
              name="manager_id"
              value={formData.manager_id}
              onChange={handleChange}
              className="select select-sm select-bordered w-full rounded-full"
            >
              <option value="">-- Business Partner auswählen --</option>
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
          {/* Plan Auswahl */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Plan</label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="select select-sm select-bordered w-full rounded-full"
            >
              <option value="BASIC">BASIC</option>
              <option value="PRO">PRO</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>
          </div>
          {/* Plan Preis (Nur für BUSINESS) */}
          {formData.plan === "BUSINESS" && (
            <div className="col-span-2">
              <label className="text-sm font-medium">Plan Preis (CHF)</label>
              <input
                type="number"
                name="plan_price"
                value={formData.plan_price}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>
          )}

          {/* Markenbotschafter Selection */}
          <div className="col-span-2">
            <label className="text-sm font-medium">Markenbotschafter</label>
            <select
              name="markenbotschafter_id"
              value={formData.markenbotschafter_id}
              onChange={handleChange}
              className="select select-sm select-bordered w-full rounded-full"
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

export default EditCompanyModal;
