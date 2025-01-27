require("dotenv").config();
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI; // Use the URI from .env
const client = new MongoClient(uri);

async function hashPasswords() {
  try {
    await client.connect();
    const db = client.db("dashboard");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    for (const user of users) {
      if (!user.password.startsWith("$2b$")) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        console.log(`Hashed password for user: ${user.email}`);
      }
    }
    console.log("All passwords hashed successfully!");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  } finally {
    await client.close();
  }
}

hashPasswords();
