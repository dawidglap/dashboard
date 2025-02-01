"use client";

import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, onEdit, onDelete }) => {
  const [page, setPage] = useState(1);
  const usersPerPage = 12;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const displayedUsers = users.slice(
    (page - 1) * usersPerPage,
    page * usersPerPage
  );

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="table table-xs hover w-full bg-white rounded-lg border-indigo-300">
        <thead>
          <tr className="bg-indigo-200 text-slate-700 text-sm">
            {/* <th className="py-2 px-3 w-6">#</th> */}
            <th className="py-2 px-3 text-left w-auto">👤 Vorname</th>

            <th className="py-2 px-3 text-left w-auto">📧 E-Mail</th>
            <th className="py-2 px-3 text-left w-32">🎂 Geburtstag</th>
            <th className="py-2 px-3 text-left w-36">🎭 Rolle</th>
            <th className="py-2 px-3 text-center w-16">⚙️ Aktion</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user, index) => (
            <tr
              key={user._id}
              className="border-b hover:bg-indigo-50 transition text-sm"
            >
              {/* <td className="py-2 px-3">
                {(page - 1) * usersPerPage + index + 1}
              </td> */}

              <td className="py-2 px-3 font-semibold">{user.name || "N/A"}</td>

              {/* ✅ Clickable Email - Opens Email Client */}
              <td className="py-2 px-3">
                {user.email ? (
                  <a
                    href={`mailto:${user.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {user.email}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>

              <td className="py-2 px-3">{user.birthday || "N/A"}</td>
              <td className="py-2 px-3 uppercase text-[10px] font-medium text-gray-600">
                {user.role}
              </td>
              <td className="py-2 px-3 flex justify-center space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 rounded hover:bg-indigo-200 transition"
                >
                  <FaEdit className="text-indigo-500" />
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="p-2 rounded hover:bg-red-200 transition"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="btn btn-xs btn-neutral"
        >
          ← Zurück
        </button>

        <span className="text-gray-700 text-xs">
          Seite {page} von {totalPages}
        </span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="btn btn-xs btn-neutral"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
};

export default UserTable;
