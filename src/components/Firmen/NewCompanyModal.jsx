"use client";

import useCompanyForm from "../../hooks/useCompanyForm";

const NewCompanyModal = ({ isOpen, onClose, onSubmit }) => {
  const { formData, handleChange, setFormData } = useCompanyForm({
    company_name: "",
    plan: "BASIC",
    company_owner: "",
    plan_price: "",
    expiration_date: "",
  });

  const handleSubmit = () => {
    if (formData.plan === "BUSINESS" && !formData.plan_price) {
      alert("Bitte geben Sie den Planpreis für BUSINESS an.");
      return;
    }
    onSubmit(formData);
    setFormData({
      company_name: "",
      plan: "BASIC",
      company_owner: "",
      plan_price: "",
      expiration_date: "",
    });
    onClose();
  };

  if (!isOpen) return null; // Don't render if the modal is closed

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Neue Firma hinzufügen</h3>
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
        </form>

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
