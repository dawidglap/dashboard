"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // ✅ Import NextAuth session
import TaskRow from "@/components/tasks/TaskRow";
import NewTaskModal from "@/components/tasks/NewTaskModal";

const Tasks = () => {
  const { data: session } = useSession(); // ✅ Get user session
  const user = session?.user; // ✅ Extract user data

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("USER DATA:", user); // 🔍 Debugging

  useEffect(() => {
    const fetchTasks = async () => {
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
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task to list
  };

  if (loading) return <p className="text-center text-lg">Lädt...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Aufgaben</h1>

        {/* ✅ Check if the user is admin */}
        {user?.role === "admin" ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            + Neue Aufgabe
          </button>
        ) : (
          <p className="text-sm text-gray-500">
            Keine Berechtigung zum Erstellen von Aufgaben.
          </p>
        )}
      </div>

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
              <TaskRow key={task._id} task={task} />
            ))}
          </tbody>
        </table>
      </div>

      {/* New Task Modal */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default Tasks;
