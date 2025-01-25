import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db("dashboard");

        // Check user credentials
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!user || user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }

        return { email: user.email, role: user.role }; // Simplified return object
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role; // Pass role to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Redirect users to /login for sign-in
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
