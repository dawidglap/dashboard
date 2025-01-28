"use client";

const TaskModal = ({ task, onClose }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="mt-2">{task.description}</p>

        <div className="mt-4">
          <strong>Status:</strong> {task.status}
        </div>
        <div className="mt-2">
          <strong>Priorität:</strong> {task.priority}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-error">
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
