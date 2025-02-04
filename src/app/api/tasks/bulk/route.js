import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

/**
 * BULK DELETE: Delete multiple tasks
 */
export async function DELETE(request) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const { taskIds } = await request.json();

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task IDs" }),
        { status: 400 }
      );
    }

    const objectIds = taskIds
      .filter((id) => ObjectId.isValid(id))
      .map((id) => new ObjectId(id));

    if (objectIds.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No valid task IDs" }),
        { status: 400 }
      );
    }

    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user || user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    console.log("🔹 Deleting Task IDs:", objectIds);

    const result = await db
      .collection("tasks")
      .deleteMany({ _id: { $in: objectIds } });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No tasks deleted" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.deletedCount} tasks deleted successfully`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Bulk Delete Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

/**
 * BULK UPDATE: Update multiple tasks
 */
export async function PUT(request) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const { taskIds, updateFields } = await request.json();

    if (
      !taskIds ||
      !Array.isArray(taskIds) ||
      taskIds.length === 0 ||
      !updateFields
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid request data" }),
        { status: 400 }
      );
    }

    const objectIds = taskIds.map((id) => new ObjectId(id));

    // Authorization Check
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // Only Admins & Managers can bulk update tasks
    if (user.role !== "admin" && user.role !== "manager") {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // Add `updatedAt` timestamp
    updateFields.updatedAt = new Date();

    // Bulk update tasks
    const result = await db
      .collection("tasks")
      .updateMany({ _id: { $in: objectIds } }, { $set: updateFields });

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.modifiedCount} tasks updated successfully`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Bulk Update Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
