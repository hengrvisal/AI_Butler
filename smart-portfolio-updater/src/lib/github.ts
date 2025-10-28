type CommitLite = {
    sha: string;
    message: string;
    authorDate: string; //ISO
    htmlUrl: string;
    repo: string;
};

export async function fetchCommitSince(
    ownerRepo: string,
    sinceISO: string,
    token: string
): Promise<CommitLite[]> {
    const [owner, repo] = ownerRepo.split("/");
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/commits`);
    url.searchParams.set("since", sinceISO);
    url.searchParams.set("per_page", "100"); // github max is 100

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "User-Agent": "smart-portfolio-updater",
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
        // next.js avoid caching for API calls
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`GitHub ${ownerRepo} ${res.status}: ${body.slice(0,200)}`);
    }

    const json = (await res.json()) as Array<{
        sha: string;
        commit: {message: string; author?: { date: string } };
        html_url: string;
    }>;

    return json.map((c) => ({
        sha: c.sha,
        message: c.commit?.message ?? "",
        authorDate: c.commit?.author?.date ?? "",
        htmlUrl: c.html_url,
        repo: ownerRepo,
    }));
}