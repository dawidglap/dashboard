"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";

const Firmen = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null); // State for deletion confirmation
  const [toastMessage, setToastMessage] = useState(""); // For displaying toast messages
  const [editing, setEditing] = useState(null); // Track the company being edited
  const [formData, setFormData] = useState({}); // Track the form inputs for editing
  const [newCompany, setNewCompany] = useState({
    company_name: "",
    plan: "BASIC",
    company_owner: "",
  }); // Data for the new company
  const [showModal, setShowModal] = useState(false); // Modal state

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

  const calculateExpirationDate = (createdAt) => {
    const createdDate = new Date(createdAt);
    createdDate.setFullYear(createdDate.getFullYear() + 1); // Add 1 year
    return createdDate.toLocaleDateString("de-DE");
  };

  const handleEdit = (company) => {
    setEditing(company._id);
    setFormData({
      company_name: company.company_name || "",
      plan: company.plan,
      company_owner: company.company_owner || "",
      plan_price: company.plan_price || "", // Add plan_price here
      expiration_date: company.expiration_date
        ? company.expiration_date.slice(0, 10)
        : "", // Format expiration_date for input
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
  };

  const handleSave = async (id) => {
    if (formData.plan === "BUSINESS" && !formData.plan_price) {
      setToastMessage("Bitte geben Sie den Planpreis für BUSINESS an.");
      return;
    }

    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          plan_price: formData.plan_price || null, // Ensure plan_price is included
        }),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren der Firma.");

      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...formData } : company
        )
      );

      setEditing(null);
      setFormData({});
    } catch (error) {
      alert("Fehler beim Aktualisieren: " + error.message);
    }
  };

  const handleDelete = async () => {
    if (!companyToDelete) return; // No company selected for deletion

    try {
      const res = await fetch(`/api/companies/${companyToDelete._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen der Firma.");

      setCompanies((prev) =>
        prev.filter((company) => company._id !== companyToDelete._id)
      );
      setCompanyToDelete(null); // Close the modal after deletion
    } catch (error) {
      alert("Fehler beim Löschen: " + error.message);
    }
  };

  const handleNewCompanyChange = (e) => {
    const { name, value } = e.target;

    if (editing) {
      // Editing an existing company
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      // Adding a new company
      setNewCompany((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNewCompanySubmit = async () => {
    if (newCompany.plan === "BUSINESS" && !newCompany.plan_price) {
      setToastMessage("Bitte geben Sie den Planpreis für BUSINESS an.");
      return;
    }

    const companyData = {
      ...newCompany,
      expiration_date: newCompany.expiration_date,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(companyData),
      });

      if (!res.ok) throw new Error("Fehler beim Hinzufügen der neuen Firma.");

      const data = await res.json();
      setCompanies((prev) => [...prev, { ...companyData, _id: data.data }]);
      setNewCompany({
        company_name: "",
        plan: "BASIC",
        company_owner: "",
        plan_price: "",
        expiration_date: "",
      });
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      alert("Fehler beim Hinzufügen: " + error.message);
    }
  };

  if (loading)
    return (
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Firmen</h1>
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          {/* Skeleton loading */}
          <div className="flex justify-center py-10">
            <progress className="progress w-56"></progress>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-lg text-red-500">{error}</p>
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
      {companyToDelete && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-500">
              Firma löschen: {companyToDelete.company_name || "Unbenannt"}
            </h3>
            <p className="py-4">
              Sind Sie sicher, dass Sie diese Firma löschen möchten? Diese
              Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Löschen
              </button>
              <button
                onClick={() => setCompanyToDelete(null)}
                className="btn btn-neutral"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="toast">
          <div className="alert alert-error">
            <span>{toastMessage}</span>
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setToastMessage("")}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Firmen-Name</th>
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Plan</th>
              <th className="py-4 px-6">Plan-Preis</th>
              <th className="py-4 px-6">Inhaber</th>
              <th className="py-4 px-6">Ablaufdatum</th>
              <th className="py-4 px-6">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr
                key={company._id}
                className={`${index % 2 === 0 ? "bg-gray-50" : ""}`}
              >
                {/* Firmen-Name */}
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name || ""}
                      onChange={handleNewCompanyChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    company.company_name || "N/A"
                  )}
                </td>

                {/* Firmen-ID */}
                <td className="py-4 px-6">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip={company._id}
                  >
                    {company._id.slice(0, 3)}...{company._id.slice(-3)}
                  </div>
                </td>

                {/* Plan */}
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleNewCompanyChange}
                      className="select select-bordered select-sm w-full"
                    >
                      <option value="BASIC">BASIC</option>
                      <option value="PRO">PRO</option>
                      <option value="BUSINESS">BUSINESS</option>
                    </select>
                  ) : (
                    company.plan
                  )}
                </td>

                {/* Plan-Price */}
                <td className="py-4 px-6">
                  {editing === company._id && formData.plan === "BUSINESS" ? (
                    <input
                      type="number"
                      name="plan_price"
                      value={formData.plan_price || ""}
                      onChange={handleNewCompanyChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : company.plan === "BASIC" ? (
                    "CHF 9,323.88" // Price for BASIC
                  ) : company.plan === "PRO" ? (
                    "CHF 10,426.92" // Price for PRO
                  ) : company.plan === "BUSINESS" && company.plan_price ? (
                    `CHF ${Number(company.plan_price).toFixed(2)}`
                  ) : (
                    "Kein Preis angegeben"
                  )}
                </td>

                {/* Inhaber */}
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <input
                      type="text"
                      name="company_owner"
                      value={formData.company_owner}
                      onChange={handleNewCompanyChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    company.company_owner || "N/A"
                  )}
                </td>

                {/* Ablaufdatum */}
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <input
                      type="date"
                      name="expiration_date"
                      value={
                        formData.expiration_date
                          ? formData.expiration_date.slice(0, 10) // Format to YYYY-MM-DD
                          : ""
                      }
                      onChange={handleNewCompanyChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : company.expiration_date ? (
                    new Date(company.expiration_date).toLocaleDateString(
                      "de-DE"
                    )
                  ) : (
                    "Kein Datum"
                  )}
                </td>

                {/* Aktionen */}
                <td className="py-4 px-6 space-x-2">
                  {editing === company._id ? (
                    <>
                      <button
                        onClick={() => handleSave(company._id)}
                        className="btn btn-success btn-xs"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-error btn-xs"
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(company)}
                        className="btn btn-neutral btn-xs"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setCompanyToDelete(company)}
                        className="btn btn-error btn-xs"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for new company */}
      {showModal && (
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
                  value={newCompany.company_name}
                  onChange={handleNewCompanyChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Plan</span>
                </label>
                <select
                  name="plan"
                  value={newCompany.plan}
                  onChange={handleNewCompanyChange}
                  className="select select-bordered"
                >
                  <option value="BASIC">BASIC</option>
                  <option value="PRO">PRO</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>

              {newCompany.plan === "BUSINESS" && (
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Plan-Preis</span>
                  </label>
                  <input
                    type="number"
                    name="plan_price"
                    value={newCompany.plan_price || ""}
                    onChange={handleNewCompanyChange}
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
                  value={newCompany.company_owner}
                  onChange={handleNewCompanyChange}
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
                  value={newCompany.expiration_date}
                  onChange={handleNewCompanyChange}
                  className="input input-bordered"
                />
              </div>
            </form>

            <div className="modal-action">
              <button
                onClick={handleNewCompanySubmit}
                className="btn btn-success"
              >
                Speichern
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-error"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Firmen;
