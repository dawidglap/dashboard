"use client";

import { useState, useEffect, useRef } from "react";
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
  isSelected, // ✅ Receive the selection state
  onSelectTask, // ✅ Receive the function to handle selection
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const dropdownRef = useRef(null); // ✅ Create a ref for the dropdown

  const assignedUsers = Array.isArray(task.assignedTo)
    ? task.assignedTo
    : task.assignedTo
    ? [task.assignedTo] // Wrap in array if it's a single object
    : []; // Ensure it's always an array

  // ✅ Ensure actions only appear for the first assigned user
  const isFirstOccurrence = assignedUsers.length > 0 && assignedUsers[0]._id;

  // Check if this dropdown is open
  const isDropdownOpen = openDropdownId === task._id;

  // Toggle dropdown & close others
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent row click when opening dropdown
    setOpenDropdownId(isDropdownOpen ? null : task._id);
  };

  const handleCheckboxChange = (e) => {
    const taskUserId = `${task._id}-${task.assignedTo._id}`; // Unique identifier
    onSelectTask(taskUserId, e.target.checked);
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
      if (!res.ok) throw new Error(responseData.message || "Update failed");

      console.log("✅ Updated Task Response:", responseData.task);

      // ✅ Fetch full task data to update UI properly
      const updatedRes = await fetch(`/api/tasks/${task._id}`);
      const updatedTaskData = await updatedRes.json();

      if (!updatedRes.ok)
        throw new Error(
          updatedTaskData.message || "Failed to fetch updated task"
        );

      // ✅ Instead of `setTasks`, call `onUpdate` to inform the parent
      onUpdate(task._id, {
        ...task,
        ...updatedTaskData.task,
        assignedTo: updatedTaskData.task.assignedTo
          ? updatedTaskData.task.assignedTo
          : task.assignedTo, // Preserve previous assignedTo if missing
      });
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null); // ✅ Close dropdown when clicking outside
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Determine if user can delete the task (only Admins)
  const canDelete = user?.role === "admin";
  console.log("Task ID:", task._id, "Assigned Users:", task.assignedTo);

  console.log(`🔄 Task ${task._id} checked state:`, isSelected);

  return (
    <>
      {/* Task Row */}
      <tr
        className="border-b hover:bg-indigo-100 transition text-sm cursor-pointer group"
        onClick={(e) => {
          if (e.target.type !== "checkbox") {
            handleRowClick();
          }
        }}
      >
        {/* ✅ Checkbox Column */}
        <td className="py-2 px-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectTask(task._id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            className="ms-1 checkbox checkbox-sm rounded-full"
          />
        </td>

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
        <td className="py-2 px-4 font-semibold">{task.title}</td>

        {/* Status Column */}
        <td className="py-2 px-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              task.status === "pending"
                ? " text-gray-500"
                : task.status === "in_progress"
                ? " text-blue-500"
                : task.status === "done"
                ? " text-green-500"
                : task.status === "cannot_complete"
                ? " text-red-500"
                : " text-gray-500"
            }`}
          >
            {task.status === "pending"
              ? "Ausstehend"
              : task.status === "in_progress"
              ? "In Bearbeitung"
              : task.status === "done"
              ? "Erledigt"
              : "Nicht abgeschlossen"}
          </span>
        </td>

        {/* Assigned To Name */}
        <td className="py-2 px-4 w-40 font-semibold">
          {task.assignedTo && typeof task.assignedTo === "object"
            ? task.assignedTo.name
            : "Aktualisieren..."}
        </td>

        {/* Assigned To Role */}
        <td className="py-2 px-4 w-32 text-[10px] uppercase font-thin">
          {task.assignedTo && typeof task.assignedTo === "object"
            ? task.assignedTo.role
            : "Aktualisieren..."}
        </td>

        {/* Due Date */}
        <td className="py-2 px-4 font-semibold">
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "Kein Datum"}
        </td>

        {/* Created At */}
        <td className="py-2 px-4">
          {task.createdAt
            ? new Date(task.createdAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "Unbekannt"}
        </td>

        {/* Actions Column - Only for the first assigned user of a task */}
        {assignedUsers.length > 0 && assignedUsers[0]?._id && (
          <td
            className="relative py-0 px-4 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-indigo-200 transition"
            >
              <FaEllipsisH />
            </button>

            {isDropdownOpen && (
              <ul
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-lg z-50"
              >
                {canUpdateStatus && (
                  <>
                    <li>
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setOpenDropdownId(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-indigo-100 w-full rounded-md"
                      >
                        <FaEdit className="mr-2" /> Bearbeiten
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleUpdateStatus("in_progress")}
                        className="flex items-center px-4 py-2 hover:bg-indigo-100 w-full rounded-md"
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
                        className="flex items-center px-4 py-2 hover:bg-indigo-100 w-full rounded-md"
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
                        className="flex items-center px-4 py-2 hover:bg-indigo-100 w-full rounded-md"
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
                      className="flex items-center px-4 py-2 text-red-500 hover:bg-indigo-100 w-full rounded-md"
                    >
                      <FaTrash className="mr-2" /> Löschen
                    </button>
                  </li>
                )}
              </ul>
            )}
          </td>
        )}
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
