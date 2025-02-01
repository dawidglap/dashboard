"use client";

import { FaEdit, FaTrash } from "react-icons/fa";

const CompanyTableRow = ({ company, index, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-indigo-50 transition text-sm">
      {/* Index */}
      <td className="py-2 px-3">{index}</td>

      {/* Firmen-Name */}
      <td className="py-2 px-3 font-semibold">
        {company.company_name || "N/A"}
      </td>

      {/* Firmen-ID (Tooltip) */}
      <td className="py-2 px-3">
        <div className="tooltip tooltip-bottom" data-tip={company._id}>
          {company._id.slice(0, 3)}...{company._id.slice(-3)}
        </div>
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
  );
};

export default CompanyTableRow;
