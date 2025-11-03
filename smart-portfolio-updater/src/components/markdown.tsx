"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function Markdown({ children }: { children: string }) {
    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={{
                    a: ({node, ...props}) => (
                        <a {...props} className="underline underline-offset-4 hover:opacity-80" />
                    ),
                    li: ({node, ...props}) => <li {...props} className="my-1" />,
                    code: ({node, inline, ...props})=>
                        inline ? (
                            <code {...props} className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800" />
                        ) : (
                            <code {...props} />
                        ),
                }}
                >
                    {children}
                </ReactMarkdown>
        </div>
    );
}