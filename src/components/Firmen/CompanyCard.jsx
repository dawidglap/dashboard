"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// ✅ Format number (CHF style)
const formatNumber = (value) => {
    return new Intl.NumberFormat("de-CH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const CompanyCard = ({
    company,
    manager,
    markenbotschafter,
    onEdit,
    onDelete,
    userRole,
}) => {
    // ✅ Define commission values
    const COMMISSIONS = {
        BASIC: 1000,
        PRO: 1000,
        BUSINESS: 1000,
    };

    // ✅ Calculate Provisionen
    const calculateCommission = () => {
        const baseCommission = COMMISSIONS[company.plan] || 0;
        const managerCommission = manager?.role === "admin" ? 0 : baseCommission;
        const mbCommission = markenbotschafter?.role === "admin" ? 0 : baseCommission;

        return managerCommission + mbCommission;
    };

    return (
        <div className="bg-white shadow rounded-xl p-4 border border-gray-100 space-y-3 text-xs sm:text-sm">
            {/* Titolo + Azioni */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-bold text-sm sm:text-base leading-snug">
                        {company.company_name || "N/A"}
                    </h2>
                    {/* Breaking rule visibile solo su mobile */}
                    <div className="border-b border-indigo-400 mt-2 mb-1 block sm:hidden" />
                </div>

                {userRole === "admin" && (
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(company)} className="text-indigo-500 hover:text-indigo-700">
                            <FaEdit />
                        </button>
                        <button onClick={() => onDelete(company)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            {/* Blocco Prezzo e Inhaber */}
            <div className="space-y-1">
                <p><strong>Preis:</strong> {company.plan_price ? formatNumber(company.plan_price) : "—"}</p>
                <p><strong>Inhaber:</strong> {company.company_owner || "—"}</p>
            </div>

            {/* Blocco Manager e Markenbotschafter */}
            <div className="space-y-1">
                <p><strong>Manager:</strong> {manager ? `${manager.name || ""} ${manager.surname || ""}`.trim() : "—"}</p>
                <p><strong>Markenbotschafter:</strong> {markenbotschafter ? `${markenbotschafter.name || ""} ${markenbotschafter.surname || ""}`.trim() : "—"}</p>
            </div>

            {/* Blocco Termine e Provision */}
            <div className="space-y-1">
                <p><strong>Ablauf:</strong> {company.expiration_date ? new Date(company.expiration_date).toLocaleDateString("de-DE") : "—"}</p>
                <p><strong>Provision:</strong> {userRole === "markenbotschafter" ? formatNumber(calculateCommission() / 2) : formatNumber(calculateCommission())}</p>
            </div>
        </div>



    );
};

export default CompanyCard;
