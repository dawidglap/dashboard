import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

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
    manager_id = null, // ✅ new field
  } = body;

  if (!email || !password) {
    return new Response(JSON.stringify({ success: false, message: "Email and password are required." }), { status: 400 });
  }

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ success: false, message: "User already exists" }), { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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
    subscription_expiration: subscription_expiration ? new Date(subscription_expiration) : null,
    is_active,
    createdAt: new Date(),
  };

  // ✅ Only attach manager_id if role is markenbotschafter
  if (role === "markenbotschafter" && manager_id && ObjectId.isValid(manager_id)) {
    newUser.manager_id = new ObjectId(manager_id);
  }

  const result = await db.collection("users").insertOne(newUser);
  return new Response(JSON.stringify({ success: true, data: { ...newUser, _id: result.insertedId } }), { status: 201 });
}

export async function PUT(request) {
  const { db } = await connectToDatabase();
  const body = await request.json();

  const userId = body.id || body._id;
  if (!userId || !ObjectId.isValid(userId)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid user ID" }), { status: 400 });
  }

  const updateData = {
    ...(body.email && { email: body.email }),
    ...(body.name && { name: body.name }),
    ...(body.surname && { surname: body.surname }),
    ...(body.birthday && { birthday: body.birthday }),
    ...(body.role && { role: body.role }),
    ...(body.phone_number && { phone_number: body.phone_number }),
    ...(body.user_street && { user_street: body.user_street }),
    ...(body.user_street_number && { user_street_number: body.user_street_number }),
    ...(body.user_postcode && { user_postcode: body.user_postcode }),
    ...(body.user_city && { user_city: body.user_city }),
    ...(body.subscription_expiration && { subscription_expiration: new Date(body.subscription_expiration) }),
    is_active: body.is_active ?? true,
  };

  // ✅ Handle manager_id only if user is markenbotschafter
  if (body.role === "markenbotschafter" && body.manager_id && ObjectId.isValid(body.manager_id)) {
    updateData.manager_id = new ObjectId(body.manager_id);
  }

  if (body.password && body.password.trim() !== "") {
    updateData.password = await bcrypt.hash(body.password, 10);
  }

  const result = await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateData });

  if (result.matchedCount === 0) {
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, message: "User updated successfully" }), { status: 200 });
}
