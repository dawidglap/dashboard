"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";

const ReferralTable = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);

    const deduplicateByQuarterSecond = (entries) => {
        const seen = new Set();
        return entries.filter((ref) => {
            const timestamp = new Date(ref.timestamp).getTime();
            // Normalizza a blocchi da 250ms (es. 12:00:00.000 → 12:00:00.250)
            const rounded = Math.floor(timestamp / 250);
            const key = `${ref.userId}_${rounded}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    };


    const fetchReferrals = async () => {
        try {
            const res = await fetch("/api/referrals");
            const data = await res.json();
            const cleaned = deduplicateByQuarterSecond(data.referrals || []);
            setReferrals(cleaned);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Referral-Daten:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    Referral-Klicks: {referrals.length}
                </h2>
                <button
                    onClick={fetchReferrals}
                    className="btn btn-outline btn-sm rounded-full flex items-center justify-center w-16 px-4 h-8"
                    title="Aktualisieren"
                >
                    <FaSyncAlt className="w-4 h-4" />
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-x-auto max-h-[80vh] overflow-auto rounded-lg"
                ref={containerRef}
            >
                <table className="table table-xs w-full border-b border-gray-200 dark:border-gray-700">
                    <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50">
                        <tr className="dark:bg-indigo-800 text-base-content text-sm">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">E-Mail</th>
                            <th className="py-3 px-4 text-left">Zeit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referrals.map((ref) => (
                            <tr
                                key={ref._id}
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm"
                            >
                                <td className="py-3 px-4">
                                    {ref.user?.name} {ref.user?.surname}
                                </td>
                                <td className="py-3 px-4">
                                    <a
                                        href={`mailto:${ref.user?.email}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        {ref.user?.email}
                                    </a>
                                </td>
                                <td className="py-3 px-4">
                                    {new Date(ref.timestamp).toLocaleString("de-DE")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default ReferralTable;
