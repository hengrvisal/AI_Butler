import Markdown from "@/components/markdown";
import { fmtDate, toStrTags } from "@/lib/format";

type Highlight = {
    id: string;
    title: string;
    summaryMd: string;
    url: string | null;
    tags: any | null; // Json in Prisma
    date: string | Date;
};

export default function HighlightCard({ h }: {h: Highlight }) {
    const tags = toStrTags(h.tags);

    return (
        <article className="rounded-2xl border p-4 shadow-sm hover:shadow transition">
            <header className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold leading-snug">
                    {h.title}
                </h3>
                {h.url && (
                    <a
                        href={h.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 rounded border hover:bg-neutral-100"
                    >
                        Link
                    </a>
                )}
            </header>

            <div className="mt-2">
                <Markdown>{h.summaryMd}</Markdown>
            </div>

            <footer className="mt-3 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
                <span>{fmtDate(h.date)}</span>
                <span className="mx-1"></span>
                <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="rounded-full border px-2 py-0.5 text-xs bg-white"
                        >
                            #{t}
                        </span>
                    ))}
                </div>
            </footer>
        </article>
    );
}