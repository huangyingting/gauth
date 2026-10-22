import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AccountAdmissionError, isValidRole, type RoleName } from "./errors";
import {
  generateRawInviteToken,
  hashInviteToken,
  isValidEmail,
  maskEmail,
  normalizeEmail,
} from "./tokens";
import { writeAuditLog } from "./audit";
import { createDatabaseSession } from "./session";

export interface CreateInvitationInput {
  email: string;
  role?: RoleName;
  expiresInHours?: number;
  invitedById: string;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface AcceptInvitationInput {
  rawToken: string;
  email?: string;
  name: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

function isUniqueConstraintError(err: unknown): boolean {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
}

export async function expireStaleInvitations(now = new Date()): Promise<number> {
  const res = await prisma.invitation.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lte: now },
    },
    data: {
      status: "EXPIRED",
      activeForEmail: null,
    },
  });
  return res.count;
}

export async function createInvitation(input: CreateInvitationInput) {
  if (!isValidEmail(input.email)) {
    throw new AccountAdmissionError(400, "invalid_email", "Enter a valid email address.");
  }
  const normalizedEmail = normalizeEmail(input.email);
  const role: RoleName = input.role && isValidRole(input.role) ? input.role : "Creator";
  const hours = input.expiresInHours ?? 72;
  if (!Number.isFinite(hours) || hours < 1 || hours > 720) {
    throw new AccountAdmissionError(
      400,
      "invalid_expiry",
      "Invitation expiry must be between 1 and 720 hours."
    );
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + hours * 3600 * 1000);
  const rawToken = generateRawInviteToken();
  const tokenHash = hashInviteToken(rawToken);

  try {
    await expireStaleInvitations(now);

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, revokedAt: true },
    });
    if (existingUser && !existingUser.revokedAt) {
      throw new AccountAdmissionError(
        409,
        "already_member",
        "An active account already exists for this email address."
      );
    }

    const activeInvite = await prisma.invitation.findUnique({
      where: { activeForEmail: normalizedEmail },
      select: { id: true },
    });
    if (activeInvite) {
      throw new AccountAdmissionError(
        409,
        "invitation_exists",
        "An active pending invitation already exists for this email."
      );
    }

    const invitation = await prisma.$transaction(async (tx) => {
      const created = await tx.invitation.create({
        data: {
          email: normalizedEmail,
          activeForEmail: normalizedEmail,
          tokenHash,
          role,
          status: "PENDING",
          expiresAt,
          invitedById: input.invitedById,
        },
      });

      await writeAuditLog(tx, {
        actorId: input.invitedById,
        actorEmail: input.actorEmail ?? null,
        action: "INVITATION_CREATED",
        targetType: "Invitation",
        targetId: created.id,
        metadata: { email: normalizedEmail, role, expiresAt: expiresAt.toISOString() },
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
      });

      return created;
    });

    return {
      invitation,
      rawToken,
      invitePath: `/invite/${rawToken}`,
    };
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      throw new AccountAdmissionError(
        409,
        "invitation_exists",
        "An active pending invitation already exists for this email."
      );
    }
    throw err;
  }
}

export async function inspectInvitation(rawToken: string, now = new Date()) {
  if (!rawToken || rawToken.trim().length < 16) {
    return { valid: false as const, status: "INVALID" as const, httpStatus: 404 };
  }
  const tokenHash = hashInviteToken(rawToken);
  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
    include: {
      invitedBy: { select: { name: true, email: true } },
    },
  });

  if (!invitation) {
    return { valid: false as const, status: "INVALID" as const, httpStatus: 404 };
  }

  if (invitation.status === "PENDING" && invitation.expiresAt <= now) {
    await prisma.invitation.updateMany({
      where: { id: invitation.id, status: "PENDING" },
      data: { status: "EXPIRED", activeForEmail: null },
    });
    return {
      valid: false as const,
      status: "EXPIRED" as const,
      httpStatus: 410,
      email: invitation.email,
      maskedEmail: maskEmail(invitation.email),
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    };
  }

  if (invitation.status !== "PENDING") {
    return {
      valid: false as const,
      status: invitation.status as "ACCEPTED" | "REVOKED" | "EXPIRED",
      httpStatus: 410,
      email: invitation.email,
      maskedEmail: maskEmail(invitation.email),
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    };
  }

  return {
    valid: true as const,
    status: "PENDING" as const,
    httpStatus: 200,
    id: invitation.id,
    email: invitation.email,
    maskedEmail: maskEmail(invitation.email),
    role: invitation.role,
    expiresAt: invitation.expiresAt,
    invitedBy: invitation.invitedBy?.name || invitation.invitedBy?.email || "Administrator",
  };
}

