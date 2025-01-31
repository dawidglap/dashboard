"use client";

import { useState, useEffect } from "react";

const EditTaskModal = ({ task, onClose, onUpdate }) => {
  // Initialize state with existing task data
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [status, setStatus] = useState(task.status || "pending");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id || "");
  const [dueDate, setDueDate] = useState(task.dueDate?.split("T")[0] || "");
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null); // ✅ Toast message

  // ✅ Fetch users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Prevent past dates in the date picker
  const today = new Date().toISOString().split("T")[0];

  // ✅ Handle task update
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
          assignedTo,
          dueDate,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      // ✅ Fetch latest data
      const updatedRes = await fetch(`/api/tasks/${task._id}`);
      const updatedTaskData = await updatedRes.json();

      if (!updatedRes.ok) {
        throw new Error(
          updatedTaskData.message || "Failed to fetch updated task"
        );
      }

      onUpdate(task._id, updatedTaskData.task);

      setToastMessage("✅ Aufgabe erfolgreich aktualisiert!");
      setTimeout(() => {
        setToastMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box space-y-4 bg-indigo-100">
        <h3 className="text-lg font-semibold text-gray-700">
          ✏️ Aufgabe bearbeiten
        </h3>

        {/* Task Title */}
        <div>
          <label className="text-sm font-medium">📌 Titel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Task Description */}
        <div>
          <label className="text-sm font-medium">📝 Beschreibung</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-sm textarea-bordered w-full"
          ></textarea>
        </div>

        {/* Task Priority */}
        <div>
          <label className="text-sm font-medium">🚀 Priorität</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="select select-sm select-bordered w-full"
          >
            <option value="high">🔥 Hoch</option>
            <option value="medium">⚡ Mittel</option>
            <option value="low">🍃 Niedrig</option>
          </select>
        </div>

        {/* Task Status */}
        <div>
          <label className="text-sm font-medium">✅ Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-sm select-bordered w-full"
          >
            <option value="pending">⏳ Ausstehend</option>
            <option value="in_progress">🚀 In Bearbeitung</option>
            <option value="done">✅ Erledigt</option>
            <option value="cannot_complete">❌ Nicht abgeschlossen</option>
          </select>
        </div>

        {/* Assigned To (Dropdown) */}
        <div>
          <label className="text-sm font-medium">👤 Zugewiesen an</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="select select-sm select-bordered w-full"
          >
            <option value="">-- Benutzer auswählen --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium">📅 Fällig am</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={today}
            className="input input-sm input-bordered w-full"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Modal Actions */}
        <div className="modal-action flex justify-between">
          <button
            onClick={onClose}
            className="btn btn-sm bg-red-400 hover:bg-red-500"
          >
            Abbrechen
          </button>
          <button
            onClick={handleUpdateTask}
            className="btn btn-sm bg-green-500 hover:bg-green-600"
            disabled={isSaving}
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
        </div>
      </div>

      {/* ✅ Toast Notification (Auto disappears) */}
      {toastMessage && (
        <div className="toast">
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTaskModal;
