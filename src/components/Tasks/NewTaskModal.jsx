"use client";

import { useState, useEffect } from "react";

const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [status, setStatus] = useState("pending");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

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

    if (isOpen) fetchUsers();
  }, [isOpen]);

  // ✅ Prevent past dates in the date picker
  const today = new Date().toISOString().split("T")[0];

  // ✅ Handle task creation
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
          status,
          assignedTo,
          dueDate,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Fehler beim Erstellen der Aufgabe"
        );
      }

      const createdTask = await res.json();
      onTaskCreated(createdTask.task);
      onClose();
    } catch (error) {
      console.error("❌ Fehler:", error.message);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    isOpen && (
      <div className="modal modal-open ">
        <div className="modal-box space-y-4 bg-indigo-100">
          <h3 className="text-lg font-semibold text-gray-700">
            Neue Aufgabe erstellen
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

          {/* Assigned To (User Dropdown) */}
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
              min={new Date().toISOString().split("T")[0]}
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
              onClick={handleCreateTask}
              className="btn btn-sm bg-green-500 hover:bg-green-600"
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
