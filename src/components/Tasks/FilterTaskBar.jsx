"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaSyncAlt, FaUser, FaCalendarAlt } from "react-icons/fa";

const FilterTaskBar = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [users, setUsers] = useState([]);

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

  const resetFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssignedToFilter("");
    setSearchQuery("");
    setDueDateFilter("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-indigo-200 rounded-t-lg shadow-sm">
      {/* 🔍 Search */}
      <div className="relative w-full md:w-1/5">
        <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche..."
          className="input input-sm input-bordered w-full pl-9"
        />
      </div>

      {/* 🔄 Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="select select-sm select-bordered w-full md:w-[150px]"
      >
        <option value="">🔄 Status</option>
        <option value="pending">⏳ Ausstehend</option>
        <option value="in_progress">🚀 In Bearbeitung</option>
        <option value="done">✅ Erledigt</option>
        <option value="cannot_complete">❌ Nicht abgeschlossen</option>
      </select>

      {/* 🚦 Priority Filter */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="select select-sm select-bordered w-full md:w-[150px]"
      >
        <option value="">🚦 Priorität</option>
        <option value="high">🔥 Hoch</option>
        <option value="medium">⚡ Mittel</option>
        <option value="low">🍃 Niedrig</option>
      </select>

      {/* 👤 Assigned To Filter */}
      <select
        value={assignedToFilter}
        onChange={(e) => setAssignedToFilter(e.target.value || "")} // Ensure it doesn't pass undefined
        className="select select-sm select-bordered w-full md:w-[140px]"
      >
        <option value="">👤 Zugewiesen an</option>
        {users.map((user) => (
          <option key={user._id} value={user._id.toString()}>
            {" "}
            {/* Ensure it's a string */}
            {user.name}
          </option>
        ))}
      </select>

      {/* 📅 Due Date Filter */}
      <div className="relative w-full md:w-[120px]">
        <FaCalendarAlt className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="input input-sm input-bordered w-full pl-9"
        />
      </div>

      {/* ♻ Reset Button */}
      <button onClick={resetFilters} className="btn btn-sm btn-outline">
        <FaSyncAlt />
      </button>
    </div>
  );
};

export default FilterTaskBar;
