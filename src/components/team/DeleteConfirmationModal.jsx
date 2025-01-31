"use client";

const DeleteConfirmationModal = ({ user, onDelete, onCancel }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-red-500">
          Benutzer löschen: {user.name || "Unbenannt"}
        </h3>
        <p className="py-4">
          Sind Sie sicher, dass Sie diesen Benutzer löschen möchten? Diese
          Aktion kann nicht rückgängig gemacht werden.
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

export default DeleteConfirmationModal;
