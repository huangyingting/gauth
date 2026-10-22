import type { Prisma, PrismaClient } from "@prisma/client";

export type AuditAction =
  | "ADMIN_BOOTSTRAPPED"
  | "INVITATION_CREATED"
  | "INVITATION_ACCEPTED"
  | "INVITATION_REVOKED"
  | "SIGN_IN_SUCCEEDED"
  | "SIGN_IN_REJECTED"
  | "USER_REVOKED"
  | "USER_PLAN_UPGRADED";

export interface WriteAuditLogInput {
  actorId?: string | null;
  actorEmail?: string | null;
  action: AuditAction;
  targetType: "User" | "Invitation" | "Session";
  targetId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function writeAuditLog(db: DbClient, input: WriteAuditLogInput) {
  return db.auditLog.create({
    data: {
      actorId: input.actorId ?? null,
      actorEmail: input.actorEmail ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      ipAddress: input.ipAddress ?? null,
      userAgent: input.userAgent ?? null,
    },
  });
}
