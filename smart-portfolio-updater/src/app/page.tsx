// src/app/page.tsx
import { db } from "@/lib/db";
import type { Highlight } from "@prisma/client";  // ✅ add this
import HighlightCard from "@/components/highlight-card";
import Filters from "./(site)/filters";

export default async function Home({ searchParams }: { searchParams: Promise<{ tag?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const tag = (sp?.tag ?? "").trim();
  const q = (sp?.q ?? "").trim();
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10) || 1);
  const PAGE_SIZE = 10;

  // ✅ type the result so .filter infers `h: Highlight`
  const all: Highlight[] = await db.highlight.findMany({
    orderBy: { date: "desc" },
    take: 200,
  });

  // if you have a helper to parse JSON tags, you can import it; otherwise inline:
  const filtered = all
    .filter((h: Highlight) => {                     // ✅ annotate param or rely on all: Highlight[]
      if (!tag) return true;
      try {
        const tags = Array.isArray(h.tags) ? h.tags.map(String) : [];
        return tags.includes(tag);
      } catch {
        return false;
      }
    })
    .filter((h: Highlight) => {
      if (!q) return true;
      const blob = `${h.title}\n${h.summaryMd}`.toLowerCase();
      return blob.includes(q.toLowerCase());
    });

  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Smart Resume/Portfolio Updater</h1>
        <p className="text-neutral-600">
          Auto-aggregated highlights from GitHub (and more soon).
        </p>
      </header>

      <Filters initialTag={tag} initialQ={q} />

      {items.length === 0 ? (
        <div className="rounded-xl border p-6 text-neutral-600">
          No highlights match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((h) => (
            <HighlightCard key={h.id} h={h as any} />
          ))}
        </div>
      )}

      <nav className="flex items-center justify-between pt-4">
        <span className="text-sm text-neutral-600">
          Showing {total === 0 ? 0 : start + 1}–
          {Math.min(total, start + PAGE_SIZE)} of {total}
        </span>
        <div className="flex gap-2">
          <a
            className={`rounded-md border px-3 py-1.5 text-sm ${
              page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-neutral-100"
            }`}
            href={`/?${new URLSearchParams({
              ...(tag && { tag }),
              ...(q && { q }),
              page: String(page - 1),
            }).toString()}`}
          >
            Prev
          </a>
          <a
            className={`rounded-md border px-3 py-1.5 text-sm ${
              start + PAGE_SIZE >= total
                ? "pointer-events-none opacity-50"
                : "hover:bg-neutral-100"
            }`}
            href={`/?${new URLSearchParams({
              ...(tag && { tag }),
              ...(q && { q }),
              page: String(page + 1),
            }).toString()}`}
          >
            Next
          </a>
        </div>
      </nav>
    </main>
  );
}
