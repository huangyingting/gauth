import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";
import {
  SESSION_COOKIE_OPTIONS,
  SESSION_MAX_AGE_SECONDS,
  SESSION_UPDATE_AGE_SECONDS,
} from "./account-admission/session";
import { normalizeEmail } from "./account-admission/tokens";
import { writeAuditLog } from "./account-admission/audit";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "database",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email) {
        await writeAuditLog(prisma, {
          action: "SIGN_IN_REJECTED",
          targetType: "User",
          metadata: { reason: "missing_email", provider: account?.provider ?? "oauth" },
        });
        return false;
      }
      const normalized = normalizeEmail(user.email);
      const existing = await prisma.user.findUnique({
        where: { email: normalized },
      });
      if (!existing || existing.revokedAt !== null) {
        await writeAuditLog(prisma, {
          actorId: existing?.id ?? null,
          actorEmail: normalized,
          action: "SIGN_IN_REJECTED",
          targetType: "User",
          targetId: existing?.id ?? null,
          metadata: {
            reason: !existing ? "not_invited" : "user_revoked",
            provider: account?.provider ?? "oauth",
          },
        });
        return false;
      }
      await writeAuditLog(prisma, {
        actorId: existing.id,
        actorEmail: existing.email,
        action: "SIGN_IN_SUCCEEDED",
        targetType: "User",
        targetId: existing.id,
        metadata: { provider: account?.provider ?? "oauth" },
      });
      return true;
    },
    async session({ session, user }) {
      if (session.user && user) {
        const dbUser = user as unknown as {
          id: string;
          role?: string;
          plan?: string;
          revokedAt?: Date | null;
        };
        if (dbUser.revokedAt) {
          throw new Error("Session revoked");
        }
        Object.assign(session.user, {
          id: dbUser.id,
          role: dbUser.role ?? "Creator",
          plan: dbUser.plan ?? "FREE",
        });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: SESSION_COOKIE_OPTIONS.secure,
};
