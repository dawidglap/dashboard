"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import NewTaskModal from "../../../components/Tasks/NewTaskModal";
import TaskRow from "../../../components/Tasks/TaskRow";
import FilterTaskBar from "../../../components/Tasks/FilterTaskBar"; // ✅ Import the filter component
import BulkActions from "../../../components/Tasks/BulkActions";

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
        setLoading(true);
        try {
          console.log(
            `⚡ Fetching tasks for page ${page} with filters`,
            filters
          );

          const queryParams = new URLSearchParams({
            page: page.toString(), // ✅ Now correctly reset before fetch
            limit: "8",
          });

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
          if (!res.ok) throw new Error("Fehler beim Abrufen der Aufgaben.");
          const data = await res.json();

          console.log("📡 API Response:", data);
          setTasks(data.data || []);
          setHasMore(data.hasMore || false);
        } catch (err) {
          console.error("⚠️ Fehler beim Abrufen der Aufgaben:", err);
          setError("Fehler beim Abrufen der Aufgaben.");
        } finally {
          setLoading(false);
        }
      };

      fetchTasks();
    }
  }, [page, user, filters]); // ✅ Page is now properly updated first before fetching tasks

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
    setPage(1); // ✅ First reset to page 1
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

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
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    showToast("Neue Aufgabe erfolgreich erstellt!", "success");
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

  // ✅ Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(tasks.map((task) => task._id)); // Select all tasks
    } else {
      setSelectedTasks([]); // Deselect all
    }
  };

  // ✅ Check if all tasks are selected
  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;
  const someSelected =
    selectedTasks.length > 0 && selectedTasks.length < tasks.length;

  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="px-4 md:px-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl mt-8 md:text-4xl font-extrabold text-base-content mb-6">
          Aufgaben
        </h1>

        {user?.role === "admin" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-neutral px-4 rounded-full"
          >
            + Neue Aufgabe
          </button>
        )}
      </div>
      <FilterTaskBar onFilterChange={handleFilterChange} users={users} />

      <div className="rounded-lg  bg-white">
        {/* ✅ Global Toast Notification */}
        <div className="toast toast-top toast-center"></div>
        {selectedTasks.length > 0 && (
          <BulkActions
            selectedTasks={selectedTasks}
            setSelectedTasks={setSelectedTasks}
            setTasks={setTasks}
            showToast={showToast} // ✅ Pass showToast function
          />
        )}

        <table className="table w-full  border-b border-gray-200">
          <thead className=" text-gray-700 text-sm border-b">
            <tr>
              <th className="py-3 px-4 w-6">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="checkbox checkbox-sm"
                />
              </th>
              <th className="py-3 px-4 text-left w-6">⚠️</th>{" "}
              {/* Priority column */}
              <th className="py-3 px-4 text-left w-auto">Titel</th>
              <th className="py-3 px-4 text-left w-44">Status</th>
              <th className="py-3 px-4 text-left w-40">Zugewiesen an</th>
              <th className="py-3 px-4 text-left w-32">Rolle</th>
              <th className="py-3 px-4 text-left w-28">Fällig am</th>
              <th className="py-3 px-4 text-left w-28">Erstellt am</th>
              <th className="py-3 px-4 text-center w-6">Aktion</th>
            </tr>
          </thead>

          <tbody>
            {displayedTasks
              .flatMap((task) =>
                Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                  ? task.assignedTo.map((assignee) => ({
                      ...task,
                      assignedTo: assignee, // ✅ Assign each user to a row
                    }))
                  : [
                      {
                        ...task,
                        assignedTo: {
                          name: "Nicht zugewiesen",
                          role: "Unbekannt",
                        },
                      },
                    ]
              )
              .filter(
                (task) =>
                  !filters.assignedToFilter ||
                  task.assignedTo?._id === filters.assignedToFilter
              ) // ✅ Apply filter
              .slice((page - 1) * 8, page * 8) // ✅ Apply pagination AFTER expansion
              .map((task) => (
                <TaskRow
                  key={`${task._id}-${task.assignedTo?._id || "unassigned"}`}
                  task={task}
                  user={user}
                  onUpdate={(taskId, updatedTask) => {
                    setTasks((prevTasks) =>
                      prevTasks.map((t) => (t._id === taskId ? updatedTask : t))
                    );
                  }}
                  onDelete={confirmDelete}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                  assignedTo={task.assignedTo} // ✅ Pass assigned user separately
                  dueDate={task.dueDate}
                  createdAt={task.createdAt}
                  onSelectTask={handleTaskSelect}
                  isSelected={selectedTasks.includes(
                    `${task._id}-${task.assignedTo?._id || "unassigned"}`
                  )}
                  showActions={task.isFirstRow} // ✅ Only show actions for the first row
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
          className="btn btn-xs px-4 rounded-full btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-xs">Seite {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!hasMore}
          className="btn btn-xs px-4 rounded-full btn-neutral"
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
