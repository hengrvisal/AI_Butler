import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runUpdateJob } from "@/lib/runUpdate";

// Optional: basic run lock to avoid overlapping jobs
async function isRunInProgress() {
  const since = new Date(Date.now() - 15 * 60 * 1000);
  const running = await db.runLog.findFirst({
    where: { status: "running", startedAt: { gte: since }},
    select: { id: true },
  });
  return !!running;
}

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("x-cron-secret");

  if (!secret || header !== secret) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (await isRunInProgress()) {
    return NextResponse.json({ ok: false, error: "run already in progress" }, { status: 429 });
  }

  const run = await db.runLog.create({
    data: { status: "running", itemsIn: 0, itemsOut: 0 },
  });

  try {
    const res = await runUpdateJob(run.id);
    return NextResponse.json({ ok: true, runId: run.id, ...res }, { status: 200 });
  } catch (e: any) {
    await db.runLog.update({
      where: { id: run.id },
      data: { status: "error", error: String(e), finishedAt: new Date() },
    });
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  // Optional quick health check
  return NextResponse.json({ ok: true, route: "/api/cron/run" });
}
