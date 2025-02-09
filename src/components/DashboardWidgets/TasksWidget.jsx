"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TasksWidget = () => {
  const [tasksCount, setTasksCount] = useState(null);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [nextDueTask, setNextDueTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        const tasks = data?.data || [];

        // ✅ Total number of tasks
        setTasksCount(tasks.length);

        // ✅ Task status breakdown
        setPendingTasks(
          tasks.filter((task) => task.status === "pending").length
        );
        setInProgressTasks(
          tasks.filter((task) => task.status === "in_progress").length
        );
        setCompletedTasks(
          tasks.filter((task) => task.status === "done").length
        );

        // ✅ Find the next due task
        const upcomingTask = tasks
          .filter((task) => new Date(task.dueDate) > new Date())
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0];

        if (upcomingTask) {
          setNextDueTask({
            title: upcomingTask.title,
            dueDate: new Date(upcomingTask.dueDate).toLocaleDateString(
              "de-DE",
              {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            ),
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasksCount(0);
        setNextDueTask(null);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="relative bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full">
      {/* ✅ Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Aufgaben</h2>
        <p className="text-4xl font-extrabold text-yellow-600 mt-1">
          {loading ? (
            <span className="skeleton h-8 w-10 bg-gray-300 rounded animate-pulse"></span>
          ) : tasksCount !== null ? (
            tasksCount
          ) : (
            "N/A"
          )}
        </p>
      </div>

      {/* ✅ Task Breakdown in 3 Columns */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        {loading ? (
          <>
            <p className="skeleton h-6 w-full bg-gray-300 rounded animate-pulse"></p>
            <p className="skeleton h-6 w-full bg-gray-300 rounded animate-pulse"></p>
            <p className="skeleton h-6 w-full bg-gray-300 rounded animate-pulse"></p>
          </>
        ) : (
          <>
            <p className="text-gray-700 flex items-center">
              🟠 <span className="ml-1">In Bearbeitung:</span>{" "}
              <strong>{inProgressTasks}</strong>
            </p>
            <p className="text-gray-700 flex items-center">
              🟢 <span className="ml-1">Erledigt:</span>{" "}
              <strong>{completedTasks}</strong>
            </p>
            <p className="text-gray-700 flex items-center">
              🔴 <span className="ml-1">Ausstehend:</span>{" "}
              <strong>{pendingTasks}</strong>
            </p>
          </>
        )}
      </div>

      {/* ✅ Next Due Task */}
      <div className="mt-4 text-sm">
        {loading ? (
          <p className="skeleton h-6 w-32 bg-gray-300 rounded animate-pulse"></p>
        ) : nextDueTask ? (
          <p className="text-gray-700">
            📅 Nächste Aufgabe: <strong>{nextDueTask.title}</strong>
            <br />
            🗓️ Fällig am: <strong>{nextDueTask.dueDate}</strong>
          </p>
        ) : (
          <p className="text-gray-500">Keine anstehenden Aufgaben.</p>
        )}
      </div>

      {/* ✅ CTA Button */}
      <Link
        href="/dashboard/tasks"
        className="mt-6 inline-block bg-yellow-500 text-white px-6 py-2 rounded-full text-center font-semibold hover:bg-yellow-600 transition"
      >
        Aufgaben anzeigen →
      </Link>
    </div>
  );
};

export default TasksWidget;
