import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

const useBreakdownByPlan = (timeframe = "monthly") => {
  const [breakdown, setBreakdown] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPlanPrice = (plan, planPrice) => {
    if (plan === "BASIC") return 299 * 12 * 1.081;
    if (plan === "PRO") return 399 * 12 * 1.081;
    if (plan === "BUSINESS" && planPrice) return parseFloat(planPrice);
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session || !session.user) throw new Error("Kein Benutzer");

        const res = await fetch(
          `/api/companies/all?role=${session.user.role}&email=${session.user.email}`
        );
        if (!res.ok) throw new Error("Fehler beim Abrufen der Firmen");
        const data = await res.json();
        const companies = data.data || [];

        const planTotals = {};

        companies.forEach((company) => {
          const createdAt = new Date(company.created_at);
          if (isNaN(createdAt)) return;

          const now = new Date();
          const isRelevant =
            timeframe === "daily"
              ? createdAt.toDateString() === now.toDateString()
              : timeframe === "weekly"
              ? createdAt >=
                new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
              : timeframe === "monthly"
              ? createdAt.getFullYear() === now.getFullYear() &&
                createdAt.getMonth() === now.getMonth()
              : createdAt.getFullYear() === now.getFullYear();

          if (isRelevant) {
            const plan = company.plan || "BUSINESS";
            const price = getPlanPrice(plan, company.plan_price);
            planTotals[plan] = (planTotals[plan] || 0) + price;
          }
        });

        setBreakdown(planTotals);
      } catch (err) {
        console.error("Hook Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  return { breakdown, loading, error };
};

export default useBreakdownByPlan;
