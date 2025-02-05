"use client";

import { useState, useEffect } from "react";
import {
  FaSearch,
  FaSyncAlt,
  FaUser,
  FaCalendarAlt,
  FaLock,
} from "react-icons/fa";

const FilterTaskBar = ({ onFilterChange }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assignedToFilter, setAssignedToFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [lockedFilter, setLockedFilter] = useState(false);
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
    const filters = {
      statusFilter,
      priorityFilter,
      assignedToFilter,
      searchQuery,
      dueDateFilter,
      lockedFilter: Boolean(lockedFilter),
    };

    console.log("🔎 Applying Filters:", filters);
    onFilterChange(filters);
  }, [
    statusFilter,
    priorityFilter,
    assignedToFilter,
    searchQuery,
    dueDateFilter,
    lockedFilter,
    onFilterChange,
  ]);

  const handleLockedFilterChange = (e) => {
    setLockedFilter(e.target.value === "true");
  };

  const resetFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setAssignedToFilter("");
    setSearchQuery("");
    setDueDateFilter("");
    setLockedFilter(false);
  };

  return (
    <div className="flex flex-wrap justify-evenly items-center gap-2 p-0  rounded-2xl mb-4">
      {/* 🔍 Search */}
      <div className="relative w-full md:w-3/12 ml-[-8px]">
        <FaSearch className="absolute left-3 top-2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Suche..."
          className="input input-sm input-bordered border-indigo-200 w-full rounded-full pl-9"
        />
      </div>

      {/* 🔄 Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="select select-sm select-bordered border-indigo-200 w-full md:w-1/12 rounded-full"
      >
        <option value="">Status</option>
        <option value="pending">⏳ Ausstehend</option>
        <option value="in_progress">🚀 In Bearbeitung</option>
        <option value="done">✅ Erledigt</option>
        <option value="cannot_complete">❌ Nicht abgeschlossen</option>
      </select>

      {/* 🚦 Priority Filter */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="select select-sm select-bordered border-indigo-200 w-full md:w-1/12 rounded-full"
      >
        <option value="">Priorität</option>
        <option value="high">🔥 Hoch</option>
        <option value="medium">⚡ Mittel</option>
        <option value="low">🍃 Niedrig</option>
      </select>

      {/* 👤 Assigned To Filter */}
      <select
        value={assignedToFilter}
        onChange={(e) => setAssignedToFilter(e.target.value || "")}
        className="select select-sm select-bordered border-indigo-200 w-full md:w-1/6 rounded-full"
      >
        <option value="">Zugewiesen an</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
      </select>

      {/* 📅 Due Date Filter */}
      <div className="relative w-full md:w-1/6">
        {/* <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" /> */}
        <input
          type="date"
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="input input-sm input-bordered border-indigo-200 w-full rounded-full pl-4"
        />
      </div>

      {/* 🔐 Locked Filter */}
      {/* <select
        value={lockedFilter ? "true" : "false"}
        onChange={handleLockedFilterChange}
        className="select select-sm select-bordered border-indigo-200 w-full md:w-[140px] rounded-full"
      >
        <option value="false">🔓 Entsperrt</option>
        <option value="true">🔒 Gesperrt</option>
      </select> */}

      {/* ♻ Reset Button */}
      <button
        onClick={resetFilters}
        className="w-1/6 btn btn-sm btn-outline rounded-full flex items-center px-3 mr-[-10px]"
      >
        <FaSyncAlt className="mr-1" />
        Zurücksetzen
      </button>
    </div>
  );
};

export default FilterTaskBar;
