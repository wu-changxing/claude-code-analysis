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
  VscCode,
  VscFile,
  VscTerminalBash,
  VscTools,
} from "react-icons/vsc";
import {
  HiOutlineArrowRight,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

const STATS = [
  {
    label: "Lines of Code",
    value: "512K",
    color: "var(--accent)",
    icon: VscCode,
    sub: "3x Linux 1.0 kernel",
  },
  {
    label: "Source Files",
    value: "1,884",
    color: "var(--green)",
    icon: VscFile,
    sub: ".ts and .tsx files",
  },
  {
    label: "Slash Commands",
    value: "101",
    color: "var(--orange)",
    icon: VscTerminalBash,
    sub: "From /compact to /stickers",
  },
  {
    label: "Built-in Tools",
    value: "43",
    color: "var(--purple)",
    icon: VscTools,
    sub: "Bash, Edit, Agent, MCP...",
  },
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
    desc: "43 built-in tools \u2014 Bash, FileEdit, Agent, MCP, and more",
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

const FLOW_STEPS = [
  {
    icon: HiOutlineCommandLine,
    label: "User Input",
    detail: "Prompt + attachments",
  },
  {
    icon: HiOutlineCpuChip,
    label: "API Stream",
    detail: "Text + tool_use blocks",
  },
  {
    icon: VscExtensions,
    label: "Tool Execution",
    detail: "Read=parallel, Write=serial",
  },
  {
    icon: HiOutlineShieldCheck,
    label: "Permission Check",
    detail: "5-layer security gate",
  },
];

export default function HomePage() {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-text-primary flex items-center justify-center text-bg-primary font-bold text-xl shrink-0 shadow-sm">
            CC
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Claude Code Analysis</h1>
            <p className="text-text-secondary text-sm">
              Deep dive into the internals of{" "}
              <code className="text-accent text-sm bg-bg-secondary px-1.5 py-0.5 rounded border border-border">
                @anthropic-ai/claude-code
              </code>{" "}
              v2.1.88
            </p>
          </div>
        </div>
        <p className="text-text-muted text-xs ml-[72px]">
          Source extracted from{" "}
          <code className="text-xs">cli.js.map</code> of the npm package.
          TypeScript, Ink-based terminal UI, codename <strong>Tengu</strong>.
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
            className="bg-bg-secondary border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-[11px] text-text-muted uppercase tracking-wider font-medium">
                {s.label}
              </span>
            </div>
            <div
              className="text-3xl font-bold font-mono tracking-tight"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[11px] text-text-muted mt-1">{s.sub}</div>
          </div>
        ))}
      </motion.div>

      {/* Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-bg-secondary border border-border rounded-xl p-6 mb-10"
      >
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-5">
          Core Execution Loop
        </h2>
        <div className="flex items-center justify-between">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-bg-primary border border-border flex items-center justify-center mb-2 shadow-sm">
                  <step.icon className="w-5 h-5 text-text-primary" />
                </div>
                <span className="text-xs font-medium text-text-primary">
                  {step.label}
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">
                  {step.detail}
                </span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <HiOutlineArrowRight className="w-4 h-4 text-text-muted mx-2 shrink-0" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-primary border border-border text-[11px] text-text-muted">
            <VscServerProcess className="w-3 h-3" />
            Loop until no more tool calls or exit condition
          </div>
        </div>
      </motion.div>

      {/* Section Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Explore
        </h2>
      </motion.div>
      <div className="grid grid-cols-3 gap-3">
        {SECTIONS.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 + i * 0.03 }}
          >
            <Link href={s.href} className="block group">
              <div className="bg-bg-secondary border border-border rounded-xl p-4 hover:border-accent/30 hover:shadow-sm transition-all h-full">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}
                >
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <h2 className="text-sm font-semibold mb-1 group-hover:text-accent transition-colors">
                  {s.title}
                </h2>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Key Innovations */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-10 grid grid-cols-3 gap-3"
      >
        {[
          {
            title: "Streaming Tool Execution",
            desc: "Tools start executing while the model is still generating tokens. StreamingToolExecutor queues tool_use blocks as they arrive.",
            color: "var(--green)",
          },
          {
            title: "Zero-Cost Cache Sharing",
            desc: "CacheSafeParams frozen at fork time. Identical system prompt bytes = automatic prompt cache hit for subagents.",
            color: "var(--accent)",
          },
          {
            title: "Multi-Level Compaction",
            desc: "4 strategies (micro, auto, snip, collapse) keep conversations within token limits. Enables unlimited session length.",
            color: "var(--purple)",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl border border-border bg-bg-secondary"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: item.color }}
              />
              <h3 className="text-xs font-semibold text-text-primary">
                {item.title}
              </h3>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
