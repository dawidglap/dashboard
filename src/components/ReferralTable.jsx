"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt } from "react-icons/fa";

const PAGE_SIZE = 40;

const ReferralTable = () => {
    const [referrals, setReferrals] = useState([]);
    const [displayed, setDisplayed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const observerRef = useRef(null);
    const containerRef = useRef(null);

    const deduplicateByQuarterSecond = (entries) => {
        const seen = new Set();
        return entries.filter((ref) => {
            const timestamp = new Date(ref.timestamp).getTime();
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
            setDisplayed(cleaned.slice(0, PAGE_SIZE));
            setPage(1);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Referral-Daten:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals();
    }, []);

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        const nextSlice = referrals.slice(0, nextPage * PAGE_SIZE);
        setDisplayed(nextSlice);
        setPage(nextPage);
    }, [page, referrals]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            {
                root: containerRef.current,
                threshold: 1.0,
            }
        );

        const el = observerRef.current;
        if (el) observer.observe(el);
        return () => {
            if (el) observer.unobserve(el);
        };
    }, [loadMore]);

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:justify-between items-center mb-4 text-center lg:text-left">
                <h2 className="text-xl font-bold text-gray-600">
                    Referral-Klicks: {referrals.length}
                </h2>
                {/* <button
                    onClick={fetchReferrals}
                    className="btn btn-outline btn-sm rounded-full flex items-center justify-center w-16 px-4 h-8"
                    title="Aktualisieren"
                >
                    <FaSyncAlt className="w-4 h-4" />
                </button> */}
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
                        {displayed.map((ref) => (
                            <tr
                                key={ref._id}
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition text-sm"
                            >
                                <td className="py-3 px-4">
                                    <span className="hidden sm:inline font-semibold">
                                        {ref.user?.name} {ref.user?.surname}
                                    </span>
                                    <span className="block sm:hidden font-semibold">
                                        {ref.user?.name}<br />{ref.user?.surname}
                                    </span>
                                </td>

                                <td className="py-3 px-4 max-w-[100px] sm:max-w-none">
                                    <a
                                        href={`mailto:${ref.user?.email}`}
                                        className=" text-indigo-600 hover:underline block truncate sm:whitespace-normal"
                                        title={ref.user?.email}
                                    >
                                        {ref.user?.email}
                                    </a>
                                </td>

                                <td className="py-3 px-4">
                                    <span className="hidden sm:inline">
                                        {new Date(ref.timestamp).toLocaleString("de-DE")}
                                    </span>
                                    <span className="block sm:hidden ">
                                        {new Date(ref.timestamp).toLocaleDateString("de-DE")}
                                        <br />
                                        {new Date(ref.timestamp).toLocaleTimeString("de-DE", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </td>

                            </tr>
                        ))}
                        <tr ref={observerRef}></tr>
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default ReferralTable;
