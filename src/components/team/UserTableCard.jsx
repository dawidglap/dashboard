"use client";

import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTableCard = ({ user, onEdit, onDelete, userRole, onView }) => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow p-4 space-y-3 text-sm">
            {/* Titolo + Azioni */}
            <div className="flex justify-between items-start">
                <div>
                    <h2
                        className="font-bold text-base text-indigo-700 dark:text-indigo-300 leading-tight hover:underline cursor-pointer"
                        onClick={() => onView(user._id)}
                        title="Details anzeigen"
                    >
                        {user.name} {user.surname}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                    </p>
                    <div className="border-b border-indigo-400 mt-2 mb-1 block lg:hidden" />
                </div>

                {userRole === "admin" && (
                    <div className="flex gap-2 text-base text-gray-500">
                        <button
                            onClick={() => onEdit(user)}
                            className="hover:text-indigo-600 transition"
                            title="Bearbeiten"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={() => onDelete(user)}
                            className="text-red-500 hover:text-red-600 transition"
                            title="Löschen"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            {/* Blocco dettagli */}
            <div className="space-y-1">
                <p>
                    <span className="font-semibold">Geburtstag:</span>{" "}
                    {user.birthday || "—"}
                </p>
                <p>
                    <span className="font-semibold">Rolle:</span>{" "}
                    <span className="uppercase">{user.role}</span>
                </p>
            </div>
        </div>
    );
};

export default UserTableCard;
