import { db } from '@/lib/db';

export async function POST() {
    const h = await db.highlight.create({
        data: {
            title: 'Initial wiring complete',
            summaryMd: '- set up next.js + prisma; DB migrations working',
            url: null,
            tags: ['setup', 'db'],  // prisma will serialize to JSON for SQLite
            rawRefs: {note: 'seed'}
        }
    });

    return new Response(JSON.stringify(h), { headers: {'content-type': 'application/json '}})
}


export async function GET() {
    const highlights = await db.highlight.findMany({ orderBy: {date: 'desc' } });
    return new Response(JSON.stringify(highlights), { headers: { 'content-type': 'application/json '}})
}

