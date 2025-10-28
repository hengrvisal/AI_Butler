import { db } from "@/lib/db";
import { ingestGithub } from "./ingestGithub";
import { summarizeCommits } from "./summarize";

export async function runUpdateJob(runId: string) {
  let itemsIn = 0;
  let itemsOut = 0;

  // 1) Ingest GitHub
  const gh = await ingestGithub(); // { count, items, newestISO }
  itemsIn += gh.count;
  itemsOut += gh.count;

  // 2) Summarize (only if we saw anything new)
  if (gh.items.length > 0) {
    const summaryMd = await summarizeCommits(
      gh.items.slice(0, 40).map(i => ({ repo: i.repo, message: i.message, url: i.htmlUrl }))
    );

    if (summaryMd) {
      await db.highlight.create({
        data: {
          date: new Date(),
          title: "GitHub Highlights (auto-summarized)",
          summaryMd, // already Markdown list
          url: null,
          tags: ["github", "summary"] as unknown as any,
          rawRefs: { count: gh.items.length, newestISO: gh.newestISO } as unknown as any,
        },
      });
      itemsOut += 1; // one more “output” item for the summary
    }
  }

  await db.runLog.update({
    where: { id: runId },
    data: { itemsIn, itemsOut, status: "success", finishedAt: new Date() },
  });

  return { itemsIn, itemsOut };
}
