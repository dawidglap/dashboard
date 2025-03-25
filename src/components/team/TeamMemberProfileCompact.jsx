"use client";

import { useState, useEffect } from "react";
import MemberCompaniesCompact from "./MemberCompaniesCompact";

const TeamMemberProfileCompact = ({ userId }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;

        const fetchCompanies = async () => {
            try {
                const res = await fetch(`/api/users/${userId}/companies`);
                if (!res.ok) throw new Error("Fehler beim Laden der Firmen");
                const data = await res.json();
                setCompanies(data.companies || []);
            } catch (err) {
                console.error("❌ Fehler:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [userId]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    if (error) return <div className="p-6 text-red-500">Fehler: {error}</div>;

    return (
        <div className="p-6 w-full mx-auto bg-white dark:bg-gray-900 rounded-lg">
            <h2 className="text-3xl mt-8 md:text-4xl font-extrabold text-base-content mb-6">Mein Team</h2>
            <MemberCompaniesCompact companies={companies} userId={userId} />
        </div>
    );
};

export default TeamMemberProfileCompact;
