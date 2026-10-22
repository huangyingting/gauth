# NextAuth + Invite-Only Registration Specification

## 1. Security Invariants
1. **No Public Sign-Up**: Uninvited visitors cannot register via Credentials or OAuth.
2. **Zero Pre-Seeded Demo Accounts**: Neither migrations nor seed scripts create any default or demo user accounts.
3. **CLI-Only Admin Bootstrap**: The initial `Admin` user is created exclusively by the operator running `npm run bootstrap:admin -- --email <email> --name "<name>" --password-stdin` on the server. No HTTP endpoint exists for admin bootstrapping.
4. **Hashed Single-Use Tokens**: Invitation tokens are generated with 32 bytes of CSPRNG entropy (`crypto.randomBytes(32).toString('base64url')`). Only the SHA-256 hex digest (`tokenHash`) is stored in the database.
5. **Active-Per-Email Uniqueness**: `activeForEmail` is set to the normalized email while `status = 'PENDING'` and cleared to `null` when `ACCEPTED`, `REVOKED`, or `EXPIRED`.
6. **Atomic Single-Use Redemption**: Accepting an invitation runs inside a database transaction that performs a conditional `updateMany` checking `status = 'PENDING'` and `expiresAt > now()`. If `count !== 1`, the transaction aborts with `InvitationStateError`.
7. **Immediate Session Revocation**: Revoking a user sets `revokedAt = now()` and deletes all `Session` records for `userId` in the same transaction. Every active session lookup also checks `user.revokedAt === null`.
8. **Comprehensive Audit Trail**: Every `ADMIN_BOOTSTRAPPED`, `INVITATION_CREATED`, `INVITATION_ACCEPTED`, `INVITATION_REVOKED`, `SIGN_IN_SUCCEEDED`, `SIGN_IN_REJECTED`, and `USER_REVOKED` action is recorded in `AuditLog`.
