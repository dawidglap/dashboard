import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

/**
 * PUT /api/tasks/:id
 * Allows authorized users to update task details (title, description, priority, status).
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
    const { title, description, priority, status } = await request.json();

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

    // Allowed Statuses
    const allowedStatuses = [
      "pending",
      "in_progress",
      "done",
      "cannot_complete",
    ];
    if (status && !allowedStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid status" }),
        { status: 400 }
      );
    }

    // Prepare fields to update
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (priority) updateFields.priority = priority;
    if (status) updateFields.status = status;
    updateFields.updatedAt = new Date();

    const updatedTask = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" } // ✅ Ensures the updated task is returned
    );

    if (!updatedTask.value) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Task updated",
          task: updateFields,
        }), // ✅ Ensure a valid response
        { status: 200 }
      );
    }

    // ✅ Send the full updated task back to the frontend
    return new Response(JSON.stringify(updatedTask.value), { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
