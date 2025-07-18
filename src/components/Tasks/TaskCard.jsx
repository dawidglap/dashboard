"use client";

import { FaCheckCircle, FaEdit, FaEllipsisH, FaPlayCircle, FaSpinner, FaTimesCircle, FaTrash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import TaskModal from "./TaskModal";
import EditTaskModal from "./EditTaskModal";

const TaskCard = ({
    task,
    user,
    onUpdate,
    onDelete,
    assignedTo,
    dueDate,
    createdAt,
    isSelected,
    onSelectTask
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isModalOpen || isEditModalOpen) {
            setIsDropdownOpen(false);
        }
    }, [isModalOpen, isEditModalOpen]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const canUpdateStatus =
        user?.role === "admin" ||
        (user?.role === "manager" && task.assignedTo?._id === user._id) ||
        (user?.role === "markenbotschafter" && task.assignedTo?._id === user._id);


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

            // Update parziale
            onUpdate(task._id, { ...task, status: newStatus });

            // Fetch completo
            const updatedRes = await fetch(`/api/tasks/${task._id}`);
            const updatedTaskData = await updatedRes.json();
            if (!updatedRes.ok) throw new Error(updatedTaskData.message || "Failed to fetch updated task");

            onUpdate(task._id, updatedTaskData.task);
            window.dispatchEvent(new Event("taskStatusUpdated"));
        } catch (error) {
            console.error("❌ Fehler beim Aktualisieren der Aufgabe:", error);
        } finally {
            setIsUpdating(false);
            setIsDropdownOpen(false);
        }
    };


    const statusColor = {
        pending: "text-gray-500",
        in_progress: "text-blue-500",
        done: "text-green-500",
        cannot_complete: "text-red-500",
    };

    const statusLabel = {
        pending: "Ausstehend",
        in_progress: "In Bearbeitung",
        done: "Erledigt",
        cannot_complete: "Nicht abgeschlossen",
    };

    return (
        <div className="bg-white shadow border border-gray-200 rounded-xl p-4 space-y-2 text-xs sm:text-sm xl:hidden">
            {/* Titolo + Checkbox + Azioni */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectTask(task._id, e.target.checked)}
                        className="checkbox checkbox-sm rounded-full"
                    />
                    <h3 className="font-bold text-base">{task.title}</h3>
                </div>
                <div className="relative mt-0">
                    <button
                        onClick={toggleDropdown}
                        className="p-1 rounded-full hover:bg-indigo-200 transition text-sm "
                    >
                        <FaEllipsisH />
                    </button>

                    {isDropdownOpen && (
                        <ul
                            ref={dropdownRef}
                            className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-lg z-[9999]"
                        >
                            {user?.role === "admin" && (
                                <li>
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(true);
                                            setIsDropdownOpen(false); // ✅ chiude il menu
                                        }}

                                        className="flex items-center px-4 py-2 hover:bg-indigo-100 w-full rounded-md"
                                    >
                                        <FaEdit className="mr-2" /> Bearbeiten
                                    </button>
                                </li>
                            )}
                            {canUpdateStatus && (
                                <>
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


                            {user?.role === "admin" && (
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
                </div>


            </div>

            <div className="border-b border-indigo-300 my-1" />

            {/* Info principali */}
            <div className="space-y-1">
                <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-semibold ${statusColor[task.status]}`}>
                        {statusLabel[task.status]}
                    </span>
                </p>
                <p>
                    <strong>Zugewiesen an:</strong> {assignedTo?.name || "Nicht zugewiesen"}
                </p>
                <p>
                    <strong>Rolle:</strong> {assignedTo?.role || "Unbekannt"}
                </p>
                <p>
                    <strong>Fällig am:</strong>{" "}
                    {dueDate ? new Date(dueDate).toLocaleDateString("de-DE") : "—"}
                </p>
                <p>
                    <strong>Erstellt am:</strong>{" "}
                    {createdAt ? new Date(createdAt).toLocaleDateString("de-DE") : "—"}
                </p>
            </div>

            {/* Modals */}
            {isModalOpen && <TaskModal task={task} onClose={() => setIsModalOpen(false)} />}
            {isEditModalOpen && (
                <EditTaskModal
                    task={task}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
};

export default TaskCard;
