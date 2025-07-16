"use client";

import React from "react";

const CompanyFilters = ({
    users,
    selectedManager,
    selectedMarkenbotschafter,
    onManagerChange,
    onMarkenbotschafterChange,
    userRole,
    currentUserId,
}) => {
    // ✅ Filtra solo i manager e markenbotschafter dalla lista utenti
    const managers = users.filter((user) => user.role === "manager");

    const markenbotschafters =
        userRole === "admin"
            ? users.filter((user) => user.role === "markenbotschafter")
            : users.filter(
                (user) =>
                    user.role === "markenbotschafter" &&
                    user.manager_id === currentUserId
            );


    return (
        <div className="w-full flex xl:flex-row flex-col gap-4 xl:items-center xl:justify-start">


            {/* Manager Filter */}
            {userRole === "admin" && (
                <select
                    className="select select-sm select-bordered rounded-full bg-indigo-100 text-sm
  w-full sm:w-2/3 md:w-1/2 xl:w-auto"

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
            )}


            {/* Markenbotschafter Filter */}
            <select
                className="select select-sm select-bordered rounded-full bg-indigo-100 text-sm
  w-full sm:w-2/3 md:w-1/2 xl:w-auto"

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
