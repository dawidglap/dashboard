"use client";

import { useState } from "react";

const EditTaskModal = ({ task, onClose, onUpdate }) => {
  // Initialize state with existing task data
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [status, setStatus] = useState(task.status || "pending");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Function to update the task
  const handleUpdateTask = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          status,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      // ✅ Ensure `_id` is always included when updating the UI state
      onUpdate(task._id, { ...responseData.updatedFields, _id: task._id });

      onClose();
    } catch (error) {
      console.error("Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Aufgabe bearbeiten</h3>

        {/* Task Title */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Task Description */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Beschreibung</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>

        {/* Task Priority */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Priorität</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="high">Hoch</option>
            <option value="medium">Mittel</option>
            <option value="low">Niedrig</option>
          </select>
        </div>

        {/* Task Status */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="pending">Ausstehend</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="done">Erledigt</option>
            <option value="cannot_complete">Nicht abgeschlossen</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}

        {/* Modal Actions */}
        <div className="modal-action">
          <button onClick={onClose} className="btn">
            Abbrechen
          </button>
          <button
            onClick={handleUpdateTask}
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
