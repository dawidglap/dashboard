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
    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between h-full">
      <div>
        <h2 className="text-lg font-semibold">Team</h2>
        <p className="text-3xl font-bold">
          {loading ? (
            <span className="skeleton h-8 w-10 bg-gray-300 rounded animate-pulse"></span>
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
          <p className="skeleton h-6 w-24 bg-gray-300 rounded animate-pulse"></p>
        ) : (
          <p>
            Neue Mitglieder diesen Monat:{" "}
            <strong>
              {newMembersThisMonth !== null ? newMembersThisMonth : "N/A"}
            </strong>
          </p>
        )}
      </div>

      {/* ✅ CTA Button */}
      <Link
        href="/dashboard/team"
        className="mt-4 inline-block bg-white text-purple-600 px-4 py-2 rounded-full text-center font-semibold hover:bg-gray-200 transition"
      >
        Team anzeigen →
      </Link>
    </div>
  );
};

export default TeamWidget;
