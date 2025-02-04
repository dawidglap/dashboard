"use client";
import { useState } from "react";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const CompanyTableRow = ({
  company,
  onEdit,
  onDelete,
  manager,
  markenbotschafter,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Define commission values
  const COMMISSIONS = {
    BASIC: 1000,
    PRO: 1000,
    BUSINESS: 1000,
  };

  // ✅ Calculate Provisionen
  const calculateCommission = () => {
    const baseCommission = COMMISSIONS[company.plan] || 0;

    // If manager is admin, their commission is 0
    const managerCommission = manager?.role === "admin" ? 0 : baseCommission;

    // If markenbotschafter is admin, their commission is 0
    const markenbotschafterCommission =
      markenbotschafter?.role === "admin" ? 0 : baseCommission;

    return managerCommission + markenbotschafterCommission;
  };

  return (
    <>
      <tr
        onClick={() => setShowDetails(true)}
        className="cursor-pointer border-b hover:bg-indigo-50 transition text-sm"
      >
        {/* Firmen-Name */}
        <td className="py-2 px-3 font-semibold">
          {company.company_name || "N/A"}
        </td>

        {/* Plan */}
        <td className="py-2 px-3">{company.plan}</td>

        {/* Plan-Preis */}
        <td className="py-2 px-3">
          CHF{" "}
          {company.plan_price
            ? Number(company.plan_price).toFixed(2)
            : "Nicht verfügbar"}
        </td>

        {/* Inhaber */}
        <td className="py-2 px-3">{company.company_owner || "N/A"}</td>

        {/* Manager */}
        <td className="py-2 px-3">
          {manager
            ? `${manager.name || ""} ${manager.surname || ""}`.trim()
            : "N/A"}
        </td>

        {/* Markenbotschafter */}
        <td className="py-2 px-3">
          {markenbotschafter
            ? `${markenbotschafter.name || ""} ${
                markenbotschafter.surname || ""
              }`.trim()
            : "N/A"}
        </td>

        {/* Ablaufdatum */}
        <td className="py-2 px-3">
          {company.expiration_date
            ? new Date(company.expiration_date).toLocaleDateString("de-DE")
            : "Kein Datum"}
        </td>

        {/* Provisionen */}
        <td className="py-2 px-3 font-bold text-green-600">
          CHF {calculateCommission().toFixed(2)}
        </td>

        {/* Aktionen */}
        <td className="py-2 px-3 flex justify-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row click event
              onEdit(company);
            }}
            className="p-2 rounded hover:bg-indigo-200 transition"
          >
            <FaEdit className="text-indigo-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row click event
              onDelete(company);
            }}
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
