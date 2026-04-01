import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { LangProvider } from "@/lib/LangContext";
import { coerceLang, LANG_COOKIE_KEY } from "@/lib/i18n";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = coerceLang(cookieStore.get(LANG_COOKIE_KEY)?.value);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-bg-primary text-text-primary">
        <LangProvider initialLang={initialLang}>
          <Sidebar />
          <main className="min-h-screen min-w-0 pt-16 lg:ml-64 lg:pt-0">
            {children}
          </main>
        </LangProvider>
      </body>
    </html>
  );
}
