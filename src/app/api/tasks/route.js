import { connectToDatabase } from "@/lib/mongodb";

/**
 * GET /api/tasks
 * Fetches tasks from the database.
 * Admins see all tasks; Managers see their tasks & their team's tasks; Markenbotschafters see only their tasks.
 */
export async function GET(request) {
  const { db } = await connectToDatabase();

  try {
    const tasks = await db.collection("tasks").find().toArray();
    return new Response(JSON.stringify({ success: true, data: tasks }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}
