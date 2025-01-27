import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export async function GET(request) {
  const { db } = await connectToDatabase();

  try {
    const users = await db.collection("users").find().toArray();
    return new Response(JSON.stringify({ success: true, data: users }), {
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
