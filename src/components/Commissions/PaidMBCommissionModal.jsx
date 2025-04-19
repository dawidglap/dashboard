"use client";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const PaidMBCommissionModal = ({ markenbotschafter, onConfirm, onCancel }) => {
    const { data: session } = useSession();

    if (!markenbotschafter) return null;

    return (
        <div className="modal modal-open">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="modal-box max-w-lg bg-base-100 shadow-lg rounded-2xl p-8"
            >
                <h3 className="text-xl font-bold text-black border-b pb-3">
                    Provision als {markenbotschafter.status_provisionen_markenbotschafter ? "nicht bezahlt" : "bezahlt"} markieren
                </h3>

                <p className="py-6 text-base-content">
                    Möchten Sie wirklich die Provision für{" "}
                    <span className="font-semibold">
                        {markenbotschafter.name} {markenbotschafter.surname}
                    </span>{" "}
                    als{" "}
                    <span
                        className={
                            markenbotschafter.status_provisionen_markenbotschafter
                                ? "text-red-500 font-semibold"
                                : "text-green-600 font-semibold"
                        }
                    >
                        {markenbotschafter.status_provisionen_markenbotschafter
                            ? "nicht bezahlt"
                            : "bezahlt"}
                    </span>{" "}
                    markieren?
                </p>

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

export default PaidMBCommissionModal;
