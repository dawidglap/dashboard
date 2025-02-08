// Fetch a team member's details and their assigned companies
const fetchTeamMemberData = async (userId) => {
  try {
    const userRes = await fetch(`/api/users/${userId}`);
    if (!userRes.ok) throw new Error("Failed to fetch user details");
    const userData = await userRes.json();

    const companiesRes = await fetch(`/api/companies?userId=${userId}`);
    if (!companiesRes.ok) throw new Error("Failed to fetch assigned companies");
    const companiesData = await companiesRes.json();

    return { user: userData.user, companies: companiesData.companies };
  } catch (error) {
    console.error("Error fetching team member data:", error);
    return { user: null, companies: [] };
  }
};
