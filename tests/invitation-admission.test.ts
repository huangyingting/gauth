import test from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import {
  bootstrapAdmin,
  createInvitation,
  inspectInvitation,
  acceptInvitation,
  revokeInvitation,
  revokeUser,
  authenticateCredentials,
  hashInviteToken,
  AccountAdmissionError,
} from "../src/lib/account-admission";

async function resetAuthTables() {
  await prisma.auditLog.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});
}

test("Invite-only account admission lifecycle: zero demo accounts, CLI admin bootstrap, single-use token, revocation & audit logging", async () => {
  await resetAuthTables();

  // 1. Verify zero pre-seeded demo users exist
  const initialUsers = await prisma.user.count();
  assert.equal(initialUsers, 0, "Database must start with zero demo users");

  // 2. Bootstrap initial Admin strictly via CLI bootstrap function
  const { user: adminUser, created } = await bootstrapAdmin({
    email: "Root.Admin@Gauth.Example.com",
    password: "StrongAdminPassword!2026",
    name: "Root Administrator",
  });
  assert.equal(created, true);
  assert.equal(adminUser.email, "root.admin@gauth.example.com");
  assert.equal(adminUser.role, "Admin");

  // Second bootstrap without allowExistingUpdate is rejected
  await assert.rejects(
    () =>
      bootstrapAdmin({
        email: "second.admin@gauth.example.com",
        password: "AnotherStrongPassword!2026",
      }),
    (err: unknown) =>
      err instanceof AccountAdmissionError && err.code === "admin_already_exists"
  );

  // 3. Issue a single-use invitation for a Creator
  const { invitation, rawToken } = await createInvitation({
    email: "Scholar.One@Gauth.Example.com",
    role: "Creator",
    expiresInHours: 48,
    invitedById: adminUser.id,
    actorEmail: adminUser.email,
  });

  // Verify raw token is never stored in DB (only SHA-256 hash)
  assert.notEqual(invitation.tokenHash, rawToken);
  assert.equal(invitation.tokenHash, hashInviteToken(rawToken));
  assert.equal(invitation.activeForEmail, "scholar.one@gauth.example.com");

  // Duplicate active invitation for same email must be rejected
  await assert.rejects(
    () =>
      createInvitation({
        email: "scholar.one@gauth.example.com",
        role: "Creator",
        invitedById: adminUser.id,
      }),
    (err: unknown) =>
      err instanceof AccountAdmissionError && err.code === "invitation_exists"
  );

  // 4. Inspect token before redemption
  const inspected = await inspectInvitation(rawToken);
  assert.equal(inspected.valid, true);
  assert.equal(inspected.status, "PENDING");
  assert.equal(inspected.role, "Creator");

  // 5. Accept invitation (single-use atomic claim)
  const { user: memberUser, session: memberSession } = await acceptInvitation({
    rawToken,
    email: "scholar.one@gauth.example.com",
    name: "Scholar One",
    password: "ScholarPassword!2026",
  });
  assert.equal(memberUser.email, "scholar.one@gauth.example.com");
  assert.equal(memberUser.role, "Creator");
  assert.ok(memberSession.sessionToken.length > 20);

  // 6. Reusing the same invitation token a second time must fail with 410
  await assert.rejects(
    () =>
      acceptInvitation({
        rawToken,
        name: "Replay Attacker",
        password: "ReplayPassword!2026",
      }),
    (err: unknown) =>
      err instanceof AccountAdmissionError && err.status === 410
  );

  // 7. Revoke invitation test on a separate pending invite
  const { invitation: revocableInvite, rawToken: revocableToken } =
    await createInvitation({
      email: "viewer.temp@gauth.example.com",
      role: "Viewer",
      invitedById: adminUser.id,
    });
  await revokeInvitation({
    invitationId: revocableInvite.id,
    actorId: adminUser.id,
    actorEmail: adminUser.email,
  });
  const inspectedAfterRevoke = await inspectInvitation(revocableToken);
  assert.equal(inspectedAfterRevoke.valid, false);
  assert.equal(inspectedAfterRevoke.status, "REVOKED");
  assert.equal("email" in inspectedAfterRevoke, false, "410 responses must not leak raw email");
  assert.ok(inspectedAfterRevoke.maskedEmail.includes("***"));

  // 8. Authenticate credentials for active member
  const authResult = await authenticateCredentials({
    email: "scholar.one@gauth.example.com",
    password: "ScholarPassword!2026",
  });
  assert.equal(authResult.user.id, memberUser.id);

  // 9. Revoke user and verify all sessions are immediately deleted and sign-in blocked
  await revokeUser({
    userId: memberUser.id,
    actorId: adminUser.id,
    actorEmail: adminUser.email,
  });

  const remainingSessions = await prisma.session.count({
    where: { userId: memberUser.id },
  });
  assert.equal(remainingSessions, 0, "Revoking user must delete all active sessions");

  await assert.rejects(
    () =>
      authenticateCredentials({
        email: "scholar.one@gauth.example.com",
        password: "ScholarPassword!2026",
      }),
    (err: unknown) =>
      err instanceof AccountAdmissionError && err.code === "account_revoked"
  );

  // 9b. Re-inviting a previously revoked user and accepting the new invitation must restore the user without P2002
  const { rawToken: reinviteToken } = await createInvitation({
    email: "scholar.one@gauth.example.com",
    role: "Viewer",
    invitedById: adminUser.id,
    actorEmail: adminUser.email,
  });
  const { user: restoredUser } = await acceptInvitation({
    rawToken: reinviteToken,
    email: "scholar.one@gauth.example.com",
    name: "Scholar One Restored",
    password: "RestoredPassword!2026",
  });
  assert.equal(restoredUser.id, memberUser.id, "Must restore existing User record");
  assert.equal(restoredUser.revokedAt, null, "Must clear revokedAt");
  assert.equal(restoredUser.role, "Viewer", "Must update role to new invitation role");
  assert.equal(restoredUser.queriesRemaining, 3, "Must reset free quota on restore");

  // 9c. bootstrapAdmin with allowExistingUpdate must reject creating a brand-new second admin email
  await assert.rejects(
    () =>
      bootstrapAdmin({
        email: "uninvited.second.admin@gauth.example.com",
        password: "SecondAdminPassword!2026",
        allowExistingUpdate: true,
      }),
    (err: unknown) =>
      err instanceof AccountAdmissionError && err.status === 409
  );

  // 10. Verify AuditLog captured all security events
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "asc" },
  });
  const actions = auditLogs.map((a) => a.action);
  assert.ok(actions.includes("ADMIN_BOOTSTRAPPED"));
  assert.ok(actions.includes("INVITATION_CREATED"));
  assert.ok(actions.includes("INVITATION_ACCEPTED"));
  assert.ok(actions.includes("INVITATION_REVOKED"));
  assert.ok(actions.includes("SIGN_IN_SUCCEEDED"));
  assert.ok(actions.includes("USER_REVOKED"));
  assert.ok(actions.includes("SIGN_IN_REJECTED"));

  // Clean up test records so production DB stays clean with 0 demo accounts
  await resetAuthTables();
});
