export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
    if (!res.ok) return [];

    const users = await res.json();

    return users.map((user) => ({ id: user._id.toString() })); // Ensure IDs are strings
  } catch (error) {
    console.error("❌ Error fetching users in generateStaticParams:", error);
    return [];
  }
}
