"use client";

import { useState, useEffect } from "react";
import useCompanyForm from "../../hooks/useCompanyForm";

const NewCompanyModal = ({ isOpen, onClose, onSubmit }) => {
  const { formData, handleChange, setFormData } = useCompanyForm({
    company_name: "",
    company_address: "",
    plan: "BASIC",
    company_owner: "",
    plan_price: "",
    expiration_date: "",
    manager_id: "",
    markenbotschafter_id: "",
  });

  const [managers, setManagers] = useState([]);
  const [markenbotschafters, setMarkenbotschafters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch managers & markenbotschafters when the modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
        const data = await res.json();

        setManagers(
          data.users.filter(
            (user) => user.role === "manager" || user.role === "admin"
          )
        );

        setMarkenbotschafters(
          data.users.filter(
            (user) => user.role === "markenbotschafter" || user.role === "admin"
          )
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.manager_id || !formData.markenbotschafter_id) {
      alert("Bitte wählen Sie einen Manager und einen Markenbotschafter aus.");
      return;
    }

    onSubmit(formData);
    setFormData({
      company_name: "",
      company_address: "",
      plan: "BASIC",
      company_owner: "",
      plan_price: "",
      expiration_date: "",
      manager_id: "",
      markenbotschafter_id: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Neue Firma hinzufügen</h3>

        {loading ? (
          <p>Lade Benutzer...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Firmen-Name</span>
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Firmen-Adresse</span>
              </label>
              <input
                type="text"
                name="company_address"
                value={formData.company_address}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Plan</span>
              </label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="BASIC">BASIC</option>
                <option value="PRO">PRO</option>
                <option value="BUSINESS">BUSINESS</option>
              </select>
            </div>

            {formData.plan === "BUSINESS" && (
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Plan-Preis</span>
                </label>
                <input
                  type="number"
                  name="plan_price"
                  value={formData.plan_price}
                  onChange={handleChange}
                  className="input input-bordered"
                />
              </div>
            )}

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Inhaber</span>
              </label>
              <input
                type="text"
                name="company_owner"
                value={formData.company_owner}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Ablaufdatum</span>
              </label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Manager Auswahl */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Manager</span>
              </label>
              <select
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">-- Wählen Sie einen Manager --</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name} {manager.surname} ({manager.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Markenbotschafter Auswahl */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Markenbotschafter</span>
              </label>
              <select
                name="markenbotschafter_id"
                value={formData.markenbotschafter_id}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value="">
                  -- Wählen Sie einen Markenbotschafter --
                </option>
                {markenbotschafters.map((bot) => (
                  <option key={bot._id} value={bot._id}>
                    {bot.name} {bot.surname} ({bot.email})
                  </option>
                ))}
              </select>
            </div>
          </form>
        )}

        <div className="modal-action">
          <button onClick={handleSubmit} className="btn btn-success">
            Speichern
          </button>
          <button onClick={onClose} className="btn btn-error">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCompanyModal;
