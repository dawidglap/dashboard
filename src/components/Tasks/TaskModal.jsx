"use client";

import {
  FaTimes,
  FaUser,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaPlayCircle,
  FaFlag,
  FaClipboardList,
} from "react-icons/fa";

// Status Icons with Colors
const STATUS_ICONS = {
  pending: {
    icon: <FaCheckCircle />,
    color: "text-gray-500",
    label: "⏳ Ausstehend",
  },
  in_progress: {
    icon: <FaPlayCircle />,
    color: "text-blue-500",
    label: "🚀 In Bearbeitung",
  },
  done: {
    icon: <FaCheckCircle />,
    color: "text-green-500",
    label: "✅ Erledigt",
  },
  cannot_complete: {
    icon: <FaTimesCircle />,
    color: "text-red-500",
    label: "❌ Nicht abgeschlossen",
  },
};

// Priority Icons with Colors
const PRIORITY_ICONS = {
  high: { icon: <FaFlag />, color: "text-red-500", label: "🔥 Hoch" },
  medium: { icon: <FaFlag />, color: "text-yellow-500", label: "⚡ Mittel" },
  low: { icon: <FaFlag />, color: "text-green-500", label: "🍃 Niedrig" },
};

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📌 Task Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Task Content */}
        <div className="mt-6 space-y-4">
          {/* Title - Most Important */}
          <div className="bg-indigo-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaClipboardList className="text-indigo-600" />{" "}
              {task.title || "Unbekannt"}
            </h3>
          </div>

          {/* Description - Second Most Important */}
          <div>
            <span className="text-sm font-medium flex items-center gap-2 text-gray-600">
              📝 Beschreibung:
            </span>
            <p className="text-gray-800 mt-1 text-sm bg-gray-100 p-3 rounded-md">
              {task.description || "Keine Beschreibung verfügbar"}
            </p>
          </div>

          {/* Assigned To & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border-l-4 border-indigo-400 bg-indigo-50 rounded-md">
              <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <FaUser className="text-indigo-500" /> Zugewiesen an:
              </span>
              <p className="text-gray-900 font-semibold">
                {task.assignedTo?.name || "Nicht zugewiesen"}
                <span className="block text-sm text-gray-500">
                  {task.assignedTo?.role || "Unbekannt"}
                </span>
              </p>
            </div>

            <div className="p-3 border-l-4 border-red-400 bg-red-50 rounded-md">
              <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
                <FaCalendar className="text-red-500" /> Fällig am:
              </span>
              <p className="text-gray-900 font-semibold">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "Kein Datum"}
              </p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border-l-4 bg-gray-50 rounded-md">
              <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
                {STATUS_ICONS[task.status]?.icon} Status:
              </span>
              <p
                className={`text-lg font-semibold ${
                  STATUS_ICONS[task.status]?.color
                }`}
              >
                {STATUS_ICONS[task.status]?.label || "Unbekannt"}
              </p>
            </div>

            <div className="p-3 border-l-4 bg-gray-50 rounded-md">
              <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
                {PRIORITY_ICONS[task.priority]?.icon} Priorität:
              </span>
              <p
                className={`text-lg font-semibold ${
                  PRIORITY_ICONS[task.priority]?.color
                }`}
              >
                {PRIORITY_ICONS[task.priority]?.label || "Unbekannt"}
              </p>
            </div>
          </div>

          {/* Created At */}
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <FaCalendar className="text-gray-500" /> Erstellt am:
            </span>
            <p className="text-gray-900">
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Unbekannt"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition"
          >
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
