"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";

export default function ArchitecturePage() {
  return (
    <div className="p-8 max-w-5xl">
      <PageHeader
        title="Architecture"
        description="High-level system design of Claude Code — how the TypeScript monolith is organized, key abstractions, and the data flow between components."
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
