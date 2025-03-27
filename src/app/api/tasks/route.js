import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

/**
 * GET /api/tasks
 * Fetches tasks from the database with role-based filtering.
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
    const { searchParams } = new URL(request.url);

    // ✅ Extract Filters from Query Params
    const limit = parseInt(searchParams.get("limit")) || 16; // Load 16 tasks at a time
    const offset = parseInt(searchParams.get("offset")) || 0; // Start from the last fetched task

    const statusFilter = searchParams.get("status") || null;
    const priorityFilter = searchParams.get("priority") || null;
    const assignedToFilter = searchParams.get("assignedTo") || null;
    const dueDateFilter = searchParams.get("dueDate") || null;
    const searchQuery = searchParams.get("search") || null;

    // ✅ Convert "true"/"false" string values to actual boolean values
    const lockedFilterParam = searchParams.get("locked");
    const lockedFilter =
      lockedFilterParam === "true"
        ? true
        : lockedFilterParam === "false"
        ? false
        : null;

    let query = {};

    // ✅ Apply Role-Based Filtering
    if (role === "manager") {
      const markenbotschafters = await db
        .collection("users")
        .find({ managerId: userId })
        .toArray();
      const idsToInclude = [userId, ...markenbotschafters.map((u) => u._id)];
      query["assignedTo._id"] = { $in: idsToInclude };
    } else if (role === "markenbotschafter") {
      query["assignedTo._id"] = userId;
    }

    // ✅ Apply Filters
    if (statusFilter) query.status = statusFilter;
    if (priorityFilter) query.priority = priorityFilter;
    if (assignedToFilter)
      query["assignedTo._id"] = new ObjectId(assignedToFilter);
    if (dueDateFilter) query.dueDate = { $lte: new Date(dueDateFilter) };
    if (searchQuery) query.title = { $regex: searchQuery, $options: "i" };

    // ✅ Apply Locked Filter Properly - Enforcing Unlocked Tasks Only
    if (lockedFilter !== null) {
      query.locked = lockedFilter; // Allow explicit filtering if lockedFilter is provided
    } else {
      query.locked = { $in: [false, null] }; // Default: Show only unlocked tasks
    }

    console.log("📡 Applying Query to MongoDB:", query);

    // ✅ Fetch Total Count After Filtering (for pagination)
    const totalCount = await db.collection("tasks").countDocuments(query);

    const tasks = await db
      .collection("tasks")
      .aggregate([
        { $match: query },
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
              $cond: {
                if: { $gt: [{ $size: "$assignedUser" }, 0] },
                then: { $arrayElemAt: ["$assignedUser", 0] }, // ✅ Pick the first user
                else: "$assignedTo",
              },
            },
          },
        },

        { $unset: "assignedUser" },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            priority: 1,
            status: 1,
            locked: 1, // ✅ Include locked status in response
            dueDate: 1,
            createdAt: 1,
            updatedAt: 1,
            "assignedTo._id": 1,
            "assignedTo.name": 1,
            "assignedTo.role": 1,
          },
        },
      ])
      .sort({ createdAt: -1 }) // ← ORDINE NUOVO: per data di creazione, dal più recente al più vecchio
      .skip(offset)
      .limit(limit)
      .toArray();

    return new Response(
      JSON.stringify({
        success: true,
        data: tasks,
        totalCount,
        hasMore: offset + tasks.length < totalCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks
 * Create a new task.
 */
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
    const { title, description, priority, status, assignedTo, dueDate } =
      await req.json();

    console.log("📥 Received Task Data:", {
      title,
      description,
      priority,
      status,
      assignedTo,
      dueDate,
    });

    // ✅ Fetch the user from the database
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    // ✅ Ensure only an admin can create tasks
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Only admins can create tasks",
        }),
        { status: 403 }
      );
    }

    // ✅ Validate required fields
    if (!title || !status || !assignedTo || !assignedTo._id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Title, status, and assigned user are required",
        }),
        { status: 400 }
      );
    }

    // ✅ Assign Admin as `createdBy` (hardcoded)
    const adminUser = {
      _id: user._id,
      name: user.name,
      role: user.role,
    };

    // ✅ Ensure `assignedTo` is a single user object
    const assignedUser = {
      _id: new ObjectId(assignedTo._id),
      name: assignedTo.name,
      role: assignedTo.role,
    };

    // ✅ Construct the new task object
    const newTask = {
      title,
      description: description?.trim() || null, // Allow empty description
      priority: priority || "medium", // Default to medium if not provided
      status,
      assignedTo: assignedUser, // ✅ Ensure it's always an object
      createdBy: adminUser, // ✅ Admin is the creator
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: dueDate ? new Date(dueDate) : null, // Optional dueDate
      locked: false, // ✅ Default locked to false
    };

    // ✅ Insert into the database
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
    console.error("❌ ERROR CREATING TASK:", error);
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
