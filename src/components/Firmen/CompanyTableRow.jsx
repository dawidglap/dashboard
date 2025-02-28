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
  userRole, // ✅ Get user role from props
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

  // ✅ Format Number (Swiss Style)
  const formatNumber = (value) => {
    return new Intl.NumberFormat("de-CH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <tr className=" dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-slate-900 transition text-sm border-b border-gray-200 dark:border-slate-700">
        {/* Firmen-Name */}
        <td
          onClick={() => setShowDetails(true)}
          className="py-5 px-4 font-semibold cursor-pointer"
        >
          {company.company_name || "N/A"}
        </td>

        {/* Plan */}
        <td className="py-5 px-4">{company.plan}</td>

        {/* ✅ Formatted Plan-Preis */}
        <td className="py-5 px-4 text-center">
          {company.plan_price
            ? formatNumber(company.plan_price)
            : "Nicht verfügbar"}
        </td>

        {/* Inhaber */}
        <td className="py-5 px-4">{company.company_owner || "N/A"}</td>

        {/* Manager */}
        <td className="py-5 px-4">
          {manager
            ? `${manager.name || ""} ${manager.surname || ""}`.trim()
            : "N/A"}
        </td>

        {/* Markenbotschafter */}
        <td className="py-5 px-4">
          {markenbotschafter
            ? `${markenbotschafter.name || ""} ${
                markenbotschafter.surname || ""
              }`.trim()
            : "N/A"}
        </td>

        {/* Ablaufdatum */}
        <td className="py-5 px-4">
          {company.expiration_date
            ? new Date(company.expiration_date).toLocaleDateString("de-DE")
            : "Kein Datum"}
        </td>

        {/* ✅ Formatted Provisionen */}
        <td className="py-5 px-4 text-center">
          {formatNumber(calculateCommission())}
        </td>

        {/* Aktionen */}
        <td className="py-5 px-4 flex justify-center items-center h-full space-x-2">
          {/* ✅ Disable Buttons for non-admins */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row click event
              onEdit(company);
            }}
            disabled={userRole !== "admin"} // ✅ Disable for non-admins
            className="btn btn-xs rounded-full btn-outline btn-neutral disabled:opacity-50"
          >
            <FaEdit />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ Prevent row click event
              onDelete(company);
            }}
            disabled={userRole !== "admin"} // ✅ Disable for non-admins
            className="btn btn-xs rounded-full btn-outline btn-error disabled:opacity-50"
          >
            <FaTrash />
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
