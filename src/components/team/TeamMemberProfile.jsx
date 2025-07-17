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
    <div className="p-4 sm:p-6 xl:p-8 w-full overflow-x-hidden bg-white dark:bg-gray-900 rounded-lg max-w-full">
      <h2 className="text-center md:text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 leading-snug">
        <span className="font-extrabold">Teammitglied:</span>
        <br className="block lg:hidden" />
        <span className="lg:inline"> {user?.name || "Unbekannt"} {user?.surname || "Unbekannt"}</span>
      </h2>


      {/* Layout responsive, padding-right per evitare overflow da 768 a 1280 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:pr-[256px] xl:pr-0">
        {/* Left side */}
        <div className="overflow-hidden">
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

        {/* Right side */}
        <div className="space-y-4">
          {user?.role === "markenbotschafter" && user.manager ? (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl xl:rounded-full shadow-xl px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-6">
              {/* Titolo + nome */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-200">
                  Dein Business Partner:
                </h3>
                <p className="text-sm sm:text-base text-white font-bold">
                  {user.manager.name} {user.manager.surname}
                </p>
              </div>

              {/* Contatto */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-sm font-semibold text-gray-300 dark:text-gray-200">
                  Kontakt:
                </span>
                <span className="text-sm text-white font-bold break-words max-w-full">
                  {user.manager.email}
                </span>
              </div>
            </div>
          ) : user?.role === "manager" ? (
            <>
              <h3 className="text-base sm:text-lg font-semibold pb-1 ps-2 sm:ps-4">
                Mein Team
              </h3>
              <MemberCompanies companies={companies} userId={userId} />
            </>
          ) : null}
        </div>

      </div>
    </div>




  );
};

export default TeamMemberProfile;
