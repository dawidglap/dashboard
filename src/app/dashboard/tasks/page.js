"use client";

import { useState, useEffect } from "react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="text-center text-lg">Lädt...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Aufgaben</h1>
      <div className="overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="table table-zebra w-full rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-4 px-6">Titel</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Priorität</th>
              <th className="py-4 px-6">Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td className="py-4 px-6">{task.title}</td>
                <td className="py-4 px-6">{task.status}</td>
                <td className="py-4 px-6">{task.priority}</td>
                <td className="py-4 px-6">
                  {new Date(task.createdAt).toLocaleDateString("de-DE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
