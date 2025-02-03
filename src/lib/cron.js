import cron from "node-cron";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * 🕒 CRON JOB: Automatically unlock tasks every Monday at 00:01
 */
async function unlockTasks() {
  const { db } = await connectToDatabase();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Normalize time to UTC

  try {
    const result = await db.collection("tasks").updateMany(
      {
        locked: true,
        unlockDate: { $lte: today },
      },
      {
        $set: { locked: false, status: "pending" }, // ✅ Unlock & update status
      }
    );

    console.log(`✅ [CRON] Unlocked ${result.modifiedCount} tasks.`);
  } catch (error) {
    console.error("❌ [CRON] Error unlocking tasks:", error);
  }
}

// ✅ Schedule the cron job to run every Monday at 00:01
// cron.schedule("1 0 * * 1", async () => {
//   console.log("🔄 Running task unlocking cron job...");
//   await unlockTasks();
// });

// Run every minute (TEMPORARY for testing)
cron.schedule("* * * * *", async () => {
  console.log("🔄 Running task unlocking cron job...");
  await unlockTasks();
});

export default unlockTasks;
