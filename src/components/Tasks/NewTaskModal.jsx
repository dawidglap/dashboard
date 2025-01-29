"use client";

import { useState } from "react";

const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [status, setStatus] = useState("pending"); // ✅ Default to "pending"
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState(""); // Make sure this is a valid user ID
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateTask = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          priority,
          status, // ✅ Ensure status is sent in the request
          assignedTo, // Ensure this is a valid ObjectId
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Fehler beim Erstellen der Aufgabe"
        );
      }

      const createdTask = await res.json();
      onTaskCreated(createdTask.task); // ✅ Update UI immediately

      onClose(); // ✅ Close modal after success
    } catch (error) {
      console.error("Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    isOpen && (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Neue Aufgabe erstellen</h3>

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

          {/* Assigned To */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Zugewiesen an</label>
            <input
              type="text"
              placeholder="Benutzer-ID eingeben"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Modal Actions */}
          <div className="modal-action">
            <button onClick={onClose} className="btn">
              Abbrechen
            </button>
            <button
              onClick={handleCreateTask}
              className="btn btn-primary"
              disabled={isSaving}
            >
              {isSaving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default NewTaskModal;
