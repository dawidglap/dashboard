"use client";

import { useState, useEffect } from "react";

const FilterTaskBar = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [users, setUsers] = useState([]);

  // ✅ Fetch Users for Assigned To Filter
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Fehler beim Laden der Benutzerliste");
        const data = await res.json();
        setUsers(data.users);
      } catch (error) {
        console.error("❌ Fehler:", error.message);
      }
    };

    fetchUsers();
  }, []);

  // ✅ Apply Filters when any filter changes
  useEffect(() => {
    onFilterChange({
      statusFilter,
      priorityFilter,
      assignedToFilter,
      searchQuery,
      dueDateFilter,
    });
  }, [
    statusFilter,
    priorityFilter,
    assignedToFilter,
    searchQuery,
    dueDateFilter,
    onFilterChange,
  ]);

  // ✅ Reset Filters Function
  const resetFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssignedToFilter("");
    setSearchQuery("");
    setDueDateFilter(""); // ✅ Reset Due Date
  };

  return (
    <div className="flex flex-wrap gap-4 bg-indigo-50 p-3 rounded-lg mb-4">
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="🔍 Suche nach Titel..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-sm input-bordered w-full md:w-1/5"
      />

      {/* 🔄 Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="select select-sm select-bordered w-full md:w-1/6"
      >
        <option value="">🔄 Status filtern</option>
        <option value="pending">⏳ Ausstehend</option>
        <option value="in_progress">🚀 In Bearbeitung</option>
        <option value="done">✅ Erledigt</option>
        <option value="cannot_complete">❌ Nicht abgeschlossen</option>
      </select>

      {/* 🚦 Priority Filter */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="select select-sm select-bordered w-full md:w-1/6"
      >
        <option value="">🚦 Priorität filtern</option>
        <option value="high">🔥 Hoch</option>
        <option value="medium">⚡ Mittel</option>
        <option value="low">🍃 Niedrig</option>
      </select>

      {/* 👤 Assigned To Filter */}
      <select
        value={assignedToFilter}
        onChange={(e) => setAssignedToFilter(e.target.value)}
        className="select select-sm select-bordered w-full md:w-1/6"
      >
        <option value="">👤 Zugewiesen an</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>

      {/* 📅 Due Date Filter */}
      <input
        type="date"
        value={dueDateFilter}
        onChange={(e) => setDueDateFilter(e.target.value)}
        className="input input-sm input-bordered w-full md:w-1/5"
      />

      {/* 🧹 Reset Button */}
      <button
        onClick={resetFilters}
        className="btn btn-sm bg-gray-400 hover:bg-gray-500 text-white"
      >
        🧹 Filter zurücksetzen
      </button>
    </div>
  );
};

export default FilterTaskBar;