export async function acceptInvitation(input: AcceptInvitationInput) {
  if (!input.rawToken || input.rawToken.trim().length < 16) {
    throw new AccountAdmissionError(404, "invalid_token", "Invitation token not found.");
  }
  if (!input.password || input.password.length < 8 || input.password.length > 128) {
    throw new AccountAdmissionError(
      400,
      "invalid_password",
      "Password must be between 8 and 128 characters."
    );
  }
  const displayName = input.name?.trim();
  if (!displayName || displayName.length < 2) {
    throw new AccountAdmissionError(400, "invalid_name", "Please enter your full name.");
  }

  const now = new Date();
  const tokenHash = hashInviteToken(input.rawToken);
  const invitation = await prisma.invitation.findUnique({
    where: { tokenHash },
  });

  if (!invitation) {
    throw new AccountAdmissionError(404, "invalid_token", "Invitation token not found.");
  }

  if (invitation.status === "PENDING" && invitation.expiresAt <= now) {
    await prisma.invitation.updateMany({
      where: { id: invitation.id, status: "PENDING" },
      data: { status: "EXPIRED", activeForEmail: null },
    });
    throw new AccountAdmissionError(410, "invitation_expired", "This invitation has expired.");
  }

  if (invitation.status !== "PENDING") {
    throw new AccountAdmissionError(
      410,
      "invitation_inactive",
      `This invitation is no longer active (${invitation.status.toLowerCase()}).`
    );
  }

  if (input.email && normalizeEmail(input.email) !== invitation.email) {
    throw new AccountAdmissionError(
      403,
      "email_mismatch",
      "The email address does not match the invitation recipient."
    );
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.$transaction(async (tx) => {
    const claimed = await tx.invitation.updateMany({
      where: {
        id: invitation.id,
        tokenHash,
        status: "PENDING",
        expiresAt: { gt: now },
      },
      data: {
        status: "ACCEPTED",
        acceptedAt: now,
        activeForEmail: null,
      },
    });

    if (claimed.count !== 1) {
      throw new AccountAdmissionError(
        410,
        "invitation_already_claimed",
        "This invitation has already been used or revoked."
      );
    }

    const existingUser = await tx.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser && !existingUser.revokedAt) {
      throw new AccountAdmissionError(
        409,
        "already_member",
        "An active account already exists for this email."
      );
    }

    const createdOrRestored = existingUser
      ? await tx.user.update({
          where: { id: existingUser.id },
          data: {
            name: displayName,
            passwordHash,
            role: invitation.role,
            invitedById: invitation.invitedById,
            revokedAt: null,
            emailVerified: now,
          },
        })
      : await tx.user.create({
          data: {
            email: invitation.email,
            name: displayName,
            passwordHash,
            role: invitation.role,
            invitedById: invitation.invitedById,
            emailVerified: now,
          },
        });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { acceptedById: createdOrRestored.id },
    });

    await writeAuditLog(tx, {
      actorId: createdOrRestored.id,
      actorEmail: createdOrRestored.email,
      action: "INVITATION_ACCEPTED",
      targetType: "Invitation",
      targetId: invitation.id,
      metadata: { role: invitation.role, invitedById: invitation.invitedById },
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });

    return createdOrRestored;
  });

  const session = await createDatabaseSession(user.id, now);
  return { user, session };
}

export async function revokeInvitation(input: {
  invitationId: string;
  actorId: string;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const now = new Date();
  const invitation = await prisma.invitation.findUnique({
    where: { id: input.invitationId },
  });
  if (!invitation) {
    throw new AccountAdmissionError(404, "not_found", "Invitation not found.");
  }
  if (invitation.status !== "PENDING") {
    throw new AccountAdmissionError(
      409,
      "invalid_transition",
      `Cannot revoke an invitation with status ${invitation.status}.`
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.invitation.update({
      where: { id: invitation.id },
      data: {
        status: "REVOKED",
        revokedAt: now,
        activeForEmail: null,
      },
    });

    await writeAuditLog(tx, {
      actorId: input.actorId,
      actorEmail: input.actorEmail ?? null,
      action: "INVITATION_REVOKED",
      targetType: "Invitation",
      targetId: invitation.id,
      metadata: { email: invitation.email },
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });

    return updated;
  });
}

export async function revokeUser(input: {
  userId: string;
  actorId: string;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  if (input.userId === input.actorId) {
    throw new AccountAdmissionError(400, "self_revoke", "Administrators cannot revoke their own account.");
  }

  const target = await prisma.user.findUnique({
    where: { id: input.userId },
  });
  if (!target) {
    throw new AccountAdmissionError(404, "not_found", "User not found.");
  }

  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: target.id },
      data: { revokedAt: now },
    });

    const deletedSessions = await tx.session.deleteMany({
      where: { userId: target.id },
    });

    await writeAuditLog(tx, {
      actorId: input.actorId,
      actorEmail: input.actorEmail ?? null,
      action: "USER_REVOKED",
      targetType: "User",
      targetId: target.id,
      metadata: {
        email: target.email,
        invalidatedSessions: deletedSessions.count,
      },
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });

    return updated;
  });
}

export async function authenticateCredentials(input: {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  const dummyHash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4oL8r6s/K2";
  const validPassword = await bcrypt.compare(
    input.password,
    user?.passwordHash || dummyHash
  );

  if (!user || !user.passwordHash || !validPassword) {
    await writeAuditLog(prisma, {
      actorId: user?.id ?? null,
      actorEmail: normalizedEmail,
      action: "SIGN_IN_REJECTED",
      targetType: "User",
      targetId: user?.id ?? null,
      metadata: { reason: "invalid_credentials" },
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });
    throw new AccountAdmissionError(401, "invalid_credentials", "Invalid email or password.");
  }

  if (user.revokedAt !== null) {
    await writeAuditLog(prisma, {
      actorId: user.id,
      actorEmail: user.email,
      action: "SIGN_IN_REJECTED",
      targetType: "User",
      targetId: user.id,
      metadata: { reason: "account_revoked" },
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    });
    throw new AccountAdmissionError(403, "account_revoked", "This account has been revoked.");
  }

  const session = await createDatabaseSession(user.id);
  await writeAuditLog(prisma, {
    actorId: user.id,
    actorEmail: user.email,
    action: "SIGN_IN_SUCCEEDED",
    targetType: "Session",
    targetId: session.id,
    metadata: { role: user.role },
    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
  });

  return { user, session };
}
