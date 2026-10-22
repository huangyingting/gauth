export class AccountAdmissionError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "AccountAdmissionError";
    this.status = status;
    this.code = code;
  }
}

export type RoleName = "Admin" | "Creator" | "Viewer";

export const VALID_ROLES: readonly RoleName[] = ["Admin", "Creator", "Viewer"] as const;

export function isValidRole(role: string): role is RoleName {
  return (VALID_ROLES as readonly string[]).includes(role);
}
