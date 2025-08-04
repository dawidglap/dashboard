"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const MarkenbotschafterProvisionenLite = ({ userId }) => {
    const [markenbotschafter, setMarkenbotschafter] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchMB = async () => {
            try {
                const res = await fetch(`/api/users/${userId}/markenbotschafter`);
                const data = await res.json();

                console.log("📦 ProvisionenLite MBs:", data.users);
                if (data.success && Array.isArray(data.users)) {
                    setMarkenbotschafter(data.users);
                }
            } catch (err) {
                console.error("❌ Fehler beim Laden der Provisionen:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMB();
    }, [userId]);

    if (loading) {
        return <div className="text-sm text-center text-gray-500 py-6">Lade Daten...</div>;
    }

    const mbCount = markenbotschafter.length;
    const total = mbCount * 300;

    return (
        <div className="w-full bg-base-100 p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                    Provisionen für dein Team <span className="text-gray-500">({mbCount})</span>
                </h2>
                <div className="text-sm font-bold text-green-600">
                    Gesamt: {total.toLocaleString("de-DE")} CHF
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-xs w-full text-left">
                    <thead className="bg-white sticky top-0 shadow-sm z-10">
                        <tr className="text-xs text-gray-600 border-b border-indigo-300">
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4 text-center">Provision</th>
                            <th className="py-2 px-4">Startdatum</th>
                            <th className="py-2 px-4">Zahlungsdatum</th>
                            <th className="py-2 px-4 text-center">Bezahlt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {markenbotschafter.map((mb) => {
                            const createdAt = new Date(mb.createdAt);
                            const zahlungsdatum = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

                            return (
                                <tr
                                    key={mb._id}
                                    className="border-b border-gray-200 text-sm hover:bg-indigo-50"
                                >
                                    <td className="py-3 px-4 font-medium">{mb.name} {mb.surname}</td>
                                    <td className="py-3 px-4 text-green-600 text-center font-bold">300 CHF</td>
                                    <td className="py-3 px-4">{createdAt.toLocaleDateString("de-DE")}</td>
                                    <td className="py-3 px-4">{zahlungsdatum.toLocaleDateString("de-DE")}</td>
                                    <td className="py-3 px-4 text-center">
                                        {mb.status_provisionen_markenbotschafter ? (
                                            <Check className="text-green-600 mx-auto" size={18} />
                                        ) : (
                                            <X className="text-gray-400 mx-auto" size={18} />
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarkenbotschafterProvisionenLite;
