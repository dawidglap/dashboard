import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { db } = await connectToDatabase();

  try {
    const users = await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            _id: 1,
            name: 1,
            role: 1,
            email: 1,
            birthday: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ name: 1 })
      .toArray();

    return new Response(JSON.stringify({ success: true, users }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Benutzer:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const { db } = await connectToDatabase();
  const body = await request.json();

  const {
    email,
    password,
    name = "",
    surname = "",
    birthday = "",
    role = "kunde",
    phone_number = "",
    user_street = "",
    user_street_number = "",
    user_postcode = "",
    user_city = "",
    subscription_expiration = null,
    is_active = true,
  } = body;

  if (!email || !password) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Email and password are required.",
      }),
      { status: 400 }
    );
  }

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User with this email already exists",
      }),
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = {
      email,
      password: hashedPassword,
      name,
      surname,
      birthday,
      role,
      phone_number,
      user_street,
      user_street_number,
      user_postcode,
      user_city,
      subscription_expiration: subscription_expiration
        ? new Date(subscription_expiration)
        : null,
      is_active,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);
    const userId = result.insertedId;

    if (role !== "admin") {
      const tasks = await generateWeeklyTasks(userId, db);
      if (tasks.length > 0) {
        await db.collection("tasks").insertMany(tasks);
      } else {
        console.error(
          "❌ No tasks generated! Check user ID and database connection."
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { ...newUser, _id: userId },
      }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

// ✅ Function to Generate 52 Weekly Tasks (Final Fix)
async function generateWeeklyTasks(userId, db) {
  const tasks = [];
  const firstMonday = getFirstMondayOfNextMonth();

  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(userId) });
  if (!user) return [];

  for (let i = 0; i < 52; i++) {
    const unlockDate = new Date(
      firstMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000
    );

    tasks.push({
      title: `Lade den wöchentlichen POST herunter und veröffentliche ihn – Woche ${
        i + 1
      }`,
      description:
        "Im Bereich „Materialien“ findest du die POSTs für alle Wochen von 1 bis 52. Lade den POST für die aktuelle Woche herunter und veröffentliche ihn auf deinen Social-Media-Kanälen gemäss den erhaltenen Anweisungen.",
      assignedTo: [
        {
          _id: new ObjectId(userId),
          name: user.name || "Unbekannt",
          role: user.role || "markenbotschafter",
        },
      ],
      weekNumber: i + 1,
      unlockDate: unlockDate,
      dueDate: unlockDate,
      status: "pending",
      locked: true,
      createdAt: new Date(),
    });
  }

  return tasks;
}

// ✅ Function to Get First Monday of Next Month
function getFirstMondayOfNextMonth() {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  while (nextMonth.getDay() !== 1) {
    nextMonth.setDate(nextMonth.getDate() + 1);
  }

  return nextMonth;
}

export async function DELETE(request) {
  const { db } = await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId || !ObjectId.isValid(userId)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid or missing user ID" }),
      { status: 400 }
    );
  }

  try {
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { db } = await connectToDatabase();
  const body = await request.json();

  const {
    id,
    email,
    password,
    phone_number,
    user_street,
    user_street_number,
    user_postcode,
    user_city,
    subscription_expiration,
    is_active,
  } = body;

  if (!id || !ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid or missing user ID" }),
      { status: 400 }
    );
  }

  const updateData = {};
  if (email) updateData.email = email;
  if (phone_number) updateData.phone_number = phone_number;
  if (user_street) updateData.user_street = user_street;
  if (user_street_number) updateData.user_street_number = user_street_number;
  if (user_postcode) updateData.user_postcode = user_postcode;
  if (user_city) updateData.user_city = user_city;
  if (subscription_expiration)
    updateData.subscription_expiration = new Date(subscription_expiration);
  if (typeof is_active !== "undefined") updateData.is_active = is_active;

  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
