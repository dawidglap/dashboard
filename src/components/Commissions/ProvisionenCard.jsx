"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import PaidStatusIcon from "./PaidStatusIcon";
import PaidCommissionModal from "./PaidCommissionModal";
import { Check, X } from "lucide-react";

const ProvisionenCard = ({ provision }) => {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const isMarkenbotschafter = session?.user?.role === "markenbotschafter";

    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState(provision.statusProvisionen);

    const createdAt = new Date(provision.startDatum);
    const payDate = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

    const handleConfirmPaid = async () => {
        try {
            const res = await fetch("/api/commissions", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_name: provision.companyName,
                    status_provisionen: !status,
                }),
            });

            if (!res.ok) throw new Error("Update failed");
            setStatus(!status);
        } catch (err) {
            console.error("❌ Fehler:", err);
        } finally {
            setShowModal(false);
        }
    };

    return (
        <div className="bg-base-100 border rounded-xl shadow-sm p-4 space-y-2 text-xs sm:text-sm">
            {/* Titolo: Nome azienda */}
            <div className="font-bold text-sm sm:text-base leading-snug">{provision.companyName}</div>
            <div className="border-b border-indigo-400 mt-2 mb-1 block sm:hidden" />

            {/* Blocchi info */}
            <div className="space-y-1">
                <p><strong>Business Partner:</strong> {provision.managerName}</p>
                <p><strong>Markenbotschafter:</strong> {provision.mbName}</p>
                <p><strong>Startdatum:</strong> {createdAt.toLocaleDateString("de-DE")}</p>
                <p><strong>Zahlungsdatum:</strong> {payDate.toLocaleDateString("de-DE")}</p>
                <p>
                    <strong>Provision:</strong>{" "}
                    {isMarkenbotschafter ? (
                        <span className="text-green-600 font-semibold">
                            {provision.mbAmount.toLocaleString("de-DE")} CHF
                        </span>
                    ) : (
                        <span className="text-green-600 font-semibold">
                            {provision.managerAmount.toLocaleString("de-DE")} CHF |{" "}
                            {provision.mbAmount.toLocaleString("de-DE")} CHF
                        </span>
                    )}
                </p>
                <p className="flex items-center gap-2">
                    <strong>Bezahlt:</strong>
                    {isAdmin ? (
                        <button
                            onClick={() => setShowModal(true)}
                            className={`font-semibold ${status ? "text-green-600" : "text-red-500"} underline underline-offset-4`}
                        >
                            {status ? "Ja" : "Noch nicht"}
                        </button>
                    ) : (
                        <span className={`font-semibold ${status ? "text-green-600" : "text-red-500"}`}>
                            {status ? "Ja" : "Noch nicht"}
                        </span>
                    )}
                </p>

            </div>

            {showModal && (
                <PaidCommissionModal
                    company={provision}
                    onConfirm={handleConfirmPaid}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ProvisionenCard;
