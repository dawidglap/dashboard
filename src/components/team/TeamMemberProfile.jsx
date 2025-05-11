"use client";

import { useState, useEffect } from "react";
import ProfileDetails from "./ProfileDetails";
import MemberCompanies from "./MemberCompanies";

const TeamMemberProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);

  // state + fetch for promo code
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (user?.name && user?.surname) {
      fetch("/api/stripe/get-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, surname: user.surname }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setPromoCode(data.code);
        })
        .catch((err) => console.error("Fehler beim Laden des Promo-Codes:", err));
    }
  }, [user]);


  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId provided. Skipping API calls.");
      setLoading(false);
      return;
    }

    const fetchTeamMemberData = async () => {
      try {
        setLoading(true);
        console.log("📡 Fetching user (with manager) for ID:", userId);

        const userRes = await fetch(`/api/users/${userId}/with-manager`);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user?.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">
        <span className="font-extrabold">Teammitglied</span> :{" "}
        {user?.name || "Unbekannt"} {user?.surname || "Unbekannt"}
      </h2>

      {/* ✅ Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - User Details */}
        <div>
          <ProfileDetails user={user} />
          {promoCode && (
            <div className="mb-6">
              <label className="mt-4 block text-gray-700 text-sm font-medium pb-1">
                Dein Promo-Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={promoCode}
                  disabled
                  className="input input-bordered rounded-full w-full bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(promoCode);
                    setCopiedPromo(true);
                    setTimeout(() => setCopiedPromo(false), 2000);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 badge badge-soft badge-primary"
                >
                  {copiedPromo ? "Kopiert!" : "Kopieren"}
                </button>

              </div>
            </div>
          )}

          {user?.referralLink && (
            <div className="mb-6">
              <label className="mt-4 block text-gray-700 text-sm font-medium pb-1">
                Dein Empfehlungslink
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={user.referralLink}
                  disabled
                  className="input input-bordered rounded-full w-full bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-gray-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user?.referralLink);
                    setCopiedReferral(true);
                    setTimeout(() => setCopiedReferral(false), 2000);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 badge badge-soft badge-primary"
                >
                  {copiedReferral ? "Kopiert!" : "Kopieren"}
                </button>
              </div>
            </div>
          )}


        </div>

        {/* Right Side - Assigned Companies */}
        {/* Right Side - Dynamic Section */}
        <div className="space-y-2">
          {user?.role === "markenbotschafter" && user.manager ? (
            <div className="bg-gradient-to-r mt-5  from-indigo-600 to-purple-500 p-4 px-8 rounded-full shadow-xl">
              <div className="flex">
                <h3 className="text-sm font-semibold mb-2 text-gray-300 dark:text-gray-200">Dein Business Partner:</h3>
                <p className="text-sm text-white font-bold ms-2">
                  {user.manager.name} {user.manager.surname}
                </p>

              </div>
              <p className="text-sm text-white font-bold"><span className="text-sm font-semibold mb-2 text-gray-300 dark:text-gray-200">Kontakt:</span> {user.manager.email}</p>
            </div>
          ) : user?.role === "manager" ? (
            <>
              <h3 className="text-sm font-medium pb-1 ps-4">Mein Team</h3>
              <MemberCompanies companies={companies} userId={userId} />
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default TeamMemberProfile;
