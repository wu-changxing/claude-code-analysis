"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  VscSymbolStructure,
  VscServerProcess,
  VscExtensions,
  VscLock,
  VscGitMerge,
  VscDatabase,
  VscFolderOpened,
  VscTerminal,
  VscHeart,
} from "react-icons/vsc";

const STATS = [
  { label: "Lines of Code", value: "512K", color: "var(--accent)" },
  { label: "Source Files", value: "1,884", color: "var(--green)" },
  { label: "Slash Commands", value: "101", color: "var(--orange)" },
  { label: "Built-in Tools", value: "43", color: "var(--purple)" },
];

const SECTIONS = [
  {
    href: "/architecture",
    icon: VscSymbolStructure,
    title: "Architecture",
    desc: "High-level system design, directory map, and how all pieces fit together",
    color: "var(--accent)",
  },
  {
    href: "/query-loop",
    icon: VscServerProcess,
    title: "Query Loop",
    desc: "The core agentic cycle: message \u2192 API \u2192 tool calls \u2192 results \u2192 repeat",
    color: "var(--green)",
  },
  {
    href: "/tools",
    icon: VscExtensions,
    title: "Tools",
    desc: "50+ built-in tools \u2014 Bash, FileEdit, Agent, MCP, and more",
    color: "var(--orange)",
  },
  {
    href: "/permissions",
    icon: VscLock,
    title: "Permissions",
    desc: "5-layer security: validation, rules, ML classifier, hooks, user UI",
    color: "var(--red)",
  },
  {
    href: "/agents",
    icon: VscGitMerge,
    title: "Agents",
    desc: "Subagent spawning, cache sharing, worktree isolation, coordinator mode",
    color: "var(--purple)",
  },
  {
    href: "/services",
    icon: VscDatabase,
    title: "Services",
    desc: "Compaction, MCP, LSP, analytics, memory extraction, and more",
    color: "var(--pink)",
  },
  {
    href: "/context",
    icon: VscFolderOpened,
    title: "Context & Memory",
    desc: "System prompt construction, CLAUDE.md, auto-memory, session memory",
    color: "var(--accent)",
  },
  {
    href: "/file-map",
    icon: VscTerminal,
    title: "File Map",
    desc: "Complete directory structure with key files and their purposes",
    color: "var(--green)",
  },
  {
    href: "/fun-facts",
    icon: VscHeart,
    title: "Fun Facts",
    desc: "Easter eggs, buddy pets, the yoloClassifier, and 48-character function names",
    color: "var(--pink)",
  },
];

export default function HomePage() {
  return (
    <div className="p-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold mb-2">Claude Code Analysis</h1>
        <p className="text-text-secondary mb-1">
          Deep dive into the internals of{" "}
          <code className="text-accent text-sm bg-bg-secondary px-1.5 py-0.5 rounded">
            @anthropic-ai/claude-code
          </code>{" "}
          v2.1.88
        </p>
        <p className="text-text-muted text-sm mb-8">
          Source extracted from <code className="text-xs">cli.js.map</code> of
          the npm package. TypeScript, ~1800 files, Ink-based terminal UI.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4 mb-10"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-bg-secondary border border-border rounded-lg p-4"
          >
            <div
              className="text-2xl font-bold font-mono"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-xs text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Section Grid */}
      <div className="grid grid-cols-2 gap-4">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
          >
            <Link href={s.href} className="block group">
              <div className="bg-bg-secondary border border-border rounded-lg p-5 hover:border-accent/40 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  <h2 className="text-sm font-semibold group-hover:text-accent transition-colors">
                    {s.title}
                  </h2>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 bg-bg-secondary border border-border rounded-lg p-6"
      >
        <h2 className="text-sm font-semibold mb-4">
          How Claude Code Works (TL;DR)
        </h2>
        <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
          <p>
            Claude Code is a{" "}
            <strong className="text-text-primary">
              terminal-based AI coding assistant
            </strong>{" "}
            built with TypeScript and Ink (React for CLI). It runs an{" "}
            <strong className="text-text-primary">
              async generator state machine
            </strong>{" "}
            that loops:
          </p>
          <pre className="!text-xs !p-4">
            {`User Input \u2192 System Prompt Assembly \u2192 API Stream
    \u2193
Model Response (text + tool_use blocks)
    \u2193
Tool Execution (read=parallel, write=serial)
    \u2193
Results \u2192 Continue if tools called, else done`}
          </pre>
          <p>
            Key innovations:{" "}
            <strong className="text-text-primary">
              streaming tool execution
            </strong>{" "}
            (tools start while model still generates),{" "}
            <strong className="text-text-primary">
              zero-cost cache sharing
            </strong>{" "}
            for subagents,{" "}
            <strong className="text-text-primary">
              multi-level compaction
            </strong>{" "}
            for unlimited conversations, and a{" "}
            <strong className="text-text-primary">
              5-layer permission system
            </strong>{" "}
            with ML classifier.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
