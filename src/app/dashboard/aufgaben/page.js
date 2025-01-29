"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NewTaskModal from "../../../components/Tasks/NewTaskModal";
import TaskRow from "../../../components/Tasks/TaskRow";

const Tasks = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null); // Store full user object
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null); // 🔥 Manages which dropdown is open

  console.log("Session Data:", session);
  console.log("USER DATA:", user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const res = await fetch(`/api/users/me`);
          if (!res.ok) throw new Error("Failed to fetch user data.");
          const data = await res.json();
          setUser(data.user); // This should include `_id`
        } catch (err) {
          console.error(err);
          setError("Failed to fetch user data.");
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (!user) return; // Do not fetch tasks until user data is loaded

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
  }, [user]); // Fetch tasks only after `user` is set

  // Function to update a task in UI
  const handleTaskUpdate = (taskId, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Function to add a new task in UI
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // Function to delete a task
  const handleTaskDelete = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Fehler beim Löschen der Aufgabe");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setOpenDropdown(null);
    } catch (error) {
      console.error(error);
    }
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

        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            + Neue Aufgabe
          </button>
        )}
      </div>

      <div className=" rounded-lg shadow-md bg-white">
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
                onDelete={handleTaskDelete}
                openDropdownId={openDropdownId} // Pass state
                setOpenDropdownId={setOpenDropdownId}
              />
            ))}
          </tbody>
        </table>
      </div>

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
