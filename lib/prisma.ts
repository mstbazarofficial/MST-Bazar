import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Plain TCP Postgres driver: works with Neon today and with a local
// Postgres on the VPS later; only DATABASE_URL changes.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 5,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Reuse one client across hot reloads in dev so the pool is not recreated.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
