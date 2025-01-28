"use client";

import { useState } from "react";
import TaskModal from "./TaskModal";
import { FaEye, FaCheck, FaTimesCircle, FaSpinner } from "react-icons/fa";

// Define German labels for task status and priority
const STATUS_LABELS = {
  pending: "Ausstehend",
  in_progress: "In Bearbeitung",
  done: "Erledigt",
  cannot_complete: "Nicht abgeschlossen",
};

const PRIORITY_LABELS = {
  high: "Hoch",
  medium: "Mittel",
  low: "Niedrig",
};

// Define colors for the small dot indicator
const STATUS_COLORS = {
  pending: "bg-gray-400",
  in_progress: "bg-blue-500",
  done: "bg-green-500",
  cannot_complete: "bg-red-500",
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

const TaskRow = ({ task, user, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren des Status");

      // Call the `onUpdate` function passed down from the parent
      onUpdate(task._id, newStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  console.log("Task Assigned To:", task.assignedTo?.toString());
  console.log("Current User ID:", user._id?.toString());

  // Fix logic for determining if the user can update the task
  const canUpdateStatus =
    user?.role === "admin" || // Admin can update all tasks
    (user?.role === "manager" &&
      task.assignedTo?.toString() === user._id?.toString()) || // Manager can update tasks assigned to them
    (user?.role === "markenbotschafter" &&
      task.assignedTo?.toString() === user._id?.toString()); // Markenbotschafter can update their own tasks

  return (
    <>
      <tr className="border-b hover:bg-gray-100 transition">
        <td className="py-4 px-6">{task.title}</td>

        {/* Status Column */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${STATUS_COLORS[task.status]}`}
            ></span>
            <span className="w-32 text-center text-sm font-medium py-1 rounded-lg bg-gray-200">
              {STATUS_LABELS[task.status] || "Unbekannt"}
            </span>
          </div>
        </td>

        {/* Priority Column */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full ${
                PRIORITY_COLORS[task.priority]
              }`}
            ></span>
            <span className="w-24 text-center text-sm font-medium py-1 rounded-lg bg-gray-200">
              {PRIORITY_LABELS[task.priority] || "Unbekannt"}
            </span>
          </div>
        </td>

        {/* Actions Column */}
        <td className="py-4 px-6 flex space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-primary"
          >
            <FaEye className="mr-2" />
            Details
          </button>

          {canUpdateStatus && (
            <>
              <button
                onClick={() => handleUpdateStatus("in_progress")}
                disabled={isUpdating}
                className="btn btn-sm btn-info"
              >
                {isUpdating ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "In Arbeit"
                )}
              </button>
              <button
                onClick={() => handleUpdateStatus("done")}
                disabled={isUpdating}
                className="btn btn-sm btn-success"
              >
                <FaCheck className="mr-1" />
                Erledigt
              </button>
              <button
                onClick={() => handleUpdateStatus("cannot_complete")}
                disabled={isUpdating}
                className="btn btn-sm btn-error"
              >
                <FaTimesCircle className="mr-1" />
                Nicht möglich
              </button>
            </>
          )}
        </td>
      </tr>

      {/* Task Details Modal */}
      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default TaskRow;
