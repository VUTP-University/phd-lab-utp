import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRenderer({ children }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        // Code block highlighting
        code({ node, inline, className, children: codeChildren, ...props }) {
          const match = /language-(\w+)/.exec(className || "");

          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              language={match[1]}
              {...props}
            >
              {String(codeChildren).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-100 px-1 py-[2px] rounded text-sm" {...props}>
              {codeChildren}
            </code>
          );
        },

        // Optional: wrap paragraphs with Tailwind typography spacing
        p({ node, children, ...props }) {
          return (
            <p className="mb-4" {...props}>
              {children}
            </p>
          );
        },

        // Optional: add Tailwind classes for headings
        h1({ node, children, ...props }) {
          return (
            <h1 className="text-3xl font-bold mb-4 mt-8" {...props}>
              {children}
            </h1>
          );
        },
        h2({ node, children, ...props }) {
          return (
            <h2 className="text-2xl font-semibold mb-3 mt-6" {...props}>
              {children}
            </h2>
          );
        },
        h3({ node, children, ...props }) {
          return (
            <h3 className="text-xl font-semibold mb-2 mt-4" {...props}>
              {children}
            </h3>
          );
        },

        // Optional: lists spacing
        ul({ node, children, ...props }) {
          return <ul className="list-disc ml-6 mb-4">{children}</ul>;
        },
        ol({ node, children, ...props }) {
          return <ol className="list-decimal ml-6 mb-4">{children}</ol>;
        },
        li({ node, children, ...props }) {
          return <li className="mb-1">{children}</li>;
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}