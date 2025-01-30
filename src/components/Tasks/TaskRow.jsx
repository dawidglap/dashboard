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

  // ✅ Close dropdown & open edit modal when clicking "Bearbeiten"
  const handleEditClick = () => {
    setOpenDropdownId(null); // Close dropdown
    setIsEditModalOpen(true); // Open edit modal
  };

  // Handle updating task status
  const handleUpdateStatus = async (newStatus) => {
    if (!task._id) {
      console.error("❌ ERROR: Task ID is missing!", task);
      return;
    }

    setIsUpdating(true);

    try {
      console.log(
        `🔍 Sending request to update status: ${newStatus} for Task ID: ${task._id}`
      );

      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );
      }

      console.log("✅ Server Response:", responseData);

      if (responseData.message === "Task status is already the same") {
        console.warn("⚠️ Task status was already up to date.");
      } else {
        onUpdate(task._id, { ...task, status: newStatus });
      }
    } catch (error) {
      console.error("❌ ERROR updating task:", error);
    } finally {
      setIsUpdating(false);
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
      <tr className="border-b hover:bg-gray-100 transition text-sm">
        <td className="py-2 px-4">{task.title}</td>

        {/* Status Column (with colored badge) */}
        <td className="py-2 px-4">
          <span
            className={`px-2 py-1 text-white rounded ${
              STATUS_COLORS[task.status]
            }`}
          >
            {STATUS_LABELS[task.status] || "Unbekannt"}
          </span>
        </td>

        {/* Priority Column (with colored badge) */}
        <td className="py-2 px-4">
          <span
            className={`px-2 py-1 text-white rounded ${
              PRIORITY_COLORS[task.priority]
            }`}
          >
            {PRIORITY_LABELS[task.priority] || "Unbekannt"}
          </span>
        </td>

        {/* Actions Column */}
        <td className="relative py-2 px-4 text-left">
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
                      onClick={handleEditClick}
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
                    onClick={() => onDelete(task._id)}
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-gray-100 w-full"
                  >
                    <FaTrash className="mr-2" /> Löschen
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
