"use client";

import { useState, useEffect } from "react";

const useCompanyForm = (initialData, company = null) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (company) {
      setFormData({
        company_name: company.company_name || "",
        company_address: company.company_address || "", // ✅ Ensure address is filled
        plan: company.plan || "BASIC",
        company_owner: company.company_owner || "",
        plan_price: company.plan_price || "",
        expiration_date: company.expiration_date?.slice(0, 10) || "",
        manager_id: company.manager_id || "", // ✅ Ensure manager is prefilled
        markenbotschafter_id: company.markenbotschafter_id || "", // ✅ Ensure markenbotschafter is prefilled
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return { formData, handleChange, setFormData };
};

export default useCompanyForm;
