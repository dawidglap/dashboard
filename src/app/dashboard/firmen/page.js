"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

const Firmen = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null); // Track the company being edited
  const [formData, setFormData] = useState({}); // Track the form inputs for editing

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
    });
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({});
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren der Firma.");

      // Update the UI
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === id ? { ...company, ...formData } : company
        )
      );

      setEditing(null); // Exit edit mode
      setFormData({});
    } catch (error) {
      alert("Fehler beim Aktualisieren: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Möchten Sie diese Firma wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen der Firma.");

      // Update the UI
      setCompanies((prev) => prev.filter((company) => company._id !== id));
    } catch (error) {
      alert("Fehler beim Löschen: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Firmen</h1>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Firmen-ID</th>
              <th className="py-4 px-6">Firmen-Name</th>
              <th className="py-4 px-6">Plan</th>
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
                <td className="py-4 px-6">{company._id}</td>
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    company.company_name || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
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
                <td className="py-4 px-6">
                  {editing === company._id ? (
                    <input
                      type="text"
                      name="company_owner"
                      value={formData.company_owner}
                      onChange={handleChange}
                      className="input input-bordered input-sm w-full"
                    />
                  ) : (
                    company.company_owner || "N/A"
                  )}
                </td>
                <td className="py-4 px-6">
                  {calculateExpirationDate(company.created_at)}
                </td>
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
                        className="btn btn-secondary btn-xs"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
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
    </div>
  );
};

export default Firmen;
