import "server-only";

import { prisma } from "@/lib/prisma";

// TrxIDs from this list that appear on more than one order, in upper case.
export async function findDuplicateTrxIds(trxIds: string[]) {
  if (trxIds.length === 0) return new Set<string>();

  const matches = await prisma.order.findMany({
    where: {
      OR: trxIds.map((trxId) => ({
        TrxID: { equals: trxId, mode: "insensitive" as const },
      })),
    },
    select: { TrxID: true },
  });

  const counts = new Map<string, number>();
  matches.forEach(({ TrxID }) => {
    const key = TrxID!.toUpperCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return new Set(
    [...counts].filter(([, count]) => count > 1).map(([trxId]) => trxId),
  );
}
