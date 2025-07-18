"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import NewTaskModal from "../../../components/Tasks/NewTaskModal";
import TaskRow from "../../../components/Tasks/TaskRow";
import FilterTaskBar from "../../../components/Tasks/FilterTaskBar"; // ✅ Import the filter component
import BulkActions from "../../../components/Tasks/BulkActions";
import TaskCard from "@/components/Tasks/TaskCard";

const Tasks = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]); // ✅ Declare users state
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filters, setFilters] = useState({
    statusFilter: "",
    priorityFilter: "",
    assignedToFilter: "",
    dueDateFilter: "",
    searchQuery: "",
  });
  const [selectedTasks, setSelectedTasks] = useState([]);

  // ✅ Move toast state here

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
    if (user && session?.user) {
      const fetchTasks = async () => {
        if (loading || !hasMore) return; // ✅ Prevent multiple fetches

        setLoading(true);
        try {
          const queryParams = new URLSearchParams({
            limit: "3000",
            offset: tasks.length.toString(),
          });

          // ✅ Include active filters in the query
          if (filters.statusFilter)
            queryParams.append("status", filters.statusFilter);
          if (filters.priorityFilter)
            queryParams.append("priority", filters.priorityFilter);
          if (filters.assignedToFilter)
            queryParams.append("assignedTo", filters.assignedToFilter);
          if (filters.dueDateFilter)
            queryParams.append("dueDate", filters.dueDateFilter);
          if (filters.searchQuery)
            queryParams.append("search", filters.searchQuery);

          const res = await fetch(`/api/tasks?${queryParams.toString()}`);
          const data = await res.json();

          if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben.");

          setTasks((prevTasks) => [...prevTasks, ...data.data]); // ✅ Append new tasks
          setHasMore(data.hasMore); // ✅ Stop fetching when no more tasks are left
        } catch (err) {
          console.error("⚠️ Fehler beim Abrufen der Aufgaben:", err);
          setError("Fehler beim Abrufen der Aufgaben.");
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [user, session, filters]); // ✅ Now refetches when filters change

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({ limit: "10000", offset: "0" });

      // ✅ Include active filters in the API request
      if (filters.statusFilter)
        queryParams.append("status", filters.statusFilter);
      if (filters.priorityFilter)
        queryParams.append("priority", filters.priorityFilter);
      if (filters.assignedToFilter)
        queryParams.append("assignedTo", filters.assignedToFilter);
      if (filters.dueDateFilter)
        queryParams.append("dueDate", filters.dueDateFilter);
      if (filters.searchQuery)
        queryParams.append("search", filters.searchQuery);

      const res = await fetch(`/api/tasks?${queryParams.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben.");

      setTasks(data.data); // ✅ Replace old tasks instead of appending
      setHasMore(data.hasMore); // ✅ Reset pagination properly
    } catch (err) {
      console.error("⚠️ Fehler beim Abrufen der Aufgaben:", err);
      setError("Fehler beim Abrufen der Aufgaben.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Call this function inside `useEffect` for scrolling:
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      const container = tableContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchTasks(); // ✅ Trigger fetch when near bottom
      }
    };

    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loading, hasMore, filters]);

  useEffect(() => {
    if (Object.values(filters).some((filter) => filter !== "")) {
      setPage(1);
    }
  }, [filters]);

  useEffect(() => {
    const cachedUsers = JSON.parse(localStorage.getItem("users"));

    if (cachedUsers) {
      setUsers(cachedUsers);
    } else {
      const fetchUsers = async () => {
        try {
          const res = await fetch("/api/users");
          if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
          const data = await res.json();
          setUsers(data.users); // ✅ Now it's properly set
          localStorage.setItem("users", JSON.stringify(data.users)); // ✅ Cache users
        } catch (error) {
          console.error("❌ Fehler:", error.message);
        }
      };

      fetchUsers();
    }
  }, []);

  // ✅ Function to update filters

  const handleFilterChange = useCallback((newFilters) => {
    setPage(1); // ✅ Reset page to 1
    setTasks([]); // ✅ Reset tasks to reload them with filters
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
    setHasMore(true); // ✅ Reset `hasMore` to allow fetching more tasks
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedTasks = [...tasks]; // Start with all tasks

      if (filters.priorityFilter) {
        updatedTasks = updatedTasks.filter(
          (task) => task.priority === filters.priorityFilter
        );
      }

      if (filters.statusFilter) {
        updatedTasks = updatedTasks.filter(
          (task) => task.status === filters.statusFilter
        );
      }

      if (filters.assignedToFilter) {
        updatedTasks = updatedTasks.filter(
          (task) => task?.assignedTo?._id === filters.assignedToFilter
        );
      }

      if (filters.dueDateFilter) {
        updatedTasks = updatedTasks.filter(
          (task) =>
            new Date(task.dueDate).toISOString().split("T")[0] ===
            filters.dueDateFilter
        );
      }

      if (filters.searchQuery) {
        updatedTasks = updatedTasks.filter((task) =>
          task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())
        );
      }

      setFilteredTasks(updatedTasks); // ✅ Update filtered tasks
    };

    applyFilters();
  }, [filters, tasks]); // ✅ Runs every time filters or tasks change

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

  const onBulkDelete = async (taskIds) => {
    if (!taskIds.length) return;

    try {
      const res = await fetch(`/api/tasks/bulk-delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds }),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || "Fehler beim Löschen");

      // ✅ Remove deleted tasks from UI
      setTasks((prevTasks) =>
        prevTasks.filter((task) => !taskIds.includes(task._id))
      );
      setSelectedTasks([]); // ✅ Reset selection after deletion
      showToast("Mehrere Aufgaben erfolgreich gelöscht!", "success");
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      showToast(error.message, "error");
    }
  };

  const onBulkStatusUpdate = async (taskIds, newStatus) => {
    if (!taskIds.length || !newStatus) return;

    try {
      const res = await fetch(`/api/tasks/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskIds, status: newStatus }),
      });

      const responseData = await res.json();
      if (!res.ok)
        throw new Error(responseData.message || "Fehler beim Aktualisieren");

      // ✅ Update tasks in UI
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          taskIds.includes(task._id) ? { ...task, status: newStatus } : task
        )
      );

      setSelectedTasks([]); // ✅ Reset selection
      showToast("Status erfolgreich aktualisiert!", "success");
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
      showToast(error.message, "error");
    }
  };

  // ✅ Function to create a new task
  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]); // ✅ Add the new task to UI first
    fetchTasks(); // ✅ Then re-fetch from API to get the latest data
  };

  // ✅ Function to show toast & auto-dismiss after 2 seconds
  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const displayedTasks = useMemo(() => {
    return tasks.length > 0 ? tasks : []; // ✅ Fallback to tasks array
  }, [tasks]);

  const handleTaskSelect = (taskId, isSelected) => {
    setSelectedTasks((prevSelected) =>
      isSelected
        ? [...prevSelected, taskId]
        : prevSelected.filter((id) => id !== taskId)
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(tasks.map((task) => task._id)); // ✅ Restore old logic
    } else {
      setSelectedTasks([]);
    }
  };

  useEffect(() => {
    console.log("🔄 UI Updated with selectedTasks:", selectedTasks);
  }, [selectedTasks]);

  // ✅ Check if all tasks are selected
  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;
  const someSelected =
    selectedTasks.length > 0 && selectedTasks.length < tasks.length;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 lg:px-4 xl:px-6 2xl:px-12">
  <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-4 mt-8 mb-6">
  <h1 className="text-2xl sm:text-4xl text-center lg:text-left font-extrabold text-base-content dark:text-white">
    Aufgaben
  </h1>

  {user?.role === "admin" && (
    <button
      onClick={() => setIsModalOpen(true)}
      className="btn btn-neutral px-4 hover:text-white btn-sm dark:text-white dark:hover:bg-slate-900 flex rounded-full items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>+ Neue Aufgabe</span>
    </button>
  )}
</div>

      <FilterTaskBar
        onFilterChange={handleFilterChange}
        users={users}
        user={user}
      />

      <div className="rounded-lg  bg-white">
        {/* ✅ Global Toast Notification */}
        <div className="toast toast-top toast-center"></div>
        {selectedTasks.length > 0 && (
          <BulkActions
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            setTasks={setTasks}
            showToast={showToast}
            user={user} // ✅ Pass showToast function
          />
        )}

        <div
          ref={tableContainerRef}
          className="overflow-x-auto max-h-[80vh] overflow-auto rounded-lg hidden xl:block"
        >
          <table className="table w-full border-b border-gray-200">
            <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-sm ">
              <tr>
                <th className=" py-3 px-4 w-6">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="checkbox checkbox-sm rounded-full"
                  />
                </th>
                <th className=" py-3 px-4 text-left text-lg font-bold w-6">!</th>{" "}
                {/* Priority column */}
                <th className=" py-3 px-4 text-left w-auto">Titel</th>
                <th className=" py-3 px-4 text-left w-44">Status</th>
                <th className=" py-3 px-4 text-left w-40">Zugewiesen an</th>
                <th className=" py-3 px-4 text-left w-32">Rolle</th>
                <th className=" py-3 px-4 text-left w-28">Fällig am</th>
                <th className=" py-3 px-4 text-left w-28">Erstellt am</th>
                <th className=" py-3 px-4 text-center w-6">Aktion</th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks
                .filter(
                  (task) =>
                    !filters.assignedToFilter ||
                    task?.assignedTo?._id === filters.assignedToFilter
                ) // ✅ Apply filter

                .map((task, index) => {
                  if (!task?._id) {
                    console.warn("⚠️ Skipping task with missing _id:", task);
                    return null; // ✅ Skip rendering if _id is missing
                  }

                  return (
                    <TaskRow
                      key={task._id || `temp-${index}`}
                      task={task}
                      user={user}
                      onUpdate={(taskId, updatedTask) => {
                        setTasks((prevTasks) =>
                          prevTasks.map((t) =>
                            t._id === taskId ? updatedTask : t
                          )
                        );
                      }}
                      onDelete={confirmDelete}
                      openDropdownId={openDropdownId}
                      setOpenDropdownId={setOpenDropdownId}
                      assignedTo={
                        task?.assignedTo && typeof task.assignedTo === "object"
                          ? task.assignedTo
                          : {
                              _id: "unassigned",
                              name: "Nicht zugewiesen",
                              role: "Unbekannt",
                            }
                      }
                      dueDate={task?.dueDate ?? "Kein Datum"}
                      createdAt={task?.createdAt ?? "Unbekannt"}
                      onSelectTask={handleTaskSelect}
                      isSelected={selectedTasks.includes(task._id)}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile & Tablet view: TaskCard */}
<div className="xl:hidden space-y-4">
  {filteredTasks
    .filter(
      (task) =>
       task &&
task._id &&
(
  !filters.assignedToFilter ||
  (
    typeof task.assignedTo === "object"
      ? task.assignedTo?._id === filters.assignedToFilter
      : task.assignedTo === filters.assignedToFilter
  )
)

    )
    .map((task, index) => (
      <TaskCard
        key={task._id || `card-${index}`}
        task={task}
        user={user}
     onUpdate={(taskId, updatedTask) => {
  setTasks((prev) =>
    prev.map((t) => (t?._id === taskId ? updatedTask : t))
  );

  // ✅ Reset dei filtri (opzionale, se vuoi che il task non scompaia)
  setFilters({
    statusFilter: "",
    priorityFilter: "",
    assignedToFilter: "",
    dueDateFilter: "",
    searchQuery: "",
  });

  showToast("Aufgabe aktualisiert.", "success");
}}


        onDelete={confirmDelete}
        assignedTo={
          task?.assignedTo && typeof task.assignedTo === "object"
            ? task.assignedTo
            : {
                _id: "unassigned",
                name: "Nicht zugewiesen",
                role: "Unbekannt",
              }
        }
        dueDate={task?.dueDate}
        createdAt={task?.createdAt}
        isSelected={selectedTasks.includes(task._id)}
        onSelectTask={handleTaskSelect}
      />
    ))}
</div>


      </div>

      {/* ✅ Pagination Controls (Minimalistic & Functional) */}
      {/* <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-xs px-4 rounded-full btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-xs">Seite {page}</span>

        <button
          onClick={() => {
            if (hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
          disabled={!hasMore || loading} // ✅ Prevent clicking when no more pages
          className="btn btn-xs px-4 rounded-full btn-neutral"
        >
          Weiter →
        </button>
      </div> */}

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
        <div className="toast toast-bottom-right z-50">
          <div
            className={`alert p-2 text-sm shadow-lg ${
              toastType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
