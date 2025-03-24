"use client";

import { motion } from "framer-motion";

const DeleteCompanyModal = ({ company, onDelete, onCancel }) => {
  if (!company) return null; // Don't render if no company is selected

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
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-red-500">Firma löschen</h3>
        </div>

        {/* Content */}
        <div className="mt-6 text-">
          <p className="text-lg font-semibold text-base-content">
            Sind Sie sicher, dass Sie die Firma{" "}
            <span className="font-bold text-error">
              {company.company_name || "Unbenannt"}
            </span>{" "}
            löschen möchten?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="btn btn-sm btn-outline rounded-full"
          >
            Abbrechen
          </button>
          <button
            onClick={onDelete}
            className="btn btn-sm btn-error text-white rounded-full"
          >
            Löschen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteCompanyModal;
