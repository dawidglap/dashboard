import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

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
    // ✅ Read request body
    const { tasks } = await req.json();

    console.log("📥 Full Bulk Task Data Received:", tasks);

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "At least one task is required",
        }),
        { status: 400 }
      );
    }

    // ✅ Get the admin user creating the tasks
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Transform tasks before inserting into DB
    const tasksToInsert = tasks.map((task) => ({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      assignedTo: {
        _id: new ObjectId(task.assignedTo._id),
        name: task.assignedTo.name,
        role: task.assignedTo.role,
      },
      createdBy: { _id: user._id, name: user.name },
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      locked: false,
    }));

    // ✅ Insert tasks into MongoDB
    const result = await db.collection("tasks").insertMany(tasksToInsert);

    if (!result.acknowledged) {
      return new Response(
        JSON.stringify({ success: false, message: "Database insert failed" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tasks created successfully",
        tasks: tasksToInsert,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERROR CREATING BULK TASKS:", error);
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
