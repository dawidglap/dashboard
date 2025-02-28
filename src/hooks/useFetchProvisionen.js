import { useState, useEffect } from "react";

const useFetchProvisionen = (timeframe = "monthly") => {
  const [chartData, setChartData] = useState([]);
  const [bruttoProvisionen, setBruttoProvisionen] = useState(0);
  const [commissionsList, setCommissionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvisionenData = async () => {
      try {
        // ✅ Fetch all companies
        const companiesResponse = await fetch("/api/companies/all");
        if (!companiesResponse.ok)
          throw new Error("Error fetching companies data.");
        const companiesData = await companiesResponse.json();
        console.log("✅ Debug: Companies Data ->", companiesData);

        // ✅ Fetch users
        const usersResponse = await fetch("/api/users");
        if (!usersResponse.ok) throw new Error("Error fetching users data.");
        const usersData = await usersResponse.json();

        if (!usersData?.users || !Array.isArray(usersData.users)) {
          throw new Error("Users data is invalid.");
        }

        // ✅ Map user IDs to roles
        const usersMap = {};
        usersData.users.forEach((user) => {
          usersMap[user._id] = { name: user.name, role: user.role };
        });

        let totalCommissions = 0;
        let dailyCommissions = {};
        let commissionsDetails = [];

        // ✅ Process companies
        companiesData.data.forEach((company) => {
          if (!company.created_at) return; // Ensure valid dates
          const date = new Date(company.created_at);
          let formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD

          const manager = usersMap[company.manager_id] || {
            name: "Unbekannt",
            role: "unknown",
          };
          const markenbotschafter = usersMap[company.markenbotschafter_id] || {
            name: "Unbekannt",
            role: "unknown",
          };

          let managerCommission = manager.role === "admin" ? 0 : 1000;
          let markenbotschafterCommission =
            markenbotschafter.role === "admin" ? 0 : 1000;
          let companyCommission =
            managerCommission + markenbotschafterCommission;

          totalCommissions += companyCommission;
          dailyCommissions[formattedDate] =
            (dailyCommissions[formattedDate] || 0) + companyCommission;

          if (managerCommission > 0) {
            commissionsDetails.push({
              userName: manager.name,
              role: "Manager",
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
          if (markenbotschafterCommission > 0) {
            commissionsDetails.push({
              userName: markenbotschafter.name,
              role: "Markenbotschafter",
              companyName: company.company_name,
              amount: markenbotschafterCommission,
              paymentDate: new Date(
                date.getFullYear(),
                date.getMonth() + 2,
                25
              ),
              created_at: company.created_at,
            });
          }
        });

        console.log("✅ Debug: dailyCommissions ->", dailyCommissions);

        // ✅ Aggregate data based on timeframe
        let aggregatedData = aggregateTimeframe(dailyCommissions, timeframe);
        console.log("✅ Debug: aggregatedData ->", aggregatedData);

        // ✅ Convert into chart format
        const formattedChartData = Object.keys(aggregatedData).map((key) => ({
          period: key,
          earnings: aggregatedData[key],
        }));

        formattedChartData.sort(
          (a, b) => new Date(a.period) - new Date(b.period)
        );

        console.log("✅ Debug: formattedChartData ->", formattedChartData);

        setChartData(formattedChartData);

        // ✅ Fix bruttoProvisionen calculation based on timeframe
        const totalEarnings = formattedChartData.reduce(
          (sum, entry) => sum + (entry.earnings || 0),
          0
        );

        console.log("✅ Debug: Total Earnings ->", totalEarnings);

        setBruttoProvisionen(totalEarnings);
        setCommissionsList(commissionsDetails);
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProvisionenData();
  }, [timeframe]);

  // ✅ Function to aggregate daily data into weekly, monthly, or yearly
  const aggregateTimeframe = (dailyData, timeframe) => {
    let aggregatedData = {};

    Object.keys(dailyData).forEach((dateStr) => {
      let date = new Date(dateStr);
      let formatted;

      if (timeframe === "daily") {
        formatted = dateStr;
      } else if (timeframe === "weekly") {
        let year = date.getFullYear();
        let week = Math.ceil(date.getDate() / 7);
        formatted = `${year}-W${week}`;
      } else if (timeframe === "monthly") {
        formatted = `${date.toLocaleString("default", {
          month: "short",
        })} '${date.getFullYear().toString().slice(-2)}`;
      } else {
        formatted = date.getFullYear().toString(); // Yearly
      }

      aggregatedData[formatted] =
        (aggregatedData[formatted] || 0) + dailyData[dateStr];
    });

    console.log(`📌 Aggregated Data for ${timeframe}:`, aggregatedData);
    return aggregatedData;
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
