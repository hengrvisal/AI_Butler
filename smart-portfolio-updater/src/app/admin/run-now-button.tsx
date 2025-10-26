"use client";

import { use, useState } from "react";

export default function RunNowButton() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    async function runNow() {
        setLoading(true);
        setMsg(null);
        try {
            const res = await fetch("/api/admin/run", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Run failed");
            setMsg(`Run OK - itemsIn=${data.itemsIn}, itemsOut=${data.itemsOut}`);
            // refresh the page data (Next.js 15: use a client side reload)
            window.location.reload();
        } catch (e: any) {
            setMsg(`Error: ${e.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={runNow}
                disabled={loading}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-50"
                >
                    {loading ? "Running..." : "Run Update Now"}
                </button>
                {msg && <span className="text-sm text-neutral-600">{msg}</span>}
        </div>
    );
}