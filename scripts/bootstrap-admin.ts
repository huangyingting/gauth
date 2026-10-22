#!/usr/bin/env tsx
import "dotenv/config";
import { bootstrapAdmin } from "../src/lib/account-admission/bootstrap";
import { prisma } from "../src/lib/prisma";

type ParsedArgs = {
  email?: string;
  name?: string;
  passwordStdin: boolean;
  allowExistingUpdate: boolean;
  help: boolean;
};

function parseArgs(argv: string[]): ParsedArgs {
  const parsed: ParsedArgs = {
    passwordStdin: false,
    allowExistingUpdate: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
    } else if (arg === "--email" && argv[i + 1]) {
      parsed.email = argv[++i];
    } else if (arg.startsWith("--email=")) {
      parsed.email = arg.slice("--email=".length);
    } else if (arg === "--name" && argv[i + 1]) {
      parsed.name = argv[++i];
    } else if (arg.startsWith("--name=")) {
      parsed.name = arg.slice("--name=".length);
    } else if (arg === "--password-stdin") {
      parsed.passwordStdin = true;
    } else if (arg === "--allow-existing-update") {
      parsed.allowExistingUpdate = true;
    } else {
      throw new Error(`Unsupported argument: ${arg}`);
    }
  }
  return parsed;
}

async function readStdinLine(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
}

function printUsage() {
  console.log(
    [
      "Usage:",
      '  printf "%s\\n" "$ADMIN_PASSWORD" | npm run bootstrap:admin -- --email admin@example.com --name "System Admin" --password-stdin',
      "",
      "Notes:",
      "  - Local/deployment CLI only. No HTTP bootstrap endpoint exists.",
      "  - Password is read from stdin (--password-stdin) or GAUTH_BOOTSTRAP_ADMIN_PASSWORD env var.",
    ].join("\n")
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return;
  }

  const email = args.email || process.env.GAUTH_BOOTSTRAP_ADMIN_EMAIL;
  const name = args.name || process.env.GAUTH_BOOTSTRAP_ADMIN_NAME;
  const password = args.passwordStdin
    ? await readStdinLine()
    : process.env.GAUTH_BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !password) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const result = await bootstrapAdmin({
    email,
    password,
    name,
    allowExistingUpdate: args.allowExistingUpdate,
  });

  console.log(
    JSON.stringify({
      ok: true,
      action: result.created ? "created" : "updated",
      id: result.user.id,
      email: result.user.email,
      role: result.user.role,
    })
  );
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
