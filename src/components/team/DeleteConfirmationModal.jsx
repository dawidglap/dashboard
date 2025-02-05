"use client";

import { motion } from "framer-motion";

const DeleteConfirmationModal = ({ user, onDelete, onCancel }) => {
  if (!user) return null;

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
        <h3 className="text-xl font-bold text-error border-b pb-3">
          Benutzer löschen
        </h3>

        {/* Description */}
        <p className="py-6 text-base-content">
          Sind Sie sicher, dass Sie{" "}
          <span className="font-semibold">{user.name || "Unbenannt"}</span>{" "}
          löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        {/* Actions */}
        <div className="modal-action flex justify-between">
          <button
            onClick={onCancel}
            className="btn btn-sm btn-outline rounded-full"
          >
            Abbrechen
          </button>
          <button
            onClick={onDelete}
            className="btn btn-sm btn-error rounded-full"
          >
            Löschen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteConfirmationModal;
