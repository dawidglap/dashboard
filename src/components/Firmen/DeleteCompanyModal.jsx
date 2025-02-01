"use client";

const DeleteCompanyModal = ({ company, onDelete, onCancel }) => {
  if (!company) return null; // Don't render if no company is selected

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-red-500">
          Firma löschen: {company.company_name || "Unbenannt"}
        </h3>
        <p className="py-4">
          Sind Sie sicher, dass Sie diese Firma löschen möchten? Diese Aktion
          kann nicht rückgängig gemacht werden.
        </p>
        <div className="modal-action">
          <button onClick={onDelete} className="btn btn-error">
            Löschen
          </button>
          <button onClick={onCancel} className="btn btn-neutral">
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCompanyModal;
