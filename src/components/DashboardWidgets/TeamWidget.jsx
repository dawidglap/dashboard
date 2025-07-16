"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const TeamWidget = () => {
  const [teamCount, setTeamCount] = useState(null);
  const [newMembersThisMonth, setNewMembersThisMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Error fetching team data.");
        const data = await res.json();

        // ✅ Ensure correct data access
        const teamMembers = data.users || [];
        setTeamCount(teamMembers.length);

        // ✅ Check for `createdAt` before filtering
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newMembers = teamMembers.filter((member) => {
          if (!member.createdAt) return false; // Skip users without `createdAt`
          const createdAt = new Date(member.createdAt);
          return (
            createdAt.getMonth() === currentMonth &&
            createdAt.getFullYear() === currentYear
          );
        });
        setNewMembersThisMonth(newMembers.length);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setTeamCount(0);
        setNewMembersThisMonth(0);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  return (
    <div className="relative border-white border-2 dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-gray-800 dark:text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-extrabold">Team</h2>
        <p className="text-4xl font-extrabold mt-1">
          {loading ? (
            <span className="skeleton h-8 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></span>
          ) : teamCount !== null ? (
            teamCount
          ) : (
            "N/A"
          )}
        </p>
      </div>

      {/* ✅ New Members This Month */}
      <div className="mt-4 text-sm opacity-90">
        {loading ? (
          <p className="skeleton h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></p>
        ) : (
          <p>
            Neue Mitglieder diesen Monat:{" "}
            <strong>
              {newMembersThisMonth !== null ? newMembersThisMonth : "N/A"}
            </strong>
          </p>
        )}
      </div>

      {/* ✅ Updated CTA Button */}
      <Link
        href="/dashboard/team"
        className="md:mt-0 mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 dark:from-indigo-500 dark:to-purple-400"
      >
        Team anzeigen →
      </Link>
    </div>
  );
};

export default TeamWidget;
