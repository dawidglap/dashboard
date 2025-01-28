"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NewTaskModal from "@/components/tasks/NewTaskModal.jsx";
import TaskRow from "@/components/Tasks/TaskRow.jsx";

const Tasks = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null); // Store the full user object
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("Session Data:", session); // Debugging session data
  console.log("USER DATA:", user); // Debugging user data

  // Fetch full user data on load
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const res = await fetch(`/api/users/me`);
          if (!res.ok) throw new Error("Failed to fetch user data.");
          const data = await res.json();
          setUser(data.user); // This should include _id
        } catch (err) {
          console.error(err);
          setError("Failed to fetch user data.");
        }
      }
    };

    fetchUserData();
  }, [session]);

  // Fetch tasks only after user data is available
  useEffect(() => {
    if (!user) return; // Do not fetch tasks until the user data is loaded

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben.");
        const data = await res.json();
        setTasks(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]); // Trigger fetching tasks only after `user` is set

  // Function to update task status in UI
  const handleTaskUpdate = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Function to add a new task in UI
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <progress className="progress w-56"></progress>
      </div>
    );

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aufgaben</h1>

        {/* Admins can create new tasks */}
        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            + Neue Aufgabe
          </button>
        )}
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Titel</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Priorität</th>
              <th className="py-4 px-6">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task._id}
                task={task}
                user={user}
                onUpdate={handleTaskUpdate}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <NewTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default Tasks;
