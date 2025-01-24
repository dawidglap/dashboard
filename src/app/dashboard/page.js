import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import SidebarMenu from "@/components/SidebarMenu";
import DashboardContent from "@/components/DashboardContent";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("dashboard");
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  // Pass user data to the client component
  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarMenu />

      {/* Main Content */}
      <DashboardContent user={user} />
    </div>
  );
}
