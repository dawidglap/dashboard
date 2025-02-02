import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { db } = await connectToDatabase();

  try {
    // ✅ Include email in the projection
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
      ) // Include `email` and `birthday`
      .sort({ name: 1 }) // ✅ Sort alphabetically
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

  const { email, password, name, surname, birthday, role } = body;

  // Validate required fields
  if (!email || !password || !name || !surname || !birthday || !role) {
    return new Response(
      JSON.stringify({
        success: false,
        message:
          "All fields are required: email, password, name, surname, birthday, role",
      }),
      { status: 400 }
    );
  }

  // Check if user already exists
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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert new user
  try {
    const newUser = {
      email,
      password: hashedPassword,
      name,
      surname,
      birthday,
      role,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Respond with inserted user
    return new Response(
      JSON.stringify({
        success: true,
        data: { ...newUser, _id: result.insertedId },
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request) {
  const { db } = await connectToDatabase();

  // Parse the user ID from the request URL
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  // Validate the ID
  if (!userId || !ObjectId.isValid(userId)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid or missing user ID" }),
      { status: 400 }
    );
  }

  try {
    // Attempt to delete the user
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
      {
        status: 200,
      }
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
    phone_number,
    user_street,
    user_street_number,
    user_postcode,
    user_city,
    subscription_expiration,
    is_active,
  } = body;

  // Validate required fields
  if (!id || !ObjectId.isValid(id)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid or missing user ID" }),
      { status: 400 }
    );
  }

  // Create the update object
  const updateData = {};
  if (email) updateData.email = email;
  if (phone_number) updateData.phone_number = phone_number;
  if (user_street) updateData.user_street = user_street;
  if (user_street_number) updateData.user_street_number = user_street_number;
  if (user_postcode) updateData.user_postcode = user_postcode;
  if (user_city) updateData.user_city = user_city;
  if (subscription_expiration)
    updateData.subscription_expiration = new Date(subscription_expiration);
  if (typeof is_active !== "undefined") updateData.is_active = is_active; // Allow toggling activation status

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
