"use client";

import { useState, useEffect } from "react";

const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [status, setStatus] = useState("pending");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

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

  const handleUserSelect = (userId) => {
    setAssignedTo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setAssignedTo(selectAll ? [] : users.map((user) => user._id));
    setSelectAll(!selectAll);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleCreateTask = async () => {
    if (assignedTo.length === 0) {
      setError("Mindestens ein Benutzer muss ausgewählt werden.");
      return;
    }

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
      <div className="modal modal-open flex items-center justify-center">
        <div className="modal-box max-w-4xl w-full bg-gray-100 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            ✨ Neue Aufgabe erstellen
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Side - Inputs */}
            <div className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  📌 Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-sm input-bordered w-full rounded-full px-3"
                  placeholder="Aufgabenname eingeben..."
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  📝 Beschreibung
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="textarea textarea-sm textarea-bordered w-full h-24 rounded-lg px-3"
                  placeholder="Beschreibung eingeben..."
                ></textarea>
              </div>

              {/* Task Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  🚀 Priorität
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="select select-sm select-bordered w-full rounded-full px-3"
                >
                  <option value="high">🔥 Hoch</option>
                  <option value="medium">⚡ Mittel</option>
                  <option value="low">🍃 Niedrig</option>
                </select>
              </div>

              {/* Task Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ✅ Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="select select-sm select-bordered w-full rounded-full px-3"
                >
                  <option value="pending">⏳ Ausstehend</option>
                  <option value="in_progress">🚀 In Bearbeitung</option>
                  <option value="done">✅ Erledigt</option>
                  <option value="cannot_complete">
                    ❌ Nicht abgeschlossen
                  </option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  📅 Fällig am
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={today}
                  className="input input-sm input-bordered w-full rounded-full px-3"
                />
              </div>
            </div>

            {/* Right Side - Assigned Users */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  👥 Zugewiesen an
                </label>
                <div className="border rounded-lg p-3 bg-white">
                  <button
                    onClick={handleSelectAll}
                    className="btn btn-sm  w-full rounded-full mb-2"
                  >
                    {selectAll ? "Alle abwählen" : "Alle auswählen"}
                  </button>
                  <div className="flex flex-wrap gap-1">
                    {users.map((user) => (
                      <button
                        key={user._id}
                        onClick={() => handleUserSelect(user._id)}
                        className={`badge badge-md ${
                          assignedTo.includes(user._id)
                            ? "bg-gray-200 "
                            : "bg-gray-50"
                        } px-3 py-1 cursor-pointer`}
                      >
                        {user.name} ({user.role})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          {/* Modal Actions */}
          <div className="modal-action flex justify-between mt-4">
            <button
              onClick={onClose}
              className="btn btn-sm bg-red-500 text-white px-5 rounded-full hover:bg-red-600"
            >
              Abbrechen
            </button>
            <button
              onClick={handleCreateTask}
              className="btn btn-sm bg-green-500 text-white px-5 rounded-full hover:bg-green-600"
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
