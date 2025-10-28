import { db } from "@/lib/db";
import { fetchCommitSince } from "./github";

function envOrThrow(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}


// a small heuristic to turn commit messages into a short title
function titleFromMessage(msg: string) {
    const first = msg.split("\n")[0].trim();
    return first.slice(0, 90);
}

export async function ingestGithub(): Promise<{count:number, newestISO?: string}> {
    const token = envOrThrow("GITHUB_TOKEN");
    const reposCsv = envOrThrow("GITHUB_REPOS");

    const repos = reposCsv.split(",").map(s => s.trim()).filter(Boolean);
    if (repos.length === 0) return {count: 0};

    // Get or create cursor
    const DEFAULT_SINCE = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(); // 30 days
    const cursorRow = await db.sourceCursor.upsert({
        where: { source: "github" },
        create: { source: "github", cursor: DEFAULT_SINCE },
        update: {},
    });

    const sinceISO = cursorRow.cursor;

    // fetch all commits since cursor across repos
    const allCommitsArrays = await Promise.all(
        repos.map(r => fetchCommitSince(r, sinceISO, token))
    );
    const commits = allCommitsArrays.flat();

    if (commits.length === 0) return { count: 0 };

    // sort by author date desc
    commits.sort((a, b) => new Date(b.authorDate).getTime() - new Date(a.authorDate).getTime());

    // insert highlights (simple 1:1 - we will do OpenAI summarization later)
    // avoid dupes by sha+repo (simple check)
    let saved = 0
    for (const c of commits) {
        const exists = await db.highlight.findFirst({
            where: { url: c.htmlUrl },
            select: { id: true },
        });
        if (exists) continue;

        await db.highlight.create({
            data: {
                date: new Date(c.authorDate || Date.now()),
                title: titleFromMessage(c.message) || "Commit",
                summaryMd: `-${c.message}\n\n[View commit](${c.htmlUrl})`,
                url: c.htmlUrl,
                tags: ["github"] as unknown as any,
                rawRefs: { sha: c.sha, repo: c.repo } as unknown as any,
            },
        });
        saved++;
    }

    const newestISO = commits[0]?.authorDate || undefined;
    if (newestISO) {
        await db.sourceCursor.update({
            where: { source: "github" },
            data: { cursor: newestISO },
        });
    }

    return { count: saved, newestISO };
}