"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import {
  VscCode,
  VscExtensions,
  VscTerminalBash,
  VscServerProcess,
  VscDatabase,
  VscShield,
  VscSymbolStructure,
} from "react-icons/vsc";

export default function ArchitecturePage() {
  const tx = useTx();
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title={tx("Architecture", "系统架构")}
        description={tx(
          "High-level system design of Claude Code — how the TypeScript monolith is organized, key abstractions, and the data flow between components.",
          "Claude Code 的高层系统设计 — TypeScript 单体应用的组织方式、核心抽象和组件间的数据流。"
        )}
        badge="~1800 files"
      />

      {/* Directory Map */}
      <Card title="Directory Structure" className="mb-6">
        <CodeBlock
          code={`src/
├── entrypoints/       # CLI & SDK entry points
│   ├── cli.tsx        # Bootstrap, fast-path (--version, daemon)
│   └── sdk/           # Programmatic API for headless use
├── QueryEngine.ts     # Query lifecycle, message buffering
├── query.ts           # Main agentic loop state machine (~1700 lines)
├── Tool.ts            # Tool interface, ToolUseContext, buildTool()
├── Task.ts            # Task abstraction
│
├── tools/             # 50+ tool implementations
│   ├── BashTool/      # Command execution + security (300KB!)
│   ├── FileEditTool/  # String find/replace with diff
│   ├── FileReadTool/  # Read with PDF/notebook/image support
│   ├── AgentTool/     # Subagent spawning + isolation
│   ├── SkillTool/     # User-defined prompt templates
│   ├── MCPTool/       # External tool proxy (MCP protocol)
│   ├── GrepTool/      # Ripgrep-based search
│   ├── GlobTool/      # File pattern matching
│   └── shared/        # Git tracking, multi-agent spawn
│
├── services/          # Core backend services
│   ├── api/           # Claude API client + streaming
│   ├── compact/       # Context window management (13 files)
│   ├── mcp/           # MCP integration (25 files, 470KB!)
│   ├── lsp/           # Language Server Protocol
│   ├── extractMemories/  # Auto-memory background agent
│   ├── SessionMemory/ # Periodic conversation notes
│   ├── analytics/     # Event pipeline (Datadog + 1P)
│   ├── tools/         # Tool orchestration & streaming executor
│   └── plugins/       # Plugin management
│
├── context/           # Context management (CLAUDE.md, git, env)
├── state/             # Zustand-like AppState store
├── coordinator/       # Multi-worker orchestration
├── memdir/            # Memory directory system (~/.claude/projects/)
├── skills/            # Skill loading & bundled skills
├── commands/          # 90+ slash commands (/compact, /model, etc.)
├── components/        # Ink UI components (React for terminal)
├── ink/               # Terminal rendering engine (custom fork)
├── hooks/             # React hooks + permission hooks
├── utils/             # Utilities (bash, git, permissions, etc.)
└── types/             # TypeScript type definitions`}
        />
      </Card>

      {/* Key Abstractions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card title="Core Abstractions" accent="var(--accent)">
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <code className="text-accent text-xs">QueryEngine</code>
              <p className="mt-1 text-xs">
                Owns the complete conversation lifecycle. Async generator that
                yields SDKMessage objects. Handles system prompt assembly,
                user input processing, and delegates to query() loop.
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">query()</code>
              <p className="mt-1 text-xs">
                The main agentic loop — a state machine that streams API
                responses, executes tools, handles recovery, and decides
                whether to continue or exit.
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">Tool&lt;Input, Output, Progress&gt;</code>
              <p className="mt-1 text-xs">
                Unified interface for all tools. Built via buildTool() factory.
                Declares permissions, concurrency safety, and rendering.
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">ToolUseContext</code>
              <p className="mt-1 text-xs">
                Central communication channel between tools and the query loop.
                Contains options, state accessors, abort controller, analytics.
              </p>
            </div>
          </div>
        </Card>

        <Card title="Design Patterns" accent="var(--green)">
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <strong className="text-text-primary text-xs">Async Generator Architecture</strong>
              <p className="mt-1 text-xs">
                Both QueryEngine and query() are async generators that yield
                intermediate results for real-time streaming.
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">Streaming Concurrency</strong>
              <p className="mt-1 text-xs">
                Tools start executing while the model is still generating.
                StreamingToolExecutor queues tool_use blocks as they arrive.
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">Cache Sharing (CacheSafeParams)</strong>
              <p className="mt-1 text-xs">
                Frozen system prompt bytes enable zero-cost forked queries for
                subagents. Identical bytes = automatic prompt cache hit.
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">DeepImmutable State</strong>
              <p className="mt-1 text-xs">
                Zustand-like AppState with type-safe mutations.
                setAppState(prev =&gt; &#123;...prev, field: newValue&#125;).
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Size Comparison */}
      <Card title="Codebase Size Comparison" className="mb-6" accent="var(--accent)">
        <p className="text-xs text-text-muted mb-4">
          Lines of code compared to well-known projects (approximate):
        </p>
        <div className="space-y-2.5">
          {[
            { name: "Linux 1.0 (1994)", lines: 176000, color: "var(--green)" },
            { name: "jQuery 3.x", lines: 10000, color: "var(--orange)" },
            { name: "Express.js", lines: 14000, color: "var(--orange)" },
            { name: "React (core)", lines: 200000, color: "var(--accent)" },
            { name: "Claude Code v2.1.88", lines: 512664, color: "var(--red)", highlight: true },
          ].map((p) => (
            <div key={p.name} className="flex items-center gap-3">
              <span className={`text-xs w-40 shrink-0 ${p.highlight ? "font-semibold text-text-primary" : "text-text-muted"}`}>
                {p.name}
              </span>
              <div className="flex-1 h-5 bg-bg-primary rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full rounded-full transition-all flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.min((p.lines / 512664) * 100, 100)}%`,
                    background: p.color,
                    minWidth: "40px",
                  }}
                >
                  <span className="text-[10px] font-mono text-white font-medium">
                    {(p.lines / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Largest Files */}
      <Card title="Top 10 Largest Files" className="mb-6" accent="var(--red)">
        <div className="space-y-1.5">
          {[
            { file: "cli/print.ts", lines: 5594, desc: "Formatted terminal output" },
            { file: "utils/messages.ts", lines: 5512, desc: "Message creation & formatting" },
            { file: "utils/sessionStorage.ts", lines: 5105, desc: "Session persistence" },
            { file: "utils/hooks.ts", lines: 5022, desc: "React hooks for REPL" },
            { file: "screens/REPL.tsx", lines: 5005, desc: "Main REPL screen" },
            { file: "main.tsx", lines: 4683, desc: "CLI initialization" },
            { file: "utils/bash/bashParser.ts", lines: 4436, desc: "Bash AST parser" },
            { file: "utils/attachments.ts", lines: 3997, desc: "Attachment prefetch" },
            { file: "services/api/claude.ts", lines: 3419, desc: "API client + streaming" },
            { file: "services/mcp/client.ts", lines: 3348, desc: "MCP protocol client" },
          ].map((f, i) => (
            <div key={f.file} className="flex items-center gap-3 py-1">
              <span className="text-[10px] text-text-muted w-4 text-right font-mono">{i + 1}</span>
              <code className="text-[11px] text-accent flex-1 truncate">{f.file}</code>
              <span className="text-[10px] text-text-muted w-24 text-right">{f.desc}</span>
              <div className="w-20 h-3 bg-bg-primary rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full rounded-full bg-red"
                  style={{ width: `${(f.lines / 5594) * 100}%`, opacity: 0.7 }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-12 text-right">{f.lines.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Module Size Breakdown */}
      <Card title="Module Size Breakdown" className="mb-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: VscExtensions, name: "Tools", files: 140, lines: "~65K", color: "var(--orange)" },
            { icon: VscDatabase, name: "Services", files: 110, lines: "~80K", color: "var(--green)" },
            { icon: VscCode, name: "Utils", files: 220, lines: "~60K", color: "var(--accent)" },
            { icon: VscSymbolStructure, name: "Components", files: 346, lines: "~40K", color: "var(--purple)" },
            { icon: VscTerminalBash, name: "Commands", files: 110, lines: "~8K", color: "var(--orange)" },
            { icon: VscServerProcess, name: "Query/Engine", files: 15, lines: "~15K", color: "var(--green)" },
            { icon: VscShield, name: "Permissions", files: 30, lines: "~20K", color: "var(--red)" },
            { icon: VscDatabase, name: "Bridge", files: 12, lines: "~13K", color: "var(--pink)" },
          ].map((m) => (
            <div key={m.name} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
              <m.icon className="w-4 h-4 mb-2" style={{ color: m.color }} />
              <div className="text-xs font-semibold text-text-primary">{m.name}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{m.files} files &middot; {m.lines} lines</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card title="Technology Stack" className="mb-6">
        <Table
          headers={["Technology", "Usage", "Notes"]}
          rows={[
            ["TypeScript", "Primary language", "Strict mode, Zod for runtime validation"],
            ["Ink (React)", "Terminal UI", "Custom fork with layout engine, focus, selection"],
            ["Zod", "Schema validation", "Tool input/output schemas, config validation"],
            ["Yoga Layout", "Terminal layout", "Flexbox for terminal via yoga-layout"],
            ["Ripgrep", "File search", "GrepTool wraps rg for fast content search"],
            ["Tree-sitter", "Bash parsing", "AST-based security analysis of shell commands"],
            ["Sharp", "Image processing", "Resize/compress images for API token limits"],
            ["MCP Protocol", "External tools", "stdio, SSE, HTTP, WebSocket transports"],
            ["GrowthBook", "Feature flags", "A/B testing with cached gate values"],
          ]}
        />
      </Card>

      {/* Data Flow */}
      <Card title="High-Level Data Flow">
        <CodeBlock
          code={`┌─ Entry Point (cli.tsx / SDK) ─────────────────────────────────────┐
│  Fast-path: --version, --dump-system-prompt, daemon workers       │
│  Full init: MDM settings, keychain, GrowthBook (~135ms parallel)  │
└──────────────────────────┬────────────────────────────────────────┘
                           │
┌─ QueryEngine ────────────▼────────────────────────────────────────┐
│  1. Fetch system prompt parts (CLAUDE.md, tools, env)             │
│  2. Process user input (slash commands, attachments)              │
│  3. Load skills & plugins                                         │
│  4. Yield system init message                                     │
└──────────────────────────┬────────────────────────────────────────┘
                           │
┌─ query() Loop ───────────▼────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐              │
│  │ 1. Context projection (snip, microcompact)      │              │
│  │ 2. Auto-compaction if threshold exceeded        │              │
│  │ 3. API streaming call                           │              │
│  │ 4. Tool execution (streaming or batch)          │              │
│  │ 5. Attachments (memory, skills, tasks)          │              │
│  │ 6. Continue or exit                             │              │
│  └──────────────────┬──────────────────────────────┘              │
│                     │ loop while tools called                     │
└─────────────────────┴─────────────────────────────────────────────┘
                           │
┌─ Terminal ───────────────▼────────────────────────────────────────┐
│  completed | prompt_too_long | aborted | token_budget_completed   │
└───────────────────────────────────────────────────────────────────┘`}
        />
      </Card>
    </div>
  );
}
