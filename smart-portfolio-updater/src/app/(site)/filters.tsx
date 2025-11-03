"use client"

import { clear } from "console";
import { init } from "next/dist/compiled/webpack/webpack";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Filters({ initialTag = "", initialQ = ""}: { initialTag?: string; initialQ?: string}) {
    const [tag, setTag] = useState(initialTag);
    const [q, setQ] = useState(initialQ);
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    useEffect(() => {
        setTag(initialTag);
        setQ(initialQ);
    }, [initialTag, initialQ]);

    function apply() {
        const sp = new URLSearchParams(params.toString());
        if (tag) sp.set("tag", tag); else sp.delete("tag");
        if (q) sp.set("q", q); else sp.delete("q");
        router.push(`${pathname}?${sp.toString()}`);
    }

    function clearAll() {
        router.push(pathname);
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <input
                className="w-40 rounded-lg border px-3 py-2 text-sm"
                placeholder="Filter tag (e.g., github)"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
            />
            <input
                className="flex-1 min-w-[12rem] rounded-lg border px-3 py-2 text-sm"
                placeholder="Search text..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <button onClick={apply} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-100">
                Apply
            </button>
            <button onClick={clearAll} className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-100">
                Clear
            </button>
        </div>
    );
}

