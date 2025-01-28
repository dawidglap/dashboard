import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

/**
 * PUT /api/tasks/:id
 * Allows users to update task status with role-based permissions.
 */
export async function PUT(request, { params }) {
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
    const { id } = params;
    const { status } = await request.json();

    // Validate Task ID
    if (!ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

    // Fetch Task
    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(id) });

    if (!task) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    // Authorization Logic
    if (role === "markenbotschafter" && !task.assignedTo.equals(userId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    if (role === "manager" && ![task.assignedTo, userId].includes(userId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // Allowed Status Changes
    const allowedStatuses = [
      "pending",
      "in_progress",
      "done",
      "cannot_complete",
    ];
    if (!allowedStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid status" }),
        { status: 400 }
      );
    }

    // Update Task
    const result = await db
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No changes made" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Task updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
