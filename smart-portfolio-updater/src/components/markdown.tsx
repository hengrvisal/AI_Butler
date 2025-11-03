"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";

// Local prop type for the <code> renderer
type CodeProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const Code = ({ inline, className, children, ...props }: CodeProps) => {
  if (inline) {
    return (
      <code {...props} className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
        {children}
      </code>
    );
  }
  return (
    <pre className={className}>
      <code {...props}>{children}</code>
    </pre>
  );
};

const mdComponents: Components = {
  a(props) {
    return <a {...props} className="underline underline-offset-4 hover:opacity-80" />;
  },
  li(props) {
    return <li {...props} className="my-1" />;
  },
  // ✅ Properly typed without importing internal react-markdown modules
  code: Code as unknown as Components["code"],
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={mdComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
