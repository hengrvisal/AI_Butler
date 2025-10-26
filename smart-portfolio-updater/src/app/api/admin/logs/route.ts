import { db } from "@/lib/db";

export async function GET() {
    const logs = await db.runLog.findMany({
        orderBy: { startedAt: "desc" },
        take: 20,
    });

    return new Response(JSON.stringify(logs), {
        headers: { "content-type": "application/json" },
    });
}
