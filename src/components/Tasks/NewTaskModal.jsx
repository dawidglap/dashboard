"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [status, setStatus] = useState("pending");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState(null);
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

  const handleUserSelect = (user) => {
    setAssignedTo((prev) => {
      if (!prev) return [user]; // If empty, add first user

      const exists = prev.find((u) => u._id === user._id);
      return exists ? prev.filter((u) => u._id !== user._id) : [...prev, user];
    });
  };

  const handleSelectAll = () => {
    setAssignedTo(selectAll ? [] : users.map((user) => user._id));
    setSelectAll(!selectAll);
  };

  const today = new Date().toISOString().split("T")[0];

  const handleCreateTask = async () => {
    console.log("📤 Sending Task Data:", {
      title,
      description,
      priority,
      status,
      assignedTo: assignedTo
        ? { _id: assignedTo._id, name: assignedTo.name, role: assignedTo.role }
        : null,
      dueDate,
    });

    if (!assignedTo || !assignedTo._id) {
      setError("Ein Benutzer muss zugewiesen werden.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // ✅ Build the task data dynamically
      const taskData = {
        assignedTo: assignedTo
          ? {
              _id: assignedTo._id,
              name: assignedTo.name,
              role: assignedTo.role,
            }
          : null, // ✅ Ensures assignedTo is always an object
      };

      // ✅ Only add optional fields if they have values
      if (title?.trim()) taskData.title = title.trim();
      if (description?.trim()) taskData.description = description.trim();
      if (priority) taskData.priority = priority;
      if (status) taskData.status = status;
      if (dueDate) taskData.dueDate = dueDate;

      console.log("📤 Sending Task Data:", taskData); // ✅ Debugging

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
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
      <div className="modal modal-open flex items-center justify-center ">
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
                      onClick={() => handleUserSelect(user)} // ✅ Pass the entire user object
                      className={`badge badge-md px-3 py-1 cursor-pointer rounded-full ${
                        assignedTo?._id === user._id
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
