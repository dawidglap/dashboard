import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * GET /api/tasks
 * Fetches tasks from the database with role-based filtering.
 * Admins: See all tasks.
 * Managers: See their tasks and their team's tasks (Markenbotschafters they manage).
 * Markenbotschafters: See only their tasks.
 */
export async function GET(request) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const { role, _id: userId } = user;
    let tasks = [];

    if (role === "admin") {
      // Admin: Fetch all tasks
      tasks = await db.collection("tasks").find().toArray();
    } else if (role === "manager") {
      // Manager: Fetch tasks assigned to them and their Markenbotschafters
      const markenbotschafters = await db
        .collection("users")
        .find({ managerId: userId }) // Assuming `managerId` links Markenbotschafters to their Manager
        .toArray();

      const idsToInclude = [userId, ...markenbotschafters.map((u) => u._id)];
      tasks = await db
        .collection("tasks")
        .find({ assignedTo: { $in: idsToInclude } })
        .toArray();
    } else if (role === "markenbotschafter") {
      // Markenbotschafter: Fetch only tasks assigned to them
      tasks = await db
        .collection("tasks")
        .find({ assignedTo: userId })
        .toArray();
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Access Denied" }),
        { status: 403 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: tasks }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
