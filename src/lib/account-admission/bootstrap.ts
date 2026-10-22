import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AccountAdmissionError } from "./errors";
import { isValidEmail, normalizeEmail } from "./tokens";
import { writeAuditLog } from "./audit";

/**
 * Provisions the initial root Administrator account strictly via CLI (`npm run bootstrap:admin`).
 * Never exposed via an HTTP endpoint. Never creates demo accounts.
 */
export async function bootstrapAdmin(input: {
  email: string;
  password: string;
  name?: string | null;
  allowExistingUpdate?: boolean;
}) {
  if (!isValidEmail(input.email)) {
    throw new AccountAdmissionError(
      400,
      "invalid_email",
      "Enter a valid administrator email address."
    );
  }
  if (!input.password || input.password.length < 8 || input.password.length > 128) {
    throw new AccountAdmissionError(
      400,
      "invalid_password",
      "Administrator password must be between 8 and 128 characters."
    );
  }

  const email = normalizeEmail(input.email);
  const displayName = input.name?.trim() || email.split("@")[0] || "System Administrator";
  const passwordHash = await bcrypt.hash(input.password, 12);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const existingAdminCount = await tx.user.count({
      where: { role: "Admin", revokedAt: null },
    });

    const existingUser = await tx.user.findUnique({
      where: { email },
    });

    if (existingAdminCount > 0 && !input.allowExistingUpdate) {
      throw new AccountAdmissionError(
        409,
        "admin_already_exists",
        "An active Admin account already exists. Use the admin invitation flow to add additional administrators."
      );
    }

    const user = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: displayName,
            passwordHash,
            role: "Admin",
            plan: "PLUS_ANNUAL",
            queriesRemaining: 9999,
            aiProRemaining: 9999,
            atlasCreditsRemaining: 9999,
            courseCreatesRemaining: 9999,
            revokedAt: null,
            emailVerified: existingUser.emailVerified ?? now,
          },
        })
      : await tx.user.create({
          data: {
            email,
            name: displayName,
            passwordHash,
            role: "Admin",
            plan: "PLUS_ANNUAL",
            queriesRemaining: 9999,
            aiProRemaining: 9999,
            atlasCreditsRemaining: 9999,
            courseCreatesRemaining: 9999,
            emailVerified: now,
          },
        });

    await tx.session.deleteMany({ where: { userId: user.id } });

    await writeAuditLog(tx, {
      actorId: user.id,
      actorEmail: user.email,
      action: "ADMIN_BOOTSTRAPPED",
      targetType: "User",
      targetId: user.id,
      metadata: {
        source: "cli",
        created: !existingUser,
      },
    });

    return { user, created: !existingUser };
  });
}
