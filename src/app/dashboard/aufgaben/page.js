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
          if (!res.ok) throw new Error("Failed to fetch user data.");
          const data = await res.json();
          setUser(data.user);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch user data.");
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || loading) return;

      setLoading(true);
      setTasks([]); // ✅ Clear tasks before loading new ones

      try {
        console.log(`⚡ Fetching tasks for page: ${page}`);
        const res = await fetch(`/api/tasks?page=${page}&limit=15`);
        if (!res.ok) throw new Error("Error fetching tasks.");
        const data = await res.json();

        if (data.data.length === 0) {
          setHasMore(false);
        } else {
          setTasks(data.data);
          setHasMore(true);
        }
      } catch (err) {
        console.error("⚠️ Error fetching tasks:", err);
        setError("Error fetching tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, user]); // ✅ `fetchTasks` is now inside `useEffect`

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
        throw new Error(responseData.message || "Error deleting task");

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete)
      );
      setIsDeleteModalOpen(false);
      setToastMessage("Task successfully deleted!");
      setToastType("success");
    } catch (error) {
      console.error("Error deleting task:", error);
      setToastMessage(error.message);
      setToastType("error");
    }
  };

  // ✅ Function to create a new task
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setToastMessage("New task successfully created!");
    setToastType("success");
  };

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>

        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            + New Task
          </button>
        )}
      </div>

      <div className="rounded-lg shadow-md bg-white">
        <table className="table table-compact table-zebra w-full rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="py-2 px-3 text-left">Title</th>
              <th className="py-2 px-3 text-left">Status</th>
              <th className="py-2 px-3 text-left">Priority</th>
              <th className="py-2 px-3 text-left">Actions</th>
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
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-secondary"
        >
          ← Previous Page
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="btn btn-primary"
        >
          Next Page →
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
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">This action cannot be undone.</p>
            <div className="modal-action">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn"
              >
                Cancel
              </button>
              <button onClick={handleTaskDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Toast Notification */}
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
