import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const hasToken = !!process.env.GITHUB_TOKEN;
  const repos = (process.env.GITHUB_REPOS || "").split(",").map(s=>s.trim()).filter(Boolean);

  const cur = await db.sourceCursor.findUnique({ where: { source: "github" }});
  return NextResponse.json({
    ok: true,
    hasToken,
    repos,
    cursor: cur?.cursor ?? null,
  });
}
