import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPEN_API_KEY! });

type summarizeInput = Array<{ repo: string; message: string; url?: string }>;

export async function summarizeCommits(items: summarizeInput): Promise<string> {
    if (!items.length) return "";

    const list = items
        .map((x, i) => `[${i + 1}] (${x.repo}) ${x.message}${x.url ? ` - ${x.url}` : ""}`)
        .join("\n");

    const system = `You turn raw commit messages into concise, resume-ready bullets.
    Rules:
    - 3 to 6 bullets.
    - Action + impact. Prefer measuable outcomes (speed, accuracy, reliability).
    - Merge related commits into one bullet when possible.
    - Keep it tight (~1 line each). Markdown list with "- " prefix.
    - Include at most one line per bullet if clearly useful.`;

    const user = `Commits to summar:\n${list}`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
            { role: "system", content: system },
            { role: "user", content: user},
        ],
    });

    return resp.output_text.trim();
}