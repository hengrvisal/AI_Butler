// src/lib/runUpdate.ts
import { db } from "@/lib/db";
import { ingestGithub } from "./ingestGithub";

export async function runUpdateJob(runId: string) {
  let itemsIn = 0;
  let itemsOut = 0;

  // 1) Ingest GitHub commits
  try {
    const res = await ingestGithub();
    itemsIn += res.count;   // “in” = raw units fetched (here equal to inserted)
    itemsOut += res.count;  // “out” = highlights written (same for now)
  } catch (e) {
    // If GitHub fails, we still want the run to continue (you can choose to fail-fast instead)
    console.error("GitHub ingest failed:", e);
  }

  // (Optional) 2) Ingest Notion next — coming in the next step.

  // Update run log
  await db.runLog.update({
    where: { id: runId },
    data: {
      itemsIn,
      itemsOut,
      status: "success",
      finishedAt: new Date(),
    },
  });

  return { itemsIn, itemsOut };
}
