"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

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
    <div className="card p-4 rounded-lg shadow-lg bg-gradient-to-r from-purple-50 to-purple-100 col-span-2">
      <Link href="/dashboard/team" className="flex items-start space-x-4">
        <FaUser className="text-purple-500 text-4xl" />
        <div>
          <h2 className="text-lg font-bold text-gray-800">Team</h2>
          {loading ? (
            <>
              <p className="skeleton h-6 w-10 bg-gray-300 rounded animate-pulse"></p>
              <p className="skeleton h-6 w-16 bg-gray-300 rounded animate-pulse mt-2"></p>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-sm">
                Mitglieder: <strong>{teamCount}</strong>
              </p>
              <p className="text-gray-600 text-sm">
                Neue diesen Monat: <strong>{newMembersThisMonth}</strong>
              </p>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default TeamWidget;
