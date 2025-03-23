"use client";

import { motion } from "framer-motion";

const PaidCommissionModal = ({ company, onConfirm, onCancel }) => {
    if (!company) return null;

    return (
        <div className="modal modal-open">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="modal-box max-w-lg bg-base-100 shadow-lg rounded-2xl p-8"
            >
                {/* Header */}
                <h3 className="text-xl font-bold text-primary border-b pb-3">
                    Provision als bezahlt markieren
                </h3>

                {/* Beschreibung */}
                <p className="py-6 text-base-content">
                    Möchten Sie wirklich die Provision für{" "}
                    <span className="font-semibold">{company.company_name}</span>{" "}
                    als <span className="text-green-600 font-semibold">bezahlt</span> markieren?
                </p>

                {/* Aktionen */}
                <div className="modal-action flex justify-between">
                    <button
                        onClick={onCancel}
                        className="btn btn-sm btn-outline rounded-full"
                    >
                        Abbrechen
                    </button>
                    <button
                        onClick={onConfirm}
                        className="btn btn-sm btn-success rounded-full"
                    >
                        Bestätigen
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaidCommissionModal;
