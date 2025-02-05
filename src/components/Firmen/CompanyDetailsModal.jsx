"use client";

import {
  FaTimes,
  FaBuilding,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaCalendar,
  FaClipboardList,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

const CompanyDetailsModal = ({ company, onClose }) => {
  if (!company) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-base-100 shadow-xl rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-indigo-200 pb-3">
          <h2 className="text-xl font-extrabold text-base-content flex items-center gap-2">
            {company.company_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* 📍 Address Section */}
          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaMapMarkerAlt className=" text-indigo-500" /> Adresse:
            </span>
            <p>
              {company.company_street} {company.company_street_number}
            </p>
            <p>
              {company.company_post_code}, {company.company_city}
            </p>
          </div>

          {/* 📞 Contact Information */}
          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaEnvelope className=" text-indigo-500" /> E-Mail:
            </span>
            <a
              href={`mailto:${company.company_email}`}
              className="text-primary hover:underline"
            >
              {company.company_email || "Nicht verfügbar"}
            </a>
          </div>

          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaPhone className=" text-blue-500" /> Telefon:
            </span>
            <a
              href={`tel:${company.telephone}`}
              className="text-primary hover:underline"
            >
              {company.telephone || "Nicht verfügbar"}
            </a>
          </div>

          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaPhone className=" text-green-500" /> Mobile:
            </span>
            <a
              href={`tel:${company.mobile}`}
              className="text-primary hover:underline"
            >
              {company.mobile || "Nicht verfügbar"}
            </a>
          </div>

          {/* 💰 Subscription & Plan */}
          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaClipboardList className=" text-gray-500" /> Plan:
            </span>
            <p className="text-base-content">{company.plan}</p>
          </div>

          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaDollarSign className=" text-gray-500" /> Plan-Preis:
            </span>
            <p className="text-base-content">
              CHF{" "}
              {company.plan_price
                ? Number(company.plan_price).toFixed(2)
                : "Nicht verfügbar"}
            </p>
          </div>

          {/* 📅 Subscription Expiry */}
          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaCalendar className=" text-red-500" /> Ablaufdatum:
            </span>
            <p className="text-base-content">
              {company.expiration_date
                ? new Date(company.expiration_date).toLocaleDateString("de-DE")
                : "Kein Datum"}
            </p>
          </div>

          {/* 🧑‍💼 Assigned Users */}
          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaUsers className=" text-indigo-500" /> Manager:
            </span>
            <p className="text-base-content">
              {company.manager_name || "Nicht zugewiesen"}
            </p>
          </div>

          <div className="border p-3 rounded-lg bg-base-200">
            <span className="font-bold flex items-center gap-2">
              <FaUsers className=" text-indigo-500" /> Markenbotschafter:
            </span>
            <p className="text-base-content">
              {company.markenbotschafter_name || "Nicht zugewiesen"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-neutral px-6 py-1 text-sm rounded-full"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsModal;
