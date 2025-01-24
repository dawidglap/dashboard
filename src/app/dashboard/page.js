import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Dashboard() {
  // Retrieve the session on the server
  const session = await getServerSession(authOptions);

  // Redirect if no session or not an admin
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  // Admin content
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.email}!</p>
    </div>
  );
}
