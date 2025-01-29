import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

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

export async function POST(req) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const { title, description, priority, status, assignedTo } =
      await req.json();

    // Validate required fields
    if (!title || !description || !priority || !status || !assignedTo) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    // Ensure assignedTo is a valid ObjectId
    if (!ObjectId.isValid(assignedTo)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid assignedTo ID" }),
        { status: 400 }
      );
    }

    // Get the user who is creating the task
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Insert the new task
    const newTask = {
      title,
      description,
      priority,
      status,
      assignedTo: new ObjectId(assignedTo), // Convert assignedTo to ObjectId
      createdBy: new ObjectId(user._id), // Store creator's ObjectId
      createdAt: new Date(), // Auto-set creation date
      updatedAt: new Date(), // Auto-set last updated date
    };

    const result = await db.collection("tasks").insertOne(newTask);

    if (!result.acknowledged) {
      return new Response(
        JSON.stringify({ success: false, message: "Database insert failed" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Task created successfully",
        task: newTask,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating task:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
