import { useState, useEffect } from "react";

const useFetchProvisionen = (timeframe = "monthly") => {
  const [chartData, setChartData] = useState([]);
  const [bruttoProvisionen, setBruttoProvisionen] = useState(0);
  const [commissionsList, setCommissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Funzione per generare label standard per ogni timeframe
  const generateTimeLabels = () => {
    const labels = [];
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    if (timeframe === "yearly") {
      for (let year = currentYear - 2; year <= currentYear; year++) {
        labels.push(year.toString());
      }
    } else if (timeframe === "monthly") {
      for (let month = 0; month < 12; month++) {
        const date = new Date(currentYear, month);
        labels.push(date.toLocaleString("de-DE", { month: "short" }));
      }
    } else if (timeframe === "weekly") {
      for (let week = 1; week <= 52; week++) {
        labels.push(`${currentYear}-W${week}`);
      }
    } else if (timeframe === "daily") {
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        labels.push(date.toISOString().split("T")[0]);
      }
    }

    return labels;
  };

  useEffect(() => {
    const fetchProvisionenData = async () => {
      try {
        const res = await fetch("/api/companies/all");
        if (!res.ok) throw new Error("Fehler beim Laden der Firmen");
        const data = await res.json();
        const companies = data.data || [];

        let total = 0;
        let dailyData = {};
        let details = [];

        companies.forEach((company) => {
          if (!company.created_at) return;
          const date = new Date(company.created_at);
          if (isNaN(date)) return;

          const formattedDate = date.toISOString().split("T")[0];
          const manager = company.manager_id;
          const ambassador = company.markenbotschafter_id;

          const managerCommission = manager ? 1000 : 0;
          const ambassadorCommission = ambassador ? 1000 : 0;
          const commissionTotal = managerCommission + ambassadorCommission;

          total += commissionTotal;
          dailyData[formattedDate] =
            (dailyData[formattedDate] || 0) + commissionTotal;

          if (managerCommission > 0) {
            details.push({
              userName: "Manager",
              role: "manager",
              companyName: company.company_name,
              amount: managerCommission,
              paymentDate: new Date(
                date.getFullYear(),
                date.getMonth() + 2,
                25
              ),
              created_at: company.created_at,
            });
          }

          if (ambassadorCommission > 0) {
            details.push({
              userName: "Markenbotschafter",
              role: "markenbotschafter",
              companyName: company.company_name,
              amount: ambassadorCommission,
              paymentDate: new Date(
                date.getFullYear(),
                date.getMonth() + 2,
                25
              ),
              created_at: company.created_at,
            });
          }
        });

        // ✅ Aggrega per il timeframe selezionato
        const aggregated = aggregateByTimeframe(dailyData, timeframe);
        const labels = generateTimeLabels();

        const filled = labels.map((label) => ({
          period: label,
          earnings: aggregated[label] || 0,
        }));

        setChartData(filled);
        setBruttoProvisionen(
          filled.reduce((sum, item) => sum + (item.earnings || 0), 0)
        );
        setCommissionsList(details);
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvisionenData();
  }, [timeframe]);

  // ✅ Aggregazione intelligente in base al timeframe
  const aggregateByTimeframe = (data, timeframe) => {
    let result = {};

    for (const dateStr in data) {
      const date = new Date(dateStr);
      if (isNaN(date)) continue;

      let key;
      if (timeframe === "daily") {
        key = dateStr;
      } else if (timeframe === "weekly") {
        const week = Math.ceil(date.getDate() / 7);
        key = `${date.getFullYear()}-W${week}`;
      } else if (timeframe === "monthly") {
        key = date.toLocaleString("de-DE", { month: "short" });
      } else {
        key = date.getFullYear().toString();
      }

      result[key] = (result[key] || 0) + data[dateStr];
    }

    return result;
  };

  return {
    chartData,
    bruttoProvisionen,
    commissions: commissionsList,
    loading,
    error,
  };
};

export default useFetchProvisionen;
