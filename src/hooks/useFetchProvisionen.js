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

        // ✅ Store commissions **daily**
        companiesData.data.forEach((company) => {
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

          // ✅ Store commission details with `created_at`
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
              created_at: company.created_at, // ✅ Add Startdatum
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
              created_at: company.created_at, // ✅ Add Startdatum
            });
          }
        });

        // ✅ Aggregate based on the selected timeframe
        let aggregatedData = aggregateTimeframe(dailyCommissions, timeframe);

        // ✅ Convert into chart format
        const formattedChartData = Object.keys(aggregatedData).map((key) => ({
          period: key,
          earnings: aggregatedData[key],
        }));

        // ✅ Sorting dates correctly
        formattedChartData.sort(
          (a, b) => new Date(a.period) - new Date(b.period)
        );

        setChartData(formattedChartData);

        // ✅ Fix bruttoProvisionen calculation based on timeframe
        if (timeframe === "daily") {
          const todayStr = new Date().toISOString().split("T")[0];
          setBruttoProvisionen(aggregatedData[todayStr] || 0);
        } else if (timeframe === "weekly") {
          const totalWeekly = Object.values(aggregatedData).reduce(
            (sum, val) => sum + val,
            0
          );
          setBruttoProvisionen(totalWeekly / 7);
        } else {
          setBruttoProvisionen(totalCommissions);
        }

        setCommissionsList(commissionsDetails);
      } catch (err) {
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

// import { useState, useEffect } from "react";

// const useFetchProvisionen = (timeframe = "monthly") => {
//   const [chartData, setChartData] = useState([]);
//   const [bruttoProvisionen, setBruttoProvisionen] = useState(0);
//   const [commissionsList, setCommissionsList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const generateFakeData = () => {
//       let commissionsByDate = {};
//       let commissionsDetails = [];
//       let totalCommissions = 0;

//       let currentDate = new Date();

//       // Simulating 365 days of commission data
//       const daysToGenerate = 365;

//       for (let i = 0; i < daysToGenerate; i++) {
//         let date = new Date();
//         date.setDate(date.getDate() - i);

//         let formattedDaily = date.toISOString().split("T")[0]; // YYYY-MM-DD
//         let formattedWeekly = `${date.getFullYear()}-W${Math.ceil(
//           date.getDate() / 7
//         )}`;
//         let formattedMonthly = `${date.toLocaleString("default", {
//           month: "short",
//         })} '${date.getFullYear().toString().slice(-2)}`;
//         let formattedYearly = date.getFullYear().toString();

//         let fakeCompanies = Array.from({ length: 2 }, (_, index) => ({
//           company_name: `Company ${i + index}`,
//           manager: {
//             name: `Manager ${i + index}`,
//             role: i % 3 === 0 ? "admin" : "manager",
//           },
//           markenbotschafter: {
//             name: `Markenbotschafter ${i + index}`,
//             role: i % 4 === 0 ? "admin" : "markenbotschafter",
//           },
//         }));

//         fakeCompanies.forEach((company) => {
//           let managerCommission = company.manager.role === "admin" ? 0 : 1000;
//           let markenbotschafterCommission =
//             company.markenbotschafter.role === "admin" ? 0 : 1000;

//           let companyCommission =
//             managerCommission + markenbotschafterCommission;
//           totalCommissions += companyCommission;

//           // ✅ Add only to the correct timeframe
//           if (!commissionsByDate[formattedDaily])
//             commissionsByDate[formattedDaily] = 0;
//           commissionsByDate[formattedDaily] += companyCommission;

//           if (!commissionsByDate[formattedWeekly])
//             commissionsByDate[formattedWeekly] = 0;
//           commissionsByDate[formattedWeekly] += companyCommission;

//           if (!commissionsByDate[formattedMonthly])
//             commissionsByDate[formattedMonthly] = 0;
//           commissionsByDate[formattedMonthly] += companyCommission;

//           if (!commissionsByDate[formattedYearly])
//             commissionsByDate[formattedYearly] = 0;
//           commissionsByDate[formattedYearly] += companyCommission;

//           // Store commission details
//           if (managerCommission > 0) {
//             commissionsDetails.push({
//               userName: company.manager.name,
//               companyName: company.company_name,
//               amount: managerCommission,
//               paymentDate: new Date(
//                 date.getFullYear(),
//                 date.getMonth() + 2,
//                 25
//               ),
//             });
//           }

//           if (markenbotschafterCommission > 0) {
//             commissionsDetails.push({
//               userName: company.markenbotschafter.name,
//               companyName: company.company_name,
//               amount: markenbotschafterCommission,
//               paymentDate: new Date(
//                 date.getFullYear(),
//                 date.getMonth() + 2,
//                 25
//               ),
//             });
//           }
//         });
//       }

//       // ✅ Select the correct timeframe for chart data
//       let selectedTimeframeData = {};
//       if (timeframe === "daily") selectedTimeframeData = commissionsByDate;
//       if (timeframe === "weekly")
//         selectedTimeframeData = aggregateTimeframe(commissionsByDate, "weekly");
//       if (timeframe === "monthly")
//         selectedTimeframeData = aggregateTimeframe(
//           commissionsByDate,
//           "monthly"
//         );
//       if (timeframe === "yearly")
//         selectedTimeframeData = aggregateTimeframe(commissionsByDate, "yearly");

//       const formattedChartData = Object.keys(selectedTimeframeData).map(
//         (key) => ({
//           period: key,
//           earnings: selectedTimeframeData[key],
//         })
//       );

//       formattedChartData.sort(
//         (a, b) => new Date(a.period) - new Date(b.period)
//       );

//       setChartData(formattedChartData);
//       setBruttoProvisionen(
//         Object.values(selectedTimeframeData).reduce((sum, val) => sum + val, 0)
//       );
//       setCommissionsList(commissionsDetails);
//       setLoading(false);
//     };

//     generateFakeData();
//   }, [timeframe]);

//   // ✅ Aggregation function for weekly, monthly, and yearly
//   const aggregateTimeframe = (data, type) => {
//     let aggregatedData = {};

//     Object.keys(data).forEach((key) => {
//       let date = new Date(key);
//       let formatted;

//       if (type === "weekly") {
//         formatted = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
//       } else if (type === "monthly") {
//         formatted = `${date.toLocaleString("default", {
//           month: "short",
//         })} '${date.getFullYear().toString().slice(-2)}`;
//       } else {
//         formatted = date.getFullYear().toString();
//       }

//       if (!aggregatedData[formatted]) aggregatedData[formatted] = 0;
//       aggregatedData[formatted] += data[key];
//     });

//     return aggregatedData;
//   };

//   return {
//     chartData,
//     bruttoProvisionen,
//     commissions: commissionsList,
//     loading,
//     error,
//   };
// };

// export default useFetchProvisionen;
