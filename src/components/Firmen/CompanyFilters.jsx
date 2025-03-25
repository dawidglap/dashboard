"use client";

import React from "react";

const CompanyFilters = ({
    users,
    selectedManager,
    selectedMarkenbotschafter,
    onManagerChange,
    onMarkenbotschafterChange,
}) => {
    // ✅ Filtra solo i manager e markenbotschafter dalla lista utenti
    const managers = users.filter((user) => user.role === "manager");
    const markenbotschafters = users.filter(
        (user) => user.role === "markenbotschafter"
    );

    return (
        <div className="flex flex-wrap gap-4 py-2">
            {/* Manager Filter */}
            <select
                className="p-2 px-4 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
                value={selectedManager}
                onChange={(e) => onManagerChange(e.target.value)}
            >
                <option value="">Alle Manager</option>
                {managers.map((manager) => (
                    <option key={manager._id} value={manager._id}>
                        {manager.name} {manager.surname}
                    </option>
                ))}
            </select>

            {/* Markenbotschafter Filter */}
            <select
                className="p-2 px-4 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
                value={selectedMarkenbotschafter}
                onChange={(e) => onMarkenbotschafterChange(e.target.value)}
            >
                <option value="">Alle Markenbotschafter</option>
                {markenbotschafters.map((mb) => (
                    <option key={mb._id} value={mb._id}>
                        {mb.name} {mb.surname}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CompanyFilters;
