"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const PAGE_SIZE = 10;

const ReferralLeaderboard = () => {
    const [referrals, setReferrals] = useState([]);
    const [displayedRanking, setDisplayedRanking] = useState([]);
    const [page, setPage] = useState(1);
    const observerRef = useRef(null);

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

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const res = await fetch("/api/referrals");
                const data = await res.json();
                const cleaned = deduplicateByQuarterSecond(data.referrals || []);
                setReferrals(cleaned);
            } catch (err) {
                console.error("❌ Fehler beim Laden der Leaderboard-Daten:", err);
            }
        };

        fetchReferrals();
    }, []);

    const getRanking = () => {
        const map = new Map();
        referrals.forEach((ref) => {
            const userId = ref.userId;
            if (!userId) return;

            const fullName = `${ref.user?.name || "?"} ${ref.user?.surname || ""}`.trim();

            if (!map.has(userId)) {
                map.set(userId, { name: fullName, count: 1 });
            } else {
                map.get(userId).count += 1;
            }
        });

        return Array.from(map.values()).sort((a, b) => b.count - a.count);
    };

    const loadMore = useCallback(() => {
        const allRanking = getRanking();
        const nextPage = page + 1;
        const nextSlice = allRanking.slice(0, nextPage * PAGE_SIZE);
        setDisplayedRanking(nextSlice);
        setPage(nextPage);
    }, [page, referrals]);

    useEffect(() => {
        const allRanking = getRanking();
        setDisplayedRanking(allRanking.slice(0, PAGE_SIZE));
        setPage(1);
    }, [referrals]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        const el = observerRef.current;
        if (el) observer.observe(el);
        return () => {
            if (el) observer.unobserve(el);
        };
    }, [loadMore]);

    const getRankStyle = (index) => {
        switch (index) {
            case 0:
                return "text-yellow-500 font-bold";
            case 1:
                return "text-gray-400 font-bold";
            case 2:
                return "text-amber-600 font-bold";
            default:
                return "text-gray-600";
        }
    };

    return (
        <div className="bg-indigo-50 dark:bg-gray-900 rounded-lg shadow p-4 mt-11 max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-bold pb-4 mt-[-4px]">Affiliate-Rangliste</h3>
            {displayedRanking.length === 0 ? (
                <p className="text-gray-500 text-sm">Keine Daten vorhanden.</p>
            ) : (
                <ul className="space-y-4 text-sm mt-1">
                    {displayedRanking.map((entry, i) => (
                        <li
                            key={i}
                            className={`flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 ${getRankStyle(i)}`}
                        >
                            <span>{i + 1}. {entry.name}</span>
                            <span>{entry.count} Klicks</span>
                        </li>
                    ))}
                    <li ref={observerRef}></li>
                </ul>
            )}
        </div>
    );
};

export default ReferralLeaderboard;
