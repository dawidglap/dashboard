"use client";

import { useState } from "react";
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal";
import {
  FaEllipsisH,
  FaEye,
  FaCheck,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

// Status Labels & Colors
const STATUS_LABELS = {
  pending: "Ausstehend",
  in_progress: "In Bearbeitung",
  done: "Erledigt",
  cannot_complete: "Nicht abgeschlossen",
};

const STATUS_COLORS = {
  pending: "bg-gray-400",
  in_progress: "bg-blue-500",
  done: "bg-green-500",
  cannot_complete: "bg-red-500",
};

// Priority Labels & Colors
const PRIORITY_LABELS = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const TaskRow = ({
  task,
  user,
  onUpdate,
  onDelete,
  openDropdownId,
  setOpenDropdownId,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if this dropdown is open
  const isDropdownOpen = openDropdownId === task._id;

  // Toggle dropdown & close others
  const toggleDropdown = () => {
    setOpenDropdownId(isDropdownOpen ? null : task._id);
  };

  // Handle updating task status
  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }), // ✅ Send only the status update
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      const updatedTask = await res.json();

      // ✅ Instant UI Update
      onUpdate(task._id, { ...task, status: newStatus });
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
      setOpenDropdownId(null);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Fehler beim Löschen der Aufgabe");
      }

      onDelete(task._id); // ✅ Remove the task from UI immediately
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
      setOpenDropdownId(null);
    }
  };

  // Determine if user can update the status
  const canUpdateStatus =
    user?.role === "admin" ||
    (user?.role === "manager" &&
      task.assignedTo?.toString() === user._id?.toString()) ||
    (user?.role === "markenbotschafter" &&
      task.assignedTo?.toString() === user._id?.toString());

  // Determine if user can delete the task (only Admins)
  const canDelete = user?.role === "admin";

  return (
    <>
      <tr className="border-b hover:bg-gray-100 transition">
        <td className="py-4 px-6">{task.title}</td>

        {/* Status Column (with colored dot) */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${STATUS_COLORS[task.status]}`}
            ></span>
            <span>{STATUS_LABELS[task.status] || "Unbekannt"}</span>
          </div>
        </td>

        {/* Priority Column (with colored dot) */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                PRIORITY_COLORS[task.priority]
              }`}
            ></span>
            <span>{PRIORITY_LABELS[task.priority] || "Unbekannt"}</span>
          </div>
        </td>

        {/* Actions Column */}
        <td className="relative py-4 px-6 text-left">
          <button
            onClick={toggleDropdown}
            className="p-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            <FaEllipsisH />
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                >
                  <FaEye className="mr-2" /> Details
                </button>
              </li>

              {canUpdateStatus && (
                <>
                  <li>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                    >
                      <FaEdit className="mr-2" /> Bearbeiten
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("in_progress")}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        "In Bearbeitung"
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("done")}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaCheck className="mr-2" />
                      )}
                      Erledigt
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("cannot_complete")}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTimesCircle className="mr-2" />
                      )}
                      Nicht abgeschlossen
                    </button>
                  </li>
                </>
              )}

              {canDelete && (
                <li>
                  <button
                    onClick={handleDeleteTask}
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                  >
                    {isDeleting ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaTrash className="mr-2" />
                    )}
                    Löschen
                  </button>
                </li>
              )}
            </ul>
          )}
        </td>
      </tr>

      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TaskRow;
