"use client";

import React, { useEffect, useState } from "react";

const Earnings = () => {
  const [companies, setCompanies] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompaniesData = async () => {
      try {
        const response = await fetch("/api/companies"); // Fetch all companies
        if (!response.ok) throw new Error("Error fetching companies data.");
        const data = await response.json();

        // Calculate total earnings
        let earnings = 0;
        data.data.forEach((company) => {
          if (company.plan === "BASIC") {
            earnings += 799 * 12 * 1.081; // BASIC plan price with tax
          } else if (company.plan === "PRO") {
            earnings += 899 * 12 * 1.081; // PRO plan price with tax
          } else if (company.plan === "BUSINESS") {
            earnings += company.plan_price ? parseFloat(company.plan_price) : 0; // Use custom price for BUSINESS
          }
        });

        setCompanies(data.data);
        setTotalEarnings(earnings || 0); // Ensure totalEarnings is a number
      } catch (err) {
        setError(err.message);
        setTotalEarnings(0); // Set fallback value in case of an error
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesData();
  }, []);

  if (loading) return <p>Loading earnings data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Earnings Overview
      </h1>

      {/* Display Total Earnings */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Total Earnings</h2>
        <p className="text-2xl font-bold text-green-600">
          CHF {totalEarnings.toFixed(2)}
        </p>
      </div>

      {/* Display raw companies data */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Raw Companies Data</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(companies, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Earnings;
