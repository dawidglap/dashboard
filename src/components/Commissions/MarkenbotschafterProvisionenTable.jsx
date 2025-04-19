"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import PaidMBCommissionModal from "./PaidMBCommissionModal";
import { FiRefreshCw } from "react-icons/fi";

const MarkenbotschafterProvisionenTable = ({ selectedMB, setSelectedMB, onResetToCompanies }) => {


  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isManager = session?.user?.role === "manager";




  const [markenbotschafter, setMarkenbotschafter] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchMB = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (data.success && Array.isArray(data.users)) {
          const allMB = data.users.filter((u) => u.role === "markenbotschafter");

          const filtered = isAdmin
            ? allMB
            : isManager
              ? allMB.filter((mb) => mb.manager_id === session?.user?._id)
              : [];

          setMarkenbotschafter(filtered);
        }
      } catch (err) {
        console.error("❌ Fehler beim Laden:", err);
      }
    };

    fetchMB();
  }, [isAdmin, isManager, session?.user?._id]);

  const handleToggleStatus = async () => {
    const mb = markenbotschafter.find((m) => m._id === selectedMB);
    if (!mb) return;

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: mb._id,
          status_provisionen_markenbotschafter: !mb.status_provisionen_markenbotschafter,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = markenbotschafter.map((m) =>
        m._id === mb._id
          ? { ...m, status_provisionen_markenbotschafter: !m.status_provisionen_markenbotschafter }
          : m
      );

      setMarkenbotschafter(updated);
    } catch (err) {
      console.error("❌ Fehler beim Update:", err);
    } finally {
      setShowModal(false);
      // setSelectedMB("");
    }
  };


  return (
    <div className="bg-base-100 p-6 rounded-2xl mt-12 w-full">
      <h3 className="text-xl font-bold mb-4 border-b-2 border-indigo-300 pb-2 text-base-content">
        {selectedMB === "all"
          ? `Provisionen pro Markenbotschafter – Jahr ${new Date().getFullYear()}`
          : `Provision für ${markenbotschafter.find((m) => m._id === selectedMB)?.name || ""}`}
      </h3>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex gap-2">
            {/* 🔄 Select Markenbotschafter */}
            <select
              className="w-56 p-2 px-4 rounded-full text-gray-700 text-sm border bg-indigo-50 focus:ring focus:ring-indigo-300"
              onChange={(e) => {
                const value = e.target.value;
                setSelectedMB(value === "all" ? "all" : value); // 👈
              }}

              value={selectedMB || ""}
            >
              <option value="all">Alle Markenbotschafter</option>
              {markenbotschafter.map((mb) => (
                <option key={mb._id} value={mb._id}>
                  {mb.name} {mb.surname}
                </option>
              ))}
            </select>

            {/* 🔄 Reset */}
            <button
              onClick={() => {
                setSelectedMB(null);
                setShowAllCompanies(true);
              }}
              className="px-4 h-10 w-16 border rounded-full btn-outline transition"
              title="Alle Filter zurücksetzen"
            >
              <FiRefreshCw className="mx-auto w-4 h-4" />
            </button>

          </div>
        </div>

        {/* 💰 Totale */}
        <div className="p-2 px-4 text-sm rounded-full text-gray-700 border bg-indigo-50 focus:ring focus:ring-indigo-300">
          Gesamtprovisionen:{" "}
          <span className="text-green-600 font-bold">
            {(markenbotschafter.length * 300).toLocaleString("de-DE")} CHF
          </span>
        </div>
      </div>
      {/* 
      {!showAllCompanies && (
        <div className="mb-4">
          <button
            onClick={() => {
              setSelectedMB(null);
              setShowAllCompanies(true);
              onResetToCompanies?.(); // esegue la callback dal componente genitore, se esiste
            }}

            className="btn btn-outline btn-sm rounded-full text-sm"
          >
            ← Zurück zur Firmenübersicht
          </button>
        </div>
      )} */}

      <div className="overflow-x-auto max-h-[80vh] rounded-lg">
        <table className="table table-xs w-full text-left">
          <thead className="sticky top-0 bg-white dark:bg-gray-900 z-50 shadow-sm">
            <tr className="text-sm text-base-content border-b border-indigo-300">
              <th className="py-3 px-4 text-left text-xs">Name</th>
              {/* <th className="py-3 px-4 text-left text-xs">Email</th> */}
              <th className="py-3 px-4 text-center text-xs">Provision</th>

              <th className="py-3 px-4 text-left text-xs">Startdatum</th>
              <th className="py-3 px-4 text-left text-xs">Zahlungsdatum</th>
              <th className="py-3 px-4 text-center text-xs">Bezahlt</th>
            </tr>
          </thead>
          <tbody>
            {markenbotschafter

              .filter((mb) => selectedMB === "all" || mb._id === selectedMB)

              .map((mb, index) => {

                const createdAt = new Date(mb.createdAt);
                const zahlungsdatum = new Date(createdAt.getFullYear(), createdAt.getMonth() + 1, 25);

                return (
                  <tr
                    key={index}
                    className="hover:bg-indigo-50 dark:hover:bg-indigo-900 border-b border-gray-200 text-slate-700 dark:text-slate-200"
                  >
                    <td className="py-4 px-4 font-medium">{mb.name}{" "} {mb.surname}</td>
                    <td className="py-6 px-4 text-green-500 font-semibold text-center min-w-16">
                      300 CHF
                    </td>

                    {/* <td className="py-4 px-4">{mb.email}</td> */}
                    <td className="py-4 px-4">{createdAt.toLocaleDateString("de-DE")}</td>
                    <td className="py-4 px-4">{zahlungsdatum.toLocaleDateString("de-DE")}</td>
                    <td className="py-4 px-4 text-center">
                      {isAdmin ? (
                        <motion.button
                          className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${mb.status_provisionen_markenbotschafter ? "border-green-500" : "border-gray-400"
                            }`}
                          onClick={() => {
                            setSelectedMB(mb._id);
                            setShowModal(true);
                          }}
                          aria-label="Toggle Bezahlt"
                        >
                          {mb.status_provisionen_markenbotschafter ? (
                            <Check className="text-green-600" size={18} />
                          ) : (
                            <X className="text-gray-500" size={18} />
                          )}
                        </motion.button>
                      ) : (
                        <motion.div
                          className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${mb.status_provisionen_markenbotschafter ? "border-green-500" : "border-gray-400"
                            }`}
                          aria-label="Bezahlt Status (readonly)"
                        >
                          {mb.status_provisionen_markenbotschafter ? (
                            <Check className="text-green-500" size={18} />
                          ) : (
                            <X className="text-gray-500" size={18} />
                          )}
                        </motion.div>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showModal && selectedMB && (
        <PaidMBCommissionModal
          markenbotschafter={markenbotschafter.find((mb) => mb._id === selectedMB)}
          onConfirm={handleToggleStatus}
          onCancel={() => {
            setShowModal(false);
            setSelectedMB("");
          }}
        />
      )}

    </div>
  );
};

export default MarkenbotschafterProvisionenTable;
