import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const row = await db.sourceCursor.findUnique({ where: { source: "github" }});
  return NextResponse.json({ cursor: row?.cursor ?? null });
}

export async function POST() {
  // set cursor far in the past so the next run fetches everything
  const old = "2000-01-01T00:00:00.000Z";
  const row = await db.sourceCursor.upsert({
    where: { source: "github" },
    create: { source: "github", cursor: old },
    update: { cursor: old },
  });
  return NextResponse.json({ ok: true, cursor: row.cursor });
}
