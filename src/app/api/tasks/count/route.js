import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/tasks/count
 * Fetches the total count of unlocked tasks
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { db } = await connectToDatabase();
    const session = await getServerSession(authOptions);

    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // ✅ Get only unlocked tasks
    const totalTasks = await db.collection("tasks").countDocuments({
      locked: { $in: [false, null] }, // ✅ Count only unlocked tasks
    });

    return res.status(200).json({ success: true, totalTasks });
  } catch (error) {
    console.error("❌ Error fetching task count:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
