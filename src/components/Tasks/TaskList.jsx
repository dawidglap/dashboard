"use client";

import { useState, useEffect } from "react";
import TaskRow from "./TaskRow"; // We'll create this next

const TaskList = () => {
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
      <div className="rounded-lg shadow-md bg-white overflow-hidden">
        <table className="table w-full min-h-screen">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-6">Titel</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Priorität</th>
              <th className="py-4 px-6">Aktionen</th>
            </tr>
          </thead>
          <tbody className="">
            {tasks.map((task) => (
              <TaskRow key={task._id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
