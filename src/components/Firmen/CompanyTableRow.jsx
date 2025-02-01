"use client";
import { useState } from "react";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const CompanyTableRow = ({
  company,
  index,
  onEdit,
  onDelete,
  managerName,
  markenbotschafterName,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <>
      <tr
        onClick={() => setShowDetails(true)}
        className={`cursor-pointer border-b hover:bg-indigo-50 transition text-sm ${
          !company.manager_id || !company.markenbotschafter_id
            ? "bg-yellow-100"
            : ""
        }`}
      >
        {/* Firmen-Name */}
        <td className="py-2 px-3 font-semibold">
          {company.company_name || "N/A"}
        </td>

        {/* Plan */}
        <td className="py-2 px-3">{company.plan}</td>

        {/* Plan-Preis */}
        <td className="py-2 px-3">
          {company.plan === "BASIC"
            ? "CHF 9,323.88"
            : company.plan === "PRO"
            ? "CHF 10,426.92"
            : company.plan === "BUSINESS" && company.plan_price
            ? `CHF ${Number(company.plan_price).toFixed(2)}`
            : "Kein Preis angegeben"}
        </td>

        {/* Inhaber */}
        <td className="py-2 px-3">{company.company_owner || "N/A"}</td>

        {/* Manager */}
        <td className="py-2 px-3">{managerName}</td>

        {/* Markenbotschafter */}
        <td className="py-2 px-3">{markenbotschafterName}</td>

        {/* Ablaufdatum */}
        <td className="py-2 px-3">
          {company.expiration_date
            ? new Date(company.expiration_date).toLocaleDateString("de-DE")
            : "Kein Datum"}
        </td>

        {/* Aktionen */}
        <td className="py-2 px-3 flex justify-center space-x-2">
          <button
            onClick={() => onEdit(company)}
            className="p-2 rounded hover:bg-indigo-200 transition"
          >
            <FaEdit className="text-indigo-500" />
          </button>
          <button
            onClick={() => onDelete(company)}
            className="p-2 rounded hover:bg-red-200 transition"
          >
            <FaTrash className="text-red-500" />
          </button>
        </td>
      </tr>
      {showDetails && (
        <CompanyDetailsModal
          company={company}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default CompanyTableRow;
