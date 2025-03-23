"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";
import { FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const formatSwissPhoneNumber = (number = "") => {
  const digits = number.replace(/\D/g, "").slice(0, 14);
  if (digits.length === 10)
    return digits.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  return digits;
};


const NewCompanyModal = ({ isOpen, onClose, onSubmit }) => {
  const adminId = "679396cd375db32de1bbfd01"; // Default Admin ID
  const today = new Date().toISOString().split("T")[0]; // ✅ Ensure only future dates can be selected
  const [fieldErrors, setFieldErrors] = useState({});

  // ✅ Function to calculate price based on the selected plan
  function calculatePlanPrice(plan) {
    const PREDEFINED_PRICES = {
      BASIC: 799 * 12 * 1.081,
      PRO: 899 * 12 * 1.081,
      BUSINESS: "", // Empty for manual input
    };
    return PREDEFINED_PRICES[plan] || "";
  }

  const { formData, handleChange, setFormData } = useCompanyForm({
    company_name: "",
    company_street: "",
    company_owner: "",
    company_street_number: "",
    company_post_code: "",
    company_city: "",
    company_email: "",
    telephone: "",
    mobile: "",
    plan: "BASIC",
    company_owner: "",
    plan_price: calculatePlanPrice("BASIC"),
    expiration_date: new Date(
      new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime() - 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
    
    
    manager_id: adminId, // Default to Admin
    markenbotschafter_id: adminId, // Default to Admin
  });

  const [users, setUsers] = useState([]); // Store users
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Track saving state
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [filteredMarkenbotschafter, setFilteredMarkenbotschafter] = useState([]);


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

  useEffect(() => {
    if (!formData.manager_id || !users.length) {
      setFilteredMarkenbotschafter([]);
      return;
    }
  
    const filtered = users.filter(
      (user) =>
        user.role === "markenbotschafter" &&
        user.manager_id === formData.manager_id
    );
  
    setFilteredMarkenbotschafter(filtered);
  }, [formData.manager_id, users]);
  

  // ✅ Reset loading state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
      setToastMessage(null);
    }
  }, [isOpen]);

  // ✅ Handle Plan Change
  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    const price = calculatePlanPrice(selectedPlan);

    setFormData((prev) => ({
      ...prev,
      plan: selectedPlan,
      plan_price: price, // Auto-set price (empty for BUSINESS)
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      { name: "company_name", label: "Kunden Name" },
      { name: "company_street", label: "Strasse" },
      { name: "company_post_code", label: "PLZ" },
      { name: "company_city", label: "Ort" },
      { name: "company_email", label: "Kunden-E-Mail" },
    ];

    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field.name]) {
        newErrors[field.name] = `${field.label} ist erforderlich`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      setFieldErrors({}); // Clear previous errors

      const finalData = {
        ...formData,
        company_owner: formData.company_owner || "Unbekannt",
        manager_id: formData.manager_id || adminId,
        markenbotschafter_id: formData.markenbotschafter_id || adminId,
      };

      await onSubmit(finalData);
      setToastMessage("Firma erfolgreich hinzugefügt!");

      // Reset form & close after success
      setTimeout(() => {
        setToastMessage(null);
        setFieldErrors({});
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
          expiration_date: today,
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
            Neuen Kunden erstellen
          </h3>
        </div>

        {loadingUsers ? (
          <p className="text-center text-lg font-medium">Lade Benutzer...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-6 gap-3 mt-6">
            {/* Firmen-Name */}
            <div className="col-span-3">
              <label className="text-sm font-medium"> Kunden Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.company_name}
                </p>
              )}
            </div>

            {/* Company Owner */}
            <div className="col-span-3">
              <label className="text-sm font-medium">
                Inhaber (Firmenbesitzer)
              </label>
              <input
                type="text"
                name="company_owner"
                value={formData.company_owner}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Straße & Hausnummer */}
            <div className="col-span-4">
              <label className="text-sm font-medium"> Strasse</label>
              <input
                type="text"
                name="company_street"
                value={formData.company_street}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.company_street}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">Nr.</label>
              <input
                type="text"
                maxlength="10"
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
                maxlength="7"
                value={formData.company_post_code}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.company_post_code}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium"> Ort</label>
              <input
                type="text"
                name="company_city"
                value={formData.company_city}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.company_city}
                </p>
              )}
            </div>

            {/* Ablaufdatum */}
            {/* Startdatum */}
<div className="col-span-1">
  <label className="text-sm font-medium">Startdatum</label>
  <input
    type="date"
    value={today}
    readOnly
    className="input input-sm input-bordered w-full rounded-full"
  />
</div>

            <div className="col-span-1">
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
              <label className="text-sm font-medium"> Kunden-E-Mail</label>
              <input
                type="email"
                name="company_email"
                value={formData.company_email}
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.company_email}
                </p>
              )}
            </div>

            {/* Telefon & Mobile */}
            <div className="col-span-2">
              <label className="text-sm font-medium"> Telefon</label>
              <input
                type="tel"
                name="telephone"
                value={formatSwissPhoneNumber(formData.telephone)}
                onChange={handleChange}
                maxLength={14}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium"> Mobil</label>
              <input
                type="tel"
                name="mobile"
                value={formatSwissPhoneNumber(formData.mobile)}
                onChange={handleChange}
                maxLength={14}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Plan Selection */}
            <div className="col-span-1">
              <label className="text-sm font-medium">Plan</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handlePlanChange}
                className="select select-sm select-bordered w-full rounded-full"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
                <option value="BUSINESS">BUSINESS</option>
              </select>
            </div>

            {/* Plan Price */}
            <div className="col-span-1">
              <label className="text-sm font-medium">Plan Preis (CHF)</label>
              <input
                type="number"
                name="plan_price"
                value={Math.round(formData.plan_price)} // ✅ Round to whole number
                onChange={handleChange}
                className="input input-sm input-bordered w-full rounded-full"
                disabled={formData.plan !== "BUSINESS"} // ✅ Lock for BASIC/PRO
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

  {filteredMarkenbotschafter.map((user) => (
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
