import cron from "node-cron";
import { connectToDatabase } from "./src/lib/mongodb.js";
import dotenv from "dotenv";

dotenv.config();

async function unlockTasks() {
  console.log("🔎 [DEBUG] Inside unlockTasks() function...");

  const { db } = await connectToDatabase();
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0); // Normalize to UTC

  try {
    console.log("🔍 Checking for tasks to unlock...");

    // ✅ Unlock new tasks
    const unlockResult = await db.collection("tasks").updateMany(
      {
        locked: true,
        unlockDate: { $lte: today },
      },
      {
        $set: { locked: false, status: "pending" },
      }
    );

    console.log(`✅ [CRON] Unlocked ${unlockResult.modifiedCount} tasks.`);

    // ✅ Mark overdue tasks as "Nicht Abgeschlossen"
    console.log("🔍 Checking for overdue tasks...");
    const overdueResult = await db.collection("tasks").updateMany(
      {
        locked: false, // Task must be unlocked
        status: { $ne: "Erledigt" }, // Exclude completed tasks
        dueDate: { $lt: today }, // Due date is in the past
      },
      {
        $set: { status: "Nicht Abgeschlossen" },
      }
    );

    console.log(
      `⏳ [CRON] Marked ${overdueResult.modifiedCount} overdue tasks as 'Nicht Abgeschlossen'.`
    );
  } catch (error) {
    console.error("❌ [CRON] Error in task processing:", error);
  }
}

// ✅ Schedule the cron job (TEMPORARY: Run every minute for testing)
console.log("🕒 Scheduling cron job...");
// cron.schedule("* * * * *", async () => {  // Runs every minute (for testing)

cron.schedule("1 0 * * 1", async () => {
  // Runs every Monday at 00:01 UTC
  console.log("🔄 Running task unlocking cron job...");
  await unlockTasks();
});

console.log("🚀 Cron job is now running...");
