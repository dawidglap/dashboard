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
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-indigo-600" /> {company.company_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content Sections */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          {/* 📍 Address Section */}
          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaMapMarkerAlt className="text-indigo-500" /> Adresse:
            </span>
            <p className="text-gray-800">
              {company.company_street} {company.company_street_number}
            </p>
            <p className="text-gray-800">
              {company.company_post_code}, {company.company_city}
            </p>
          </div>

          {/* 📞 Contact Information */}
          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaEnvelope className="text-indigo-500" /> E-Mail:
            </span>
            <a
              href={`mailto:${company.company_email}`}
              className="text-blue-600 hover:underline"
            >
              {company.company_email || "Nicht verfügbar"}
            </a>
          </div>

          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaPhone className="text-blue-500" /> Telefon:
            </span>
            <a
              href={`tel:${company.telephone}`}
              className="text-blue-600 hover:underline"
            >
              {company.telephone || "Nicht verfügbar"}
            </a>
          </div>

          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaPhone className="text-green-500" /> Mobile:
            </span>
            <a
              href={`tel:${company.mobile}`}
              className="text-blue-600 hover:underline"
            >
              {company.mobile || "Nicht verfügbar"}
            </a>
          </div>

          {/* 💰 Subscription & Plan */}
          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaClipboardList className="text-gray-500" /> Plan:
            </span>
            <p className="text-gray-900">{company.plan}</p>
          </div>

          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaDollarSign className="text-gray-500" /> Plan-Preis:
            </span>
            <p className="text-gray-900">
              CHF{" "}
              {company.plan_price
                ? Number(company.plan_price).toFixed(2)
                : "Nicht verfügbar"}
            </p>
          </div>

          {/* 📅 Subscription Expiry */}
          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaCalendar className="text-red-500" /> Ablaufdatum:
            </span>
            <p className="text-gray-900">
              {company.expiration_date
                ? new Date(company.expiration_date).toLocaleDateString("de-DE")
                : "Kein Datum"}
            </p>
          </div>

          {/* 🧑‍💼 Assigned Users */}
          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaUsers className="text-indigo-500" /> Manager:
            </span>
            <p className="text-gray-900">
              {company.manager_name || "Nicht zugewiesen"}
            </p>
          </div>

          <div className="border p-2 rounded-md">
            <span className="font-medium flex items-center gap-1 text-gray-700">
              <FaUsers className="text-indigo-500" /> Markenbotschafter:
            </span>
            <p className="text-gray-900">
              {company.markenbotschafter_name || "Nicht zugewiesen"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm transition"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsModal;
