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

import { motion } from "framer-motion";

// Status Icons with Colors
const STATUS_ICONS = {
  pending: {
    // icon: <FaCheckCircle />,
    color: "text-gray-500",
    label: "Ausstehend",
  },
  in_progress: {
    // icon: <FaPlayCircle />,
    color: "text-blue-500",
    label: "In Bearbeitung",
  },
  done: {
    // icon: <FaCheckCircle />,
    color: "text-green-500",
    label: "Erledigt",
  },
  cannot_complete: {
    // icon: <FaTimesCircle />,
    color: "text-red-500",
    label: "Nicht abgeschlossen",
  },
};

// Priority Icons with Colors
const PRIORITY_ICONS = {
  high: { icon: <FaFlag />, color: "text-red-500", label: "Hoch" },
  medium: { icon: <FaFlag />, color: "text-yellow-500", label: "Mittel" },
  low: { icon: <FaFlag />, color: "text-green-500", label: "Niedrig" },
};

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal modal-open flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-box max-w-5xl px-12 w-full bg-base-100 shadow-lg rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-indigo-200 pb-4">
          <h3 className="text-2xl font-bold text-base-content flex items-center gap-2">
            Aufgabendetails
          </h3>
        </div>

        {/* Task Content */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {/* Task Title */}
          <div className="col-span-4 bg-indigo-00 border-b border-indigo-100 py-4">
            <label className="text-sm font-bold">Titel:</label>

            <h3 className="text-lg text-gray-800 flex items-center gap-2">
              {task.title || "Unbekannt"}
            </h3>
          </div>
          {/* Task Description */}
          <div className="col-span-4 py-4">
            <label className="text-sm font-bold">Beschreibung:</label>
            <p className="text-gray-800 text-lg rounded-2xl">
              {task.description || "Keine Beschreibung verfügbar"}
            </p>
          </div>

          {/* Assigned To */}
          {/* <div className="col-span-2 p-3 border-l-2 border-b-2 border-indigo-400 bg-indigo- rounded-xl">
            <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
              Zugewiesen an:
            </span>
            <p className="text-gray-900 font-semibold text-lg">
              {task.assignedTo?.name || "Nicht zugewiesen"}
              <span className="block text-sm text-gray-500 uppercase">
                {task.assignedTo?.role || "Unbekannt"}
              </span>
            </p>
          </div> */}

          {/* <div className="col-span-1 p-3 border-l-2 border-b-2  rounded-2xl">
            <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
              Priorität:
            </span>
            <p
              className={`text-lg font-semibold ${
                PRIORITY_ICONS[task.priority]?.color
              }`}
            >
              {PRIORITY_ICONS[task.priority]?.label || "Unbekannt"}
            </p>
          </div> */}

          {/* Status & Priority */}
          {/* <div className="col-span-1 p-3 border-l-2 border-b-2  rounded-2xl">
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
          </div> */}
          {/* Created At */}
          {/* <div className="col-span-1 p-3 border-l-2 border-b-2 border-lime-200 mt-3 rounded-2xl shadow-sm">
            <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
              Erstellt am:
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
          </div> */}
          {/* Due Date */}
          {/* <div className="col-span-1 p-3 border-l-2 border-b-2 mt-3 border-red-200  rounded-2xl">
            <span className="text-sm font-medium flex items-center gap-2 text-gray-700">
              Fällig am:
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
          </div> */}
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="btn btn-sm btn-neutral hover:text-white px-4 rounded-full"
          >
            Schliessen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;
