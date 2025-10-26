import { db } from "@/lib/db";
import { runUpdateJob } from "@/lib/runUpdate";
import { json } from "stream/consumers";

export async function POST() {
    // in production, add auth/role checks here
    const run = await db.runLog.create({
        data: { status: "running", itemsIn: 0, itemsOut: 0 },
    });

    try {
        const result = await runUpdateJob(run.id);
        return new Response(JSON.stringify({ ok: true, runId: run.id, ...result }), {
            headers: { "content-type": "application/json" },
            status: 200,
        });
    } catch (e: any) {
        await db.runLog.update({
            where: { id: run.id },
            data: { status: "error", error: String(e), finishedAt: new Date() },
        });
        return new Response(JSON.stringify({ ok: false, error: String(e) }), {
            headers: { "content-type": "application/json" },
            status: 500,
        });
    }
}