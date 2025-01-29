import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

/**
 * PUT /api/tasks/:id
 * Allows authorized users to update task details (title, description, priority, status).
 */

export async function PUT(request, context) {
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

    // ✅ Ensure `params.id` is retrieved properly
    const id = context.params?.id;

    if (!id || !ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

    // ✅ Read request body only ONCE
    const body = await request.json();
    const { title, description, priority, status } = body;

    // ✅ Fetch Task
    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(id) });

    if (!task) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    // ✅ Authorization Check
    if (
      role === "markenbotschafter" &&
      task.assignedTo.toString() !== userId.toString()
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    if (
      role === "manager" &&
      ![task.assignedTo.toString(), userId.toString()].includes(
        userId.toString()
      )
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // ✅ Prepare fields for update
    const updateFields = { updatedAt: new Date() };
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (priority) updateFields.priority = priority;
    if (status) updateFields.status = status;

    // ✅ Execute Update
    const result = await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No changes made",
        }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Task updated successfully",
        updatedFields: updateFields,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/:id
 * Allows Admins to delete a task.
 */
export async function DELETE(request, { params }) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("🚨 Unauthorized request to delete task");
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
      console.log("🚨 User not found:", session.user.email);
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const { role } = user;
    const taskId = params?.id;

    console.log("🔍 Received DELETE request for Task ID:", taskId);

    // Validate Task ID
    if (!taskId || !ObjectId.isValid(taskId)) {
      console.log("❌ Invalid Task ID:", taskId);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

    // Only Admins can delete tasks
    if (role !== "admin") {
      console.log(
        "⛔ Forbidden: User does not have permission to delete tasks"
      );
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // Delete Task
    const result = await db
      .collection("tasks")
      .deleteOne({ _id: new ObjectId(taskId) });

    if (result.deletedCount === 0) {
      console.log("🚨 Task not found in database:", taskId);
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    console.log("✅ Task successfully deleted:", taskId);
    return new Response(
      JSON.stringify({ success: true, message: "Task deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
