/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Callout } from "./callout";
import { CodeBlock } from "./code-block";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { CalloutType } from "./types";
import type {PluggableList} from '@/node_modules/react-markdown/lib/react-markdown.d.ts';

interface CustomMarkdownProps {
  content: string;
  className?: string;
}

export function CustomMarkdown({ content, className }: CustomMarkdownProps) {
  return (
    <div
      className={cn(
        // Base styles
        "prose dark:prose-invert max-w-none",
        // Headings
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h1:font-extrabold prose-h1:mb-4",
        "prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4",
        "prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3",
        // Paragraphs and lists
        "prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-7 prose-p:mb-4",
        "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
        "prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6",
        "prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-li:mb-2",
        // Blockquotes
        "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700",
        "prose-blockquote:pl-4 prose-blockquote:py-1 prose-blockquote:italic prose-blockquote:my-6",
        // Code blocks
        "prose-code:text-sm prose-code:font-medium",
        "prose-code:before:content-none prose-code:after:content-none",
        // Inline code
        "[&_:not(pre)>code]:bg-gray-100 [&_:not(pre)>code]:dark:bg-gray-800",
        "[&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5",
        "[&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:font-mono",
        // Pre (code blocks)
        "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800",
        "prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6",
        "prose-pre:overflow-x-auto prose-pre:font-mono",
        // Strong, links and other elements
        "prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100",
        "prose-a:text-blue-500 prose-a:font-medium prose-a:underline",
        "prose-a:underline-offset-4 hover:prose-a:text-blue-600",
        "prose-img:rounded-lg prose-img:my-8",
        // Tables
        "prose-table:my-6 prose-table:w-full prose-table:border-collapse",
        "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700",
        "prose-th:px-4 prose-th:py-2 prose-th:text-left",
        "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700",
        "prose-td:px-4 prose-td:py-2",
        className
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex] as PluggableList}
        components={{
          h1: ({ children }) => (
            <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-bold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-600 dark:text-gray-300">{children}</li>
          ),
          p: ({ children }) => (
            <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-6 border-l-4 border-gray-300 pl-6 italic dark:border-gray-700">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-800 dark:bg-gray-800">
              {children}
            </pre>
          ),
          // Add custom link styling
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-blue-500 underline underline-offset-4 hover:text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Add custom table styling
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language) {
              return (
                <CodeBlock
                  language={language}
                  value={String(children).replace(/\n$/, "")}
                />
              );
            }

            return (
              <code
                className={cn(
                  "relative rounded bg-gray-100 px-[0.3rem] py-[0.2rem] font-mono text-sm dark:bg-gray-800",
                  className
                )}
                {...props}
              >
                {children}
              </code>
            );
          },

          // Custom callout handling
          div: ({ node, className, children, ...props }) => {
            if (className?.includes("callout-")) {
              const type = className.replace("callout-", "") as CalloutType;
              return (
                <Callout type={type} {...props}>
                  {children}
                </Callout>
              );
            }
            return (
              <div className={className} {...props}>
                {children}
              </div>
            );
          },

          // Table improvements
          table: ({ children }) => (
            <div className="my-6 w-full overflow-y-auto rounded-lg border dark:border-gray-700">
              <table className="w-full border-collapse text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-gray-200 bg-gray-100 px-4 py-2 text-left font-medium dark:border-gray-700 dark:bg-gray-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-gray-200 px-4 py-2 dark:border-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
