import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const { params } = context;
    const taskId = params.id;

    if (!taskId || !ObjectId.isValid(taskId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

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

    // ✅ Role-Based Filtering
    let query = { _id: new ObjectId(taskId) };

    if (role === "manager") {
      const managedUsers = await db
        .collection("users")
        .find({ managerId: userId })
        .toArray();
      const managedUserIds = managedUsers.map((u) => u._id);
      query["assignedTo"] = { $in: [...managedUserIds, userId] };
    } else if (role === "markenbotschafter") {
      query["assignedTo"] = userId;
    }

    const task = await db
      .collection("tasks")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "assignedTo",
            foreignField: "_id",
            as: "assignedUser",
          },
        },
        {
          $set: {
            assignedTo: {
              $cond: {
                if: { $gt: [{ $size: "$assignedUser" }, 0] },
                then: { $arrayElemAt: ["$assignedUser", 0] },
                else: "$assignedTo", // ✅ Keep previous assignedTo if lookup fails
              },
            },
          },
        },
        { $unset: "assignedUser" },
      ])
      .toArray();

    if (!task || task.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, task: task[0] }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching task:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// ✅ Update Task
// ✅ Update Task
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
    const { params } = context;
    const taskId = params.id;

    if (!taskId || !ObjectId.isValid(taskId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

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

    const body = await request.json();
    const {
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
      locked,
    } = body;

    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    // ✅ Authorization Check
    if (
      role === "markenbotschafter" &&
      task.assignedTo?._id.toString() !== userId.toString()
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    if (
      role === "manager" &&
      ![task.assignedTo?._id.toString(), userId.toString()].includes(
        userId.toString()
      )
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // ✅ Validate assignedTo (must be a single user)
    let assignedUserData = task.assignedTo; // Keep the existing user if not updating
    if (assignedTo) {
      const assignedUser = await db
        .collection("users")
        .findOne({ _id: new ObjectId(assignedTo) });

      if (!assignedUser) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Assigned user not found",
          }),
          { status: 404 }
        );
      }

      assignedUserData = {
        _id: assignedUser._id,
        name: assignedUser.name,
        role: assignedUser.role,
      };
    }

    // ✅ Prepare fields for update
    const updateFields = {
      updatedAt: new Date(),
      assignedTo: assignedUserData, // ✅ Ensure assignedTo is always a single object
    };

    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (priority) updateFields.priority = priority;
    if (status) updateFields.status = status;
    if (dueDate) updateFields.dueDate = new Date(dueDate);

    // ✅ Only update `locked` if explicitly provided
    if (typeof locked === "boolean") {
      updateFields.locked = locked;
    }

    const result = await db
      .collection("tasks")
      .updateOne({ _id: new ObjectId(taskId) }, { $set: updateFields });

    if (result.modifiedCount === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No changes made" }),
        { status: 200 }
      );
    }

    // ✅ Fetch Updated Task
    const updatedTask = await db
      .collection("tasks")
      .aggregate([
        { $match: { _id: new ObjectId(taskId) } },
        {
          $lookup: {
            from: "users",
            localField: "assignedTo._id",
            foreignField: "_id",
            as: "assignedUser",
          },
        },
        {
          $set: {
            assignedTo: {
              _id: {
                $ifNull: [{ $arrayElemAt: ["$assignedUser._id", 0] }, null],
              },
              name: {
                $ifNull: [
                  { $arrayElemAt: ["$assignedUser.name", 0] },
                  "Unbekannt",
                ],
              },
              role: {
                $ifNull: [
                  { $arrayElemAt: ["$assignedUser.role", 0] },
                  "Unbekannt",
                ],
              },
            },
          },
        },
        { $unset: "assignedUser" }, // ✅ Remove extra lookup data
      ])
      .toArray();

    if (!updatedTask.length) {
      console.error("❌ Fehler: Task not found with ID", taskId);
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    // ✅ Debugging: Log full updatedTask before sending response
    console.log(
      "✅ Updated Task (API Response):",
      JSON.stringify(updatedTask[0], null, 2)
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Task updated successfully",
        task: updatedTask[0],
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

// ✅ Delete Task
export async function DELETE(request, { params }) {
  const { db } = await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401 }
    );
  }

  try {
    const taskId = params?.id;

    if (!taskId || !ObjectId.isValid(taskId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid task ID" }),
        { status: 400 }
      );
    }

    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Only Admin Can Delete Tasks
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ success: false, message: "Forbidden" }),
        { status: 403 }
      );
    }

    // ✅ Check if task exists
    const task = await db
      .collection("tasks")
      .findOne({ _id: new ObjectId(taskId) });

    if (!task) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not found" }),
        { status: 404 }
      );
    }

    // ✅ Delete Task
    const result = await db
      .collection("tasks")
      .deleteOne({ _id: new ObjectId(taskId) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Task not deleted" }),
        { status: 500 }
      );
    }

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
