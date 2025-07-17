"use client";

import React from "react";

const MemberCard = ({ user }) => {
    const truncatedLink = `https://business.webomo.ch/ref=${user._id}`;

    return (
        <div className="bg-white shadow rounded-xl p-4 border border-gray-100 space-y-3 text-xs sm:text-sm">
            {/* Nome completo */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-bold text-sm sm:text-base leading-snug">
                        {user.name} {user.surname}
                    </h2>
                    {/* linea divisoria su mobile */}
                    <div className="border-b border-indigo-400 mt-2 mb-1 block lg:hidden" />
                </div>
            </div>

            {/* Affiliate Link troncato */}
            <div className="space-y-1">
                <p className="text-gray-600">
                    <strong>Affiliate Link:</strong>
                </p>
                <div className="text-xs text-gray-500 truncate max-w-full cursor-default">
                    {truncatedLink.slice(0, 37)}...
                </div>
            </div>

            {/* Data di creazione */}
            <div className="space-y-1">
                <p>
                    <strong>Erstellt am:</strong>{" "}
                    {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("de-DE")
                        : "—"}
                </p>
            </div>
        </div>
    );
};

export default MemberCard;
