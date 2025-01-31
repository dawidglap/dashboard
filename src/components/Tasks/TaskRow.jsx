"use client";

import { useState } from "react";
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal";
import {
  FaEllipsisH,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaTrash,
  FaHourglassHalf,
  FaPlayCircle,
  FaFlag,
} from "react-icons/fa";

// Status Icons with Colors
const STATUS_ICONS = {
  pending: { icon: <FaHourglassHalf />, color: "text-gray-500" },
  in_progress: { icon: <FaPlayCircle />, color: "text-blue-500" },
  done: { icon: <FaCheckCircle />, color: "text-green-500" },
  cannot_complete: { icon: <FaTimesCircle />, color: "text-red-500" },
};

// Priority Icons with Colors (Now properly colored)
const PRIORITY_ICONS = {
  high: { icon: <FaFlag />, color: "text-red-500" },
  medium: { icon: <FaFlag />, color: "text-yellow-500" },
  low: { icon: <FaFlag />, color: "text-green-500" },
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if this dropdown is open
  const isDropdownOpen = openDropdownId === task._id;

  // Toggle dropdown & close others
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent row click when opening dropdown
    setOpenDropdownId(isDropdownOpen ? null : task._id);
  };

  // Open task details when clicking the row (except on action buttons)
  const handleRowClick = () => {
    setIsModalOpen(true);
  };

  // Handle updating task status
  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(
          responseData.message || "Fehler beim Aktualisieren der Aufgabe"
        );

      onUpdate(task._id, { ...task, status: newStatus });
    } catch (error) {
      console.error("❌ Fehler beim Aktualisieren der Aufgabe:", error);
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
      {/* Task Row */}
      <tr
        className="border-b hover:bg-indigo-50 transition text-sm cursor-pointer group"
        onClick={handleRowClick}
      >
        {/* Priority Flag Column (Visible only on hover) */}
        <td className="py-0 px-2 text-center w-6">
          <div className="relative">
            <span
              className={`opacity-0 group-hover:opacity-100 transition ${
                PRIORITY_ICONS[task.priority]?.color
              }`}
            >
              {PRIORITY_ICONS[task.priority]?.icon || ""}
            </span>
          </div>
        </td>

        {/* Task Title */}
        <td className="py-0 px-4">{task.title}</td>

        {/* Status Column */}
        {/* <td className="pt-2 px-4 flex items-center space-x-2">
          <span className={STATUS_ICONS[task.status]?.color}>
            {STATUS_ICONS[task.status]?.icon || <FaHourglassHalf />}
          </span>
        </td> */}
        {/* Status Column - Matches Filter UI */}
        <td className="py-2 px-4 flex items-center gap-2">
          {task.status === "pending" && (
            <span className="text-gray-500 flex items-center gap-1">
              ⏳ Ausstehend
            </span>
          )}
          {task.status === "in_progress" && (
            <span className="text-blue-500 flex items-center gap-1">
              🚀 In Bearbeitung
            </span>
          )}
          {task.status === "done" && (
            <span className="text-green-500 flex items-center gap-1">
              ✅ Erledigt
            </span>
          )}
          {task.status === "cannot_complete" && (
            <span className="text-red-500 flex items-center gap-1">
              ❌ Nicht abgeschlossen
            </span>
          )}
        </td>

        {/* Assigned To Name */}
        <td className="py-0 px-4 w-40 font-semibold">
          {task.assignedTo?.name ? task.assignedTo.name : "Nicht zugewiesen"}
        </td>

        {/* Assigned To Role */}
        <td className="py-0 px-4 w-32 text-[10px] uppercase font-thin">
          {task.assignedTo?.role ? task.assignedTo.role : "Unbekannt"}
        </td>

        {/* Due Date */}
        <td className="py-0 px-4 font-semibold">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "Kein Datum"}
        </td>

        {/* Created At */}
        <td className="py-0 px-4">
          {task.createdAt
            ? new Date(task.createdAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "Unbekannt"}
        </td>

        {/* Actions Column */}
        <td
          className="relative py-0 px-4 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleDropdown}
            className="p-2 rounded hover:bg-indigo-300"
          >
            <FaEllipsisH />
          </button>

          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              {/* <li>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center px-4 py-2 hover:bg-indigo-50 w-full"
                >
                  <FaEye className="mr-2" /> Details
                </button>
              </li> */}

              {canUpdateStatus && (
                <>
                  <li>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setOpenDropdownId(null); // ✅ Close dropdown after clicking
                      }}
                      className="flex items-center px-4 py-2 hover:bg-indigo-50 w-full"
                    >
                      <FaEdit className="mr-2" /> Bearbeiten
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("in_progress")}
                      className="flex items-center px-4 py-2 hover:bg-indigo-50 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaPlayCircle className="mr-2 text-blue-500" />
                      )}
                      In Bearbeitung
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("done")}
                      className="flex items-center px-4 py-2 hover:bg-indigo-50 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaCheckCircle className="mr-2 text-green-500" />
                      )}
                      Erledigt
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleUpdateStatus("cannot_complete")}
                      className="flex items-center px-4 py-2 hover:bg-indigo-50 w-full"
                    >
                      {isUpdating ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTimesCircle className="mr-2 text-red-500" />
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
                    className="flex items-center px-4 py-2 text-red-500 hover:bg-indigo-50 w-full"
                  >
                    <FaTrash className="mr-2" /> Löschen
                  </button>
                </li>
              )}
            </ul>
          )}
        </td>
      </tr>

      {/* ✅ Ensure Modals are rendered */}
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
