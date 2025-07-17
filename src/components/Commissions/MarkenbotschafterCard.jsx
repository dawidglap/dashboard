"use client";

import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

const MarkenbotschafterCard = ({ mb, isAdmin, onOpenModal }) => {
    const createdAt = new Date(mb.createdAt);
    const zahlungsdatum = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

    return (
        <div className="bg-base-100 border rounded-xl shadow-sm p-4 space-y-2 text-xs sm:text-sm">
            {/* Titolo: Nome markenbotschafter */}
            <div className="font-bold text-sm sm:text-base leading-snug">
                {mb.name} {mb.surname}
            </div>
            <div className="border-b border-indigo-400 mt-2 mb-1 block sm:hidden" />

            {/* Blocchi info */}
            <div className="space-y-1">
                <p>
                    <strong>Provision:</strong>{" "}
                    <span className="text-green-600 font-semibold">300 CHF</span>
                </p>
                <p>
                    <strong>Startdatum:</strong> {createdAt.toLocaleDateString("de-DE")}
                </p>
                <p>
                    <strong>Zahlungsdatum:</strong> {zahlungsdatum.toLocaleDateString("de-DE")}
                </p>
                <p className="flex items-center gap-2">
                    <strong>Bezahlt:</strong>
                    {isAdmin ? (
                        <button
                            onClick={() => onOpenModal(mb._id)}
                            className={`font-semibold ${mb.status_provisionen_markenbotschafter ? "text-green-600" : "text-red-500"
                                } underline underline-offset-4`}
                        >
                            {mb.status_provisionen_markenbotschafter ? "Ja" : "Noch nicht"}
                        </button>
                    ) : (
                        <span
                            className={`font-semibold ${mb.status_provisionen_markenbotschafter ? "text-green-600" : "text-red-500"
                                }`}
                        >
                            {mb.status_provisionen_markenbotschafter ? "Ja" : "Noch nicht"}
                        </span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default MarkenbotschafterCard;
