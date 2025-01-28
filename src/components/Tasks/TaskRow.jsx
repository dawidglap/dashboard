"use client";

import { useState } from "react";
import TaskModal from "./TaskModal";
import { FaEye } from "react-icons/fa";

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

const TaskRow = ({ task }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="border-b hover:bg-gray-100 transition">
        <td className="py-4 px-6">{task.title}</td>

        {/* Status Column */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            {/* Small Dot */}
            <span
              className={`w-3 h-3 rounded-full ${STATUS_COLORS[task.status]}`}
            ></span>
            {/* Status Label with fixed width */}
            <span className="w-32 text-center text-sm font-medium py-1 rounded-lg bg-gray-200">
              {STATUS_LABELS[task.status] || "Unbekannt"}
            </span>
          </div>
        </td>

        {/* Priority Column */}
        <td className="py-4 px-6">
          <div className="flex items-center space-x-2">
            {/* Small Dot */}
            <span
              className={`w-3 h-3 rounded-full ${
                PRIORITY_COLORS[task.priority]
              }`}
            ></span>
            {/* Priority Label with fixed width */}
            <span className="w-24 text-center text-sm font-medium py-1 rounded-lg bg-gray-200">
              {PRIORITY_LABELS[task.priority] || "Unbekannt"}
            </span>
          </div>
        </td>

        {/* Details Button */}
        <td className="py-4 px-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-primary"
          >
            <FaEye className="mr-2" />
            Details
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <TaskModal task={task} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default TaskRow;
