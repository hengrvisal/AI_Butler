import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export default async function Home() {
  const highlights = await db.highlight.findMany({ orderBy: {date: 'desc' }, take: 10 });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">Smart Resume/Portfolio Updater</h1>
      <p className="mt-2 text-muted-foreground">
        MVP scaffold is running. We will add Highlights, Cron, GitHub/Notion next.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Latest Highlights</h2>
      <ul className="space-y-3">
        {highlights.map(h => (
          <li key={h.id} className="prose">
            <div className="font-medium">{h.title}</div>
            <div dangerouslySetInnerHTML={{ __html: h.summaryMd.replace(/\n/g, '<br/>') }} />
          </li>
        ))}
      </ul>
    </main>
  )
}