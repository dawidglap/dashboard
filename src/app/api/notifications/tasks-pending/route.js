import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET() {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  try {
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    const { _id: userId, role } = user;

    let query;

    if (role === "admin") {
      query = {
        status: "pending",
        locked: { $in: [false, null] }, // ✅ solo se non è ancora locked
      };
    } else if (role === "manager") {
      const team = await db.collection("users").find({ managerId: userId }).toArray();
      const teamIds = team.map((u) => u._id);

      query = {
        status: "pending",
        $expr: {
          $in: ["$assignedTo._id", [userId, ...teamIds]],
        },
      };
    } else if (role === "markenbotschafter") {
      query = {
        status: "pending",
        $expr: {
          $eq: ["$assignedTo._id", new ObjectId(userId)],
        },
      };
    } else {
      query = { status: "pending", $expr: { $eq: [false, true] } }; // no results fallback
    }

    const count = await db.collection("tasks").countDocuments(query);

    return new Response(JSON.stringify({ success: true, count }), { status: 200 });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der ausstehenden Aufgaben:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
