import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { LangProvider } from "@/lib/LangContext";

export const metadata: Metadata = {
  title: "Claude Code Analysis | Deep Dive into Claude Code Architecture",
  description:
    "Interactive analysis of Claude Code v2.1.88 — 512K lines of TypeScript, 43 tools, 101 commands. Explore the query loop, permission system, agent architecture, MCP integration, and hidden easter eggs.",
  keywords: [
    "claude code",
    "claude code architecture",
    "anthropic",
    "ai coding assistant",
    "claude code source",
    "claude code analysis",
    "claude code tools",
    "claude code internals",
    "tengu",
    "mcp protocol",
    "agent framework",
  ],
  openGraph: {
    title: "Claude Code Analysis — 512K Lines of TypeScript Decoded",
    description:
      "Deep dive into Claude Code's internals: query loop, 43 tools, 5-layer permissions, agent system, MCP integration, and delightful easter eggs.",
    url: "https://cc.openonion.ai",
    siteName: "Claude Code Analysis",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code Analysis — 512K Lines Decoded",
    description:
      "Interactive analysis of Claude Code's architecture, tools, and hidden easter eggs.",
  },
  alternates: {
    canonical: "https://cc.openonion.ai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg-primary text-text-primary">
        <LangProvider>
          <Sidebar />
          <main className="min-h-screen min-w-0 pt-16 md:ml-64 md:pt-0">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
