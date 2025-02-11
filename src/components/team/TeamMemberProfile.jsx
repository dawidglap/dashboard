"use client";

import { useState, useEffect } from "react";
import ProfileDetails from "./ProfileDetails";
import MemberCompanies from "./MemberCompanies";

const TeamMemberProfile = ({ userId }) => {
  // ✅ Accept userId as a prop
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId provided. Skipping API calls.");
      setLoading(false);
      return;
    }

    const fetchTeamMemberData = async () => {
      try {
        setLoading(true);

        console.log("📡 Fetching user data for ID:", userId);
        const userRes = await fetch(`/api/users/${userId}`);
        if (!userRes.ok)
          throw new Error(`Error fetching user details: ${userRes.status}`);
        const userData = await userRes.json();
        setUser(userData.user);

        console.log("📡 Fetching companies for ID:", userId);
        const companiesRes = await fetch(`/api/users/${userId}/companies`);
        if (!companiesRes.ok)
          throw new Error(`Error fetching companies: ${companiesRes.status}`);
        const companiesData = await companiesRes.json();

        setCompanies(companiesData.companies);
      } catch (error) {
        console.error("❌ Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMemberData();
  }, [userId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg ">
      <h2 className="text-2xl font-semibold mb-6">
        <span className="font-extrabold">Teammitglied </span> :{" "}
        {user?.name || "Unbekannt"} {user?.surname || "Unbekannt"}
      </h2>

      {/* ✅ Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - User Details */}
        <ProfileDetails user={user} />

        {/* Right Side - Assigned Companies */}
        <div>
          <h3 className="text-sm font-medium pb-1 ps-4">
            Zugewiesene Unternehmen
          </h3>
          <MemberCompanies companies={companies} />
        </div>
      </div>
    </div>
  );
};

export default TeamMemberProfile;
