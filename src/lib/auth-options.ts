import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb, COLLECTIONS } from "@/lib/mongodb";
import type { UserDoc, UserRole } from "@/types";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      const db = await getDb();
      if (!db) return null;
      const user = await db
        .collection<UserDoc>(COLLECTIONS.users)
        .findOne({ email: credentials.email.toLowerCase() });
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(credentials.password, user.passwordHash);
      if (!ok) return null;
      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && user.email) {
        const db = await getDb();
        if (!db) return true;
        const col = db.collection<UserDoc>(COLLECTIONS.users);
        const existing = await col.findOne({
          email: user.email.toLowerCase(),
        });
        if (!existing) {
          await col.insertOne({
            _id: new ObjectId(),
            email: user.email.toLowerCase(),
            name: user.name ?? user.email.split("@")[0],
            role: "user",
            image: user.image ?? undefined,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        const db = await getDb();
        let role: UserRole =
          "role" in user && user.role ? (user.role as UserRole) : "user";
        let id = user.id ?? "";
        if (db) {
          const doc = await db
            .collection<UserDoc>(COLLECTIONS.users)
            .findOne({ email: user.email.toLowerCase() });
          if (doc) {
            role = doc.role;
            id = doc._id.toString();
            token.name = doc.name;
            token.picture = doc.image ?? user.image;
          }
        }
        token.role = role;
        token.id = id;
        if (!token.picture && user.image) token.picture = user.image;
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as UserRole) ?? "user";
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
