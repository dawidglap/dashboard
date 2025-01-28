"use client";

import { useState } from "react";

const NewTaskModal = ({ isOpen, onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      ...formData,
      status: "pending", // New tasks start as pending
      createdBy: "ADMIN_USER_ID", // Replace with actual admin ID
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("Fehler beim Erstellen der Aufgabe.");

      const data = await res.json();
      onTaskCreated(data.data); // Update the task list
      onClose(); // Close the modal
    } catch (error) {
      console.error("Fehler:", error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Neue Aufgabe erstellen</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="form-control">
            <label className="label">Titel</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered"
              required
            ></textarea>
          </div>

          <div className="form-control">
            <label className="label">Priorität</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="low">Niedrig</option>
              <option value="medium">Mittel</option>
              <option value="high">Hoch</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">Zugewiesen an (User ID)</label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-primary">
              Speichern
            </button>
            <button type="button" onClick={onClose} className="btn btn-error">
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTaskModal;
