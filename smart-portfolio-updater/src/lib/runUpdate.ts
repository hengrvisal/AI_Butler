// src/lib/runUpdate.ts
import { db } from "@/lib/db";
import { ingestGithub } from "./ingestGithub";

export async function runUpdateJob(runId: string) {
  const res = await ingestGithub(); // { count, newestISO }

  await db.runLog.update({
    where: { id: runId },
    data: {
      itemsIn: res.count,
      itemsOut: res.count,
      status: "success",
      finishedAt: new Date(),
    },
  });

  return res; // surfaces { count, newestISO } to /api/admin/run response
}
