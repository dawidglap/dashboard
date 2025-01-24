import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Redirect or deny access if not an admin
  if (!session || session.user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
        <p>Sie haben keine Berechtigung, diese Seite zu betreten.</p>
      </div>
    );
  }

  // Fetch user data
  const client = await clientPromise;
  const db = client.db("dashboard");
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  // Return only the page content, without the Sidebar
  return <DashboardContent user={user} />;
}
