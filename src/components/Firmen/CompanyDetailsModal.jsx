"use client";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

const formatSwissPhoneNumber = (number) => {
  if (!number) return "Nicht verfügbar";
  const digits = number.replace(/\D/g, "").slice(0, 14);
  if (digits.length === 10) {
    return digits.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
  }
  return number;
};





const CompanyDetailsModal = ({ company, onClose }) => {
  const [users, setUsers] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);




  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Fehler beim Laden der Benutzerliste", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!company || !company._id) return;

    const fetchCreatedAt = async () => {
      try {
        const res = await fetch(`/api/companies/${company._id}`);
        if (!res.ok) throw new Error("Fehler beim Laden von createdAt");
        const data = await res.json();
        setCreatedAt(data.data?.created_at || data.data?.createdAt || null);
      } catch (err) {
        console.error("Fehler beim Laden von createdAt:", err);
      }
    };

    fetchCreatedAt();
  }, [company]);


  const getManagerName = () => {
    const manager = users.find((u) => u._id === company.manager_id);
    return manager ? `${manager.name} ${manager.surname}` : "Nicht zugewiesen";
  };

  const getMarkenbotschafterName = () => {
    const bot = users.find((u) => u._id === company.markenbotschafter_id);
    return bot ? `${bot.name} ${bot.surname}` : "Nicht zugewiesen";
  };
  if (!company) return null;



  return (
    <div className="modal modal-open">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="modal-box max-w-5xl bg-base-100 shadow-lg rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-bold text-base-content">
            {company.company_name}
          </h3>
        </div>

        {/* Company Details Form (Read-Only) */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {/* Firmen-Name */}
          <div className="col-span-4">
            <label className="text-sm font-medium"> Kunden Name</label>
            <input
              type="text"
              value={company.company_name}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Straße & Hausnummer */}
          <div className="col-span-3">
            <label className="text-sm font-medium"> Strasse</label>
            <input
              type="text"
              value={company.company_street}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
          <div className="col-span-1">
            <label className="text-sm font-medium"> Nr</label>
            <input
              type="text"
              value={company.company_street_number}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* PLZ & Stadt */}
          <div className="col-span-1">
            <label className="text-sm font-medium"> PLZ</label>
            <input
              type="text"
              value={company.company_post_code}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
          <div className="col-span-3">
            <label className="text-sm font-medium"> Ort</label>
            <input
              type="text"
              value={company.company_city}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Startdatum */}
          <div className="col-span-1">
            <label className="text-sm font-medium">Startdatum</label>
            <input
              type="text"
              value={
                createdAt
                  ? new Date(createdAt).toLocaleDateString("de-DE")
                  : "Nicht verfügbar"
              }
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Ablaufdatum */}
          <div className="col-span-1">
            <label className="text-sm font-medium"> Ablaufdatum</label>
            <input
              type="text"
              value={
                company.expiration_date
                  ? new Date(company.expiration_date).toLocaleDateString("de-DE")
                  : "Kein Datum"
              }
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>


          {/* Firmen-E-Mail */}
          <div className="col-span-2">
            <label className="text-sm font-medium"> Firmen-E-Mail</label>
            <input
              type="email"
              value={company.company_email}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Telefon & Mobile */}
          <div className="col-span-2">
            <label className="text-sm font-medium"> Telefon</label>
            <input
              type="tel"
              value={formatSwissPhoneNumber(company.telephone)}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium"> Mobil</label>
            <input
              type="tel"
              value={formatSwissPhoneNumber(company.mobile)}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Plan & Plan-Preis */}
          <div className="col-span-2">
            <label className="text-sm font-medium"> Plan</label>
            <input
              type="text"
              value={company.plan}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium"> Plan-Preis</label>
            <input
              type="text"
              value={`CHF ${Number(company.plan_price || 0).toLocaleString(
                "de-DE"
              )}`}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>

          {/* Manager & Markenbotschafter */}
          <div className="col-span-2">
            <label className="text-sm font-medium"> Manager</label>
            <input
              type="text"
              value={getManagerName()}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium"> Markenbotschafter</label>
            <input
              type="text"
              value={getMarkenbotschafterName()}
              className="input input-sm input-bordered w-full rounded-full"
              readOnly
            />
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="btn btn-sm btn-neutral rounded-full"
          >
            Schliessen
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyDetailsModal;
