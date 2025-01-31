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
  const [toastMessage, setToastMessage] = useState(null); // ✅ Add toast state

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
          assignedTo,
          dueDate, // ✅ Send updated due date
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      onUpdate(task._id, { ...responseData.updatedFields, _id: task._id });

      setToastMessage("Aufgabe erfolgreich aktualisiert! ✅"); // ✅ Show success toast

      setTimeout(() => {
        setToastMessage(null); // ✅ Hide toast after 2 seconds
        onClose(); // ✅ Close modal after toast disappears
      }, 2000);
    } catch (error) {
      console.error("Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

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
        {/* Assigned To (Dropdown) */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Zugewiesen an</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">-- Benutzer auswählen --</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
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
        {/* Due Date - Prevents past dates */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Fällig am</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} // ✅ Blocks past dates
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
            onClick={handleUpdateTask}
            className="btn btn-primary"
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
