"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      <div className="modal modal-open flex items-center justify-center backdrop-blur-sm ">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="modal-box max-w-5xl w-full bg-base-100 shadow-lg rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-2xl font-bold text-base-content">
              Neue Aufgabe erstellen
            </h3>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-4 gap-3 mt-6">
            {/* Task Title */}
            <div className="col-span-2">
              <label className="text-sm font-medium">Titel</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-sm input-bordered w-full rounded-full"
                placeholder="Aufgabenname eingeben..."
              />
            </div>

            {/* Priority & Status */}
            <div className="col-span-1">
              <label className="text-sm font-medium">Priorität</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="select select-sm select-bordered w-full rounded-full"
              >
                <option value="high">Hoch</option>
                <option value="medium">Mittel</option>
                <option value="low">Niedrig</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="select select-sm select-bordered w-full rounded-full"
              >
                <option value="pending">Ausstehend</option>
                <option value="in_progress">In Bearbeitung</option>
                <option value="done">Erledigt</option>
                <option value="cannot_complete">Nicht abgeschlossen</option>
              </select>
            </div>
            {/* Task Description */}
            <div className="col-span-3">
              <label className="text-sm font-medium">Beschreibung</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-sm textarea-bordered w-full h-20 rounded-2xl px-3"
                placeholder="Beschreibung eingeben..."
              ></textarea>
            </div>

            {/* Due Date */}
            <div className="col-span-1">
              <label className="text-sm font-medium">Fällig am</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={today}
                className="input input-sm input-bordered w-full rounded-full"
              />
            </div>

            {/* Assigned Users */}
            <div className="col-span-4">
              <label className="text-sm font-medium">Zugewiesen an</label>
              <div className="border rounded-2xl p-3 bg-white">
                <button
                  onClick={handleSelectAll}
                  className="btn btn-sm w-full bg-indigo-100 hover:bg-indigo-200 rounded-full mb-2"
                >
                  {selectAll ? "Alle abwählen" : "Alle auswählen"}
                </button>
                <div className="flex flex-wrap gap-1">
                  {users.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserSelect(user._id)}
                      className={`badge badge-md px-3 py-1 cursor-pointer rounded-full ${
                        assignedTo.includes(user._id)
                          ? "bg-indigo-200"
                          : "bg-indigo-50"
                      }`}
                    >
                      {user.name} ({user.role})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          {/* Modal Actions */}
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="btn btn-sm btn-outline rounded-full"
            >
              Abbrechen
            </button>
            <button
              onClick={handleCreateTask}
              className="btn btn-sm btn-neutral hover:text-white rounded-full flex items-center"
              disabled={isSaving}
            >
              {isSaving ? "Speichern..." : "Speichern"}
            </button>
          </div>
        </motion.div>
      </div>
    )
  );
};

export default NewTaskModal;
