import { db } from "@/lib/db";
import RunNowButton from "./run-now-button";

export default async function AdminPage() {
    const logs = await db.runLog.findMany({
        orderBy: { startedAt: "desc" },
        take: 10,
    });

    return (
        <main className="mx-auto max-w-3xl p-8 space-y-6">
            <h1 className="text-3xl font-bold">Admin</h1>
            <RunNowButton />

            <section>
                <h2 className="text-x1 font-semibold mb-2">Recent Runs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left border-b">
                            <tr>
                                <th className="py-2">Started</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">In</th>
                                <th className="py-2">Out</th>
                                <th className="py-2">Finished</th>
                                <th className="py-2">Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((l) => (
                                <tr key={l.id} className="border-b">
                                    <td className="py-2">{new Date(l.startedAt).toLocaleDateString()}</td>
                                    <td className="py-2">{l.status}</td>
                                    <td className="py-2">{l.itemsIn}</td>
                                    <td className="py-2">{l.itemsOut}</td>
                                    <td className="py-2">
                                        {l.finishedAt ? new Date(l.finishedAt).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="py-2">{l.error ?? "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}