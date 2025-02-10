"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
          assignedTo, // ✅ Ensure assignedTo is included in the request
          dueDate,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      // ✅ Merge updated fields with the current task
      const updatedTask = {
        ...task,
        title,
        description,
        priority,
        status,
        assignedTo: users.find((user) => user._id === assignedTo), // ✅ Update assigned user
        dueDate,
      };

      console.log("🔄 Updated Task:", updatedTask);

      // ✅ Call `onUpdate` to refresh the UI immediately
      onUpdate(task._id, updatedTask);

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
    <div className="modal modal-open flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-box max-w-4xl w-full bg-base-100 shadow-lg rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-base-content">
            Aufgabe bearbeiten
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
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="select select-sm select-bordered w-full rounded-full"
              >
                <option value="">-- Benutzer auswählen --</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
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
            onClick={handleUpdateTask}
            className="btn btn-sm btn-neutral hover:text-white rounded-full flex items-center"
            disabled={isSaving}
          >
            {isSaving ? "Speichern..." : "Speichern"}
          </button>
        </div>

        {/* ✅ Toast Notification (Auto disappears) */}
        {toastMessage && (
          <div className="toast">
            <div className="alert alert-success">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EditTaskModal;
