import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
    const adapter = new PrismaPg({ connectionString: rawUrl });
    return new PrismaClient({ adapter });
  }

  const filePath = rawUrl.startsWith("file:")
    ? path.resolve(/*turbopackIgnore: true*/ process.cwd(), rawUrl.replace(/^file:/, ""))
    : path.resolve(/*turbopackIgnore: true*/ process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${filePath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
