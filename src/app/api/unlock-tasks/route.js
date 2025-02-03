import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET /api/unlock-tasks
 * Unlocks all tasks where `unlockDate` is today or earlier.
 */
export async function GET(request) {
  const { db } = await connectToDatabase();

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time precision

    // ✅ Find all locked tasks that should be unlocked today
    const result = await db.collection("tasks").updateMany(
      {
        locked: true,
        unlockDate: { $lte: today }, // Tasks where unlockDate is today or earlier
      },
      {
        $set: { locked: false }, // Unlock them
      }
    );

    console.log(
      `✅ Unlocked ${result.modifiedCount} tasks where unlockDate <= ${today}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `${result.modifiedCount} tasks unlocked.`,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error unlocking tasks:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
