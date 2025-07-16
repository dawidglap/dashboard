"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const MarkenbotschafterCard = ({ mb, isAdmin, onOpenModal }) => {
    const createdAt = new Date(mb.createdAt);
    const zahlungsdatum = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

    return (
        <div className="bg-white dark:bg-base-100 border border-gray-100 shadow rounded-xl p-4 space-y-2 text-xs sm:text-sm">
            <div className="font-bold text-base-content">
                {mb.name} {mb.surname}
            </div>

            <div className="space-y-1 text-sm">
                <p><strong>Provision:</strong> <span className="text-green-600 font-semibold">300 CHF</span></p>
                <p><strong>Startdatum:</strong> {createdAt.toLocaleDateString("de-DE")}</p>
                <p><strong>Zahlungsdatum:</strong> {zahlungsdatum.toLocaleDateString("de-DE")}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-medium">Bezahlt:</p>
                {isAdmin ? (
                    <motion.button
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${mb.status_provisionen_markenbotschafter ? "border-green-500" : "border-gray-400"}`}
                        onClick={() => onOpenModal(mb._id)}
                        aria-label="Toggle Bezahlt"
                    >
                        {mb.status_provisionen_markenbotschafter ? (
                            <Check className="text-green-600" size={18} />
                        ) : (
                            <X className="text-gray-500" size={18} />
                        )}
                    </motion.button>
                ) : (
                    <motion.div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${mb.status_provisionen_markenbotschafter ? "border-green-500" : "border-gray-400"}`}
                        aria-label="Bezahlt Status (readonly)"
                    >
                        {mb.status_provisionen_markenbotschafter ? (
                            <Check className="text-green-600" size={18} />
                        ) : (
                            <X className="text-gray-500" size={18} />
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MarkenbotschafterCard;
