import { db } from "@/lib/db";

/**
 * minimal placeholdr for the update pipeline
 * planned work:
 *  - fetch GitHub commits since cursor
 *  - fetch Notion updates since cursor
 *  - summarize with OpenAI
 *  - write Highlights and move cursors
 */

export async function runUpdateJob(runId: string) {
    // demo
    const highlight = await db.highlight.create({
        data: {
            title: "manual run executed",
            summaryMd: "- created by manual run (MVP). GitHub/Notion wiring next",
            url: null,
            tags: ["manual", "seed"] as unknown as any,
            rawRefs: { source: "manual" } as unknown as any,
        },
    });

    // can implement count real items later
    const itemsIn = 1;
    const itemsOut = 1;

    await db.runLog.update({
        where: {id: runId },
        data: {
            itemsIn,
            itemsOut,
            status: "success",
            finishedAt: new Date(),
        },
    });

    return { itemsIn, itemsOut, highlightId: highlight.id };
}