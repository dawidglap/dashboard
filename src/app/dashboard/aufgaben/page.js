"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NewTaskModal from "../../../components/Tasks/NewTaskModal";
import TaskRow from "../../../components/Tasks/TaskRow";

const Tasks = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // ✅ Delete Confirmation Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("info");

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const res = await fetch(`/api/users/me`);
          if (!res.ok)
            throw new Error("Fehler beim Abrufen der Benutzerdaten.");
          const data = await res.json();
          setUser(data.user);
        } catch (err) {
          console.error(err);
          setError("Fehler beim Abrufen der Benutzerdaten.");
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || loading) return;

      setLoading(true);

      try {
        console.log(`⚡ Aufgaben abrufen für Seite: ${page}`);
        const res = await fetch(`/api/tasks?page=${page}&limit=15`);
        if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben.");
        const data = await res.json();

        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setTasks(data.data);
          setHasMore(data.data.length === 15); // ✅ Set hasMore based on limit
        }
      } catch (err) {
        console.error("⚠️ Fehler beim Abrufen der Aufgaben:", err);
        setError("Fehler beim Abrufen der Aufgaben.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, user]);

  // ✅ Function to confirm delete (opens modal)
  const confirmDelete = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  // ✅ Function to delete task
  const handleTaskDelete = async () => {
    if (!taskToDelete) return;

    try {
      const res = await fetch(`/api/tasks/${taskToDelete}`, {
        method: "DELETE",
      });
      const responseData = await res.json();

      if (!res.ok)
        throw new Error(
          responseData.message || "Fehler beim Löschen der Aufgabe"
        );

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete)
      );
      setIsDeleteModalOpen(false);
      showToast("Aufgabe erfolgreich gelöscht!", "success");
    } catch (error) {
      console.error("Fehler beim Löschen der Aufgabe:", error);
      showToast(error.message, "error");
    }
  };

  // ✅ Function to create a new task
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    showToast("Neue Aufgabe erfolgreich erstellt!", "success");
  };

  // ✅ Function to show toast & auto-dismiss after 2 seconds
  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aufgaben</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-neutral"
          >
            + Neue Aufgabe
          </button>
        )}
      </div>

      <div className="rounded-lg shadow-md bg-white">
        <table className="table table-xs hover w-full rounded-lg border-indigo-300">
          <thead className="">
            <tr className="bg-indigo-100 text-slate-700 text-sm">
              <th className="py-2 px-3 text-left w-6">🔻</th>{" "}
              {/* Priority column - small */}
              <th className="py-2 px-3 text-left w-auto">Titel</th>{" "}
              {/* Title - More space */}
              <th className="py-2 px-3 text-left w-32">Status</th>{" "}
              {/* Fixed width */}
              <th className="py-2 px-3 text-left w-40">Zugewiesen an</th>{" "}
              {/* Assigned To Name */}
              <th className="py-2 px-3 text-left w-32">Rolle</th>{" "}
              {/* Assigned To Role */}
              <th className="py-2 px-3 text-left w-28">Fällig am</th>{" "}
              {/* Due Date - Smaller */}
              <th className="py-2 px-3 text-left w-28">Erstellt am</th>{" "}
              {/* Created At - Smaller */}
              <th className="py-2 px-3 text-center w-6">Aktion</th>{" "}
              {/* Actions - Smallest */}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                user={user}
                onUpdate={(taskId, updatedTask) => {
                  setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                      t._id === taskId ? { ...updatedTask, _id: taskId } : t
                    )
                  );
                }}
                onDelete={confirmDelete}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                assignedTo={task.assignedTo}
                dueDate={task.dueDate}
                createdAt={task.createdAt}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination Controls (Minimalistic & Functional) */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-xs btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700">Seite {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="btn btn-xs btn-neutral"
        >
          Weiter →
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {isModalOpen && (
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* ✅ Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Bist du sicher?</h3>
            <p className="py-4">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn btn-sm btn-neutral"
              >
                Abbrechen
              </button>
              <button
                onClick={handleTaskDelete}
                className="btn btn-sm btn-error"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast Notification (Auto-disappears) */}
      {toastMessage && (
        <div className="toast">
          <div
            className={`alert ${
              toastType === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
