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
    const { searchParams } = new URL(request.url);

    // ✅ Extract Filters from Query Params
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 15;
    const skip = (page - 1) * limit;

    const statusFilter = searchParams.get("status") || null;
    const priorityFilter = searchParams.get("priority") || null;
    const assignedToFilter = searchParams.get("assignedTo") || null;
    const dueDateFilter = searchParams.get("dueDate") || null;
    const searchQuery = searchParams.get("search") || null;

    let query = {};

    // ✅ Apply Role-Based Filtering
    if (role === "manager") {
      const markenbotschafters = await db
        .collection("users")
        .find({ managerId: userId })
        .toArray();
      const idsToInclude = [userId, ...markenbotschafters.map((u) => u._id)];
      query = { "assignedTo._id": { $in: idsToInclude } };
    } else if (role === "markenbotschafter") {
      query = { "assignedTo._id": userId };
    }

    // ✅ Apply Filters
    if (statusFilter) query.status = statusFilter;
    if (priorityFilter) query.priority = priorityFilter;

    // if (assignedToFilter) {
    //   console.log("🔧 Filtering by assignedTo:", assignedToFilter);
    //   query["assignedTo"] = new ObjectId(assignedToFilter);
    // }

    if (assignedToFilter) {
      console.log("🔧 Filtering by assignedTo:", assignedToFilter);
      query["assignedTo._id"] = new ObjectId(assignedToFilter);
    }

    if (dueDateFilter) query.dueDate = { $lte: new Date(dueDateFilter) }; // Tasks due *before* this date
    if (searchQuery) query.title = { $regex: searchQuery, $options: "i" };
    console.log("🔍 Received Query Params:", searchParams.toString());
    console.log("🔍 AssignedTo Filter Raw:", assignedToFilter);
    console.log(
      "🔍 Converted to ObjectId?:",
      ObjectId.isValid(assignedToFilter)
        ? new ObjectId(assignedToFilter)
        : assignedToFilter
    );
    console.log("🔍 Filter Query:", query);

    // ✅ Fetch Total Count After Filtering (for pagination)
    const totalCount = await db.collection("tasks").countDocuments(query);

    const tasks = await db
      .collection("tasks")
      .aggregate([
        { $match: query },
        {
          $addFields: {
            assignedToId: "$assignedTo._id", // ✅ Extract ID from embedded object
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedToId", // ✅ Now referencing only the ID
            foreignField: "_id",
            as: "assignedUser",
          },
        },
        {
          $set: {
            assignedTo: {
              $cond: {
                if: { $gt: [{ $size: "$assignedUser" }, 0] }, // ✅ If user exists
                then: { $arrayElemAt: ["$assignedUser", 0] }, // ✅ Assign first user match
                else: "$assignedTo", // ✅ If no match, keep existing embedded object
              },
            },
          },
        },
        { $unset: "assignedUser" }, // ✅ Remove temporary field
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            priority: 1,
            status: 1,
            dueDate: 1,
            createdAt: 1,
            updatedAt: 1,
            "assignedTo._id": 1,
            "assignedTo.name": 1,
            "assignedTo.role": 1,
          },
        },
      ])
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    console.log("📡 FETCHED TASKS FROM DB:", JSON.stringify(tasks, null, 2));

    return new Response(
      JSON.stringify({
        success: true,
        data: tasks,
        totalCount, // ✅ Send total count to update frontend pagination
        hasMore: skip + tasks.length < totalCount, // ✅ Determine if more pages exist
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
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

    if (
      !title ||
      !description ||
      !priority ||
      !status ||
      !assignedTo ||
      !dueDate
    ) {
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" }),
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(assignedTo)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid assignedTo ID" }),
        { status: 400 }
      );
    }

    const assignedUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(assignedTo) });

    if (!assignedUser) {
      return new Response(
        JSON.stringify({ success: false, message: "Assigned user not found" }),
        { status: 404 }
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

    const newTask = {
      title,
      description,
      priority,
      status,
      assignedTo: {
        _id: assignedUser._id,
        name: assignedUser.name,
        role: assignedUser.role,
      },
      createdBy: { _id: user._id, name: user.name },
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(dueDate),
    };

    console.log(
      "🛠 NEW TASK OBJECT BEFORE INSERT:",
      JSON.stringify(newTask, null, 2)
    ); // 🔥 Debugging

    const result = await db.collection("tasks").insertOne(newTask);

    if (!result.acknowledged) {
      return new Response(
        JSON.stringify({ success: false, message: "Database insert failed" }),
        { status: 500 }
      );
    }

    console.log(
      "✅ TASK SUCCESSFULLY INSERTED:",
      JSON.stringify(newTask, null, 2)
    ); // 🔥 Debugging

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
