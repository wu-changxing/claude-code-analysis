"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard, FlowStep, InsightCallout, RelatedPages } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  VscDatabase,
  VscServer,
  VscCode,
  VscGraphLine,
  VscSymbolEvent,
  VscExtensions,
  VscKey,
  VscBracketDot,
} from "react-icons/vsc";

const SERVICE_CATALOGUE = [
  {
    name: "services/api/",
    icon: VscDatabase,
    color: "var(--accent)",
    files: "30+ files",
    size: "3500+ lines",
    bullets: [
      "Builds Anthropic API requests with full system prompt, tools, and message history",
      "Handles streaming token events: text_delta, tool_use start/delta/stop",
      "Token budget management — enforces context limits before sending",
    ],
    keyFact: "claude.ts is the largest single file in the entire codebase",
    provides: "LLM responses",
    needs: "utils/messages",
  },
  {
    name: "services/mcp/",
    icon: VscServer,
    color: "var(--orange)",
    files: "20+ files",
    size: "470KB",
    bullets: [
      "MCP protocol client supporting 4 transport types: stdio, SSE, HTTP, WebSocket",
      "Fetches tool definitions from connected servers at startup",
      "Patches MCP tools directly into Claude's tool namespace at runtime",
    ],
    keyFact: "470KB — the single largest service. Bigger than most npm packages.",
    provides: "MCP tools",
    needs: "config (server list)",
  },
  {
    name: "services/compact/",
    icon: VscBracketDot,
    color: "var(--green)",
    files: "13 files",
    size: "~15KB",
    bullets: [
      "4-strategy escalating compression pipeline triggered when context approaches limit",
      "Strategies escalate from simple truncation to full AI-summarization of history",
      "Tracks compression ratios and chooses least-aggressive strategy that fits",
    ],
    keyFact: "Strategy 4 (Full Context Replacement) is the nuclear option — replaces everything except the last N turns",
    provides: "compressed messages",
    needs: "services/api (for summarization)",
  },
  {
    name: "services/lsp/",
    icon: VscCode,
    color: "var(--purple)",
    files: "6 files",
    size: "~8KB",
    bullets: [
      "Language Server Protocol integration for IDE-quality diagnostics",
      "Runs linters/type checkers as background processes connected via LSP",
      "Surfaces errors inline in tool results so Claude can fix them immediately",
    ],
    keyFact: "Claude can see TypeScript errors before running the code — same data flow as your IDE",
    provides: "LSP diagnostics",
    needs: "project root path",
  },
  {
    name: "services/extractMemories/",
    icon: VscSymbolEvent,
    color: "var(--pink)",
    files: "~5 files",
    size: "~15KB",
    bullets: [
      "Background agent that runs after every conversation turn",
      "Sends recent messages to Claude: 'what facts are worth remembering?'",
      "Stores extracted memories as YAML in ~/.claude/memories/ for future sessions",
    ],
    keyFact: "Uses Claude to build Claude's long-term memory — recursive self-improvement of context",
    provides: "~/.claude/memories/*.yaml",
    needs: "services/api (Claude call)",
  },
  {
    name: "services/analytics/",
    icon: VscGraphLine,
    color: "var(--text-muted)",
    files: "~8 files",
    size: "~10KB",
    bullets: [
      "Async event pipeline — usage events are queued and never block the main loop",
      "Drains to Datadog metrics + first-party analytics endpoint",
      "Includes a PII safety type called SanitizedEventProperties to mark clean data",
    ],
    keyFact: "PII safety type: SanitizedEventProperties — the data is safe if the type says so",
    provides: "metrics/events",
    needs: "nothing (fire and forget)",
  },
  {
    name: "services/tools/",
    icon: VscExtensions,
    color: "var(--red)",
    files: "~10 files",
    size: "~20KB",
    bullets: [
      "StreamingToolExecutor — queues tool_use blocks as they arrive from the stream",
      "Concurrency guard — manages parallel vs sequential tool execution",
      "Routes each tool call through validate → checkPermissions → invoke → renderResult",
    ],
    keyFact: "StreamingToolExecutor starts executing tool calls before the full response is received — parallelism at stream time",
    provides: "tool results",
    needs: "services/mcp (for MCP tools)",
  },
  {
    name: "services/tokens/",
    icon: VscKey,
    color: "var(--green)",
    files: "~5 files",
    size: "~8KB",
    bullets: [
      "Tracks token consumption across the session for reporting and budget enforcement",
      "Projects remaining token budget for the current context window",
      "Feeds into services/compact to decide when compaction should trigger",
    ],
    keyFact: "Tokens are counted before sending, not after — the budget projection runs before every API call",
    provides: "token counts + budgets",
    needs: "utils/messages (for counting)",
  },
];

const COMPACTION_STRATEGIES = [
  { n: 1, name: "Window Trim", color: "var(--accent)", aggressiveness: 20, desc: "Drop oldest messages that exceed context budget. Simple FIFO drop — no summarization yet." },
  { n: 2, name: "Tool Result Truncation", color: "var(--green)", aggressiveness: 40, desc: "Truncate large tool outputs (file contents, bash output) to their first N tokens. Tool call is preserved." },
  { n: 3, name: "Conversation Summarization", color: "var(--orange)", aggressiveness: 65, desc: "Send older conversation turns to Claude for summarization. Compressed summary replaces raw messages." },
  { n: 4, name: "Full Context Replacement", color: "var(--red)", aggressiveness: 90, desc: "Replace everything except the last N turns with a single summary. Nuclear option — only when critically close to limit." },
];

const MCP_TRANSPORTS = [
  { name: "stdio", color: "var(--orange)", icon: "⚙️", useCase: "Local subprocesses (npx servers)", latency: "~1ms (in-process)", desc: "Spawns a local subprocess. Communication over stdin/stdout JSON-RPC. Most common for local tools." },
  { name: "SSE", color: "var(--green)", icon: "📡", useCase: "Remote HTTP servers", latency: "~50-200ms (network)", desc: "HTTP Server-Sent Events. The MCP server runs as an HTTP endpoint. Claude receives a stream of events." },
  { name: "HTTP", color: "var(--accent)", icon: "🌐", useCase: "Stateless REST APIs", latency: "~50-200ms (network)", desc: "Plain HTTP REST. Each tool call is a POST request. Stateless — no persistent connection required." },
  { name: "WebSocket", color: "var(--purple)", icon: "🔄", useCase: "Bidirectional streaming", latency: "~10-50ms (persistent)", desc: "Full duplex WebSocket. The server can push updates to Claude mid-execution." },
];

const API_LIFECYCLE = [
  { number: 1, title: "QueryEngine calls query()", description: "The main query loop requests a new API call. It passes the full message history and system prompt.", color: "var(--green)" },
  { number: 2, title: "services/api/claude.ts — buildRequest()", description: "Constructs the Anthropic API request. Injects tools, handles model selection, applies token budget limits.", color: "var(--accent)" },
  { number: 3, title: "Anthropic API — streams tokens", description: "Response arrives as a stream of events: text_delta, tool_use start/delta/stop. Each event is processed immediately.", color: "var(--orange)" },
  { number: 4, title: "StreamingToolExecutor — queues tool_use", description: "As tool_use blocks complete, they are enqueued. The executor decides execution order and concurrency.", color: "var(--purple)" },
  { number: 5, title: "services/tools/ — runs tools", description: "Each queued tool runs through the Tools module: validate → checkPermissions → invoke → renderResult.", color: "var(--red)" },
  { number: 6, title: "services/analytics/ — async drain", description: "Usage events are queued and drained asynchronously. Never blocks the main loop.", color: "var(--text-muted)" },
  { number: 7, title: "services/extractMemories/ — post-turn", description: "After each turn completes, a background agent mines the conversation for facts worth persisting across sessions.", color: "var(--green)" },
];

export default function ServicesModulePage() {
  const tx = useTx();

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Services Module", "服务模块")}
        description={tx(
          "The Service Layer — 8 background services that power everything. API client, MCP runtime (470KB!), context compaction, LSP diagnostics, memory extraction, analytics, tool orchestration, and token management.",
          "服务层 — 8 个驱动一切的后台服务。API 客户端、MCP 运行时（470KB！）、上下文压缩、LSP 诊断、记忆提取、分析、工具编排和 token 管理。"
        )}
        badge="110 files · ~80K lines"
        links={[
          { label: "services/", href: ghTree("services") },
          { label: "services/api/claude.ts", href: ghBlob("services/api/claude.ts") },
          { label: "services/mcp/", href: ghTree("services/mcp") },
          { label: "services/compact/", href: ghTree("services/compact") },
        ]}
      />

      {/* Service Catalogue */}
      <Card
        id="catalogue"
        title={tx("Service Catalogue — 8 Services", "服务目录 — 8 个服务")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("Each service is an independent subsystem with a clear input/output contract.", "每个服务都是一个独立的子系统，具有清晰的输入/输出契约。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SERVICE_CATALOGUE.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="rounded-xl border border-border/60 p-4 flex flex-col gap-3"
                style={{ borderTop: `3px solid ${svc.color}`, background: `color-mix(in srgb, ${svc.color} 4%, var(--bg-tertiary))` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${svc.color} 15%, var(--bg-secondary))` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: svc.color }} />
                    </div>
                    <code className="text-[11px] font-bold" style={{ color: svc.color }}>{svc.name}</code>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border bg-bg-primary text-text-muted">{svc.files}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-border bg-bg-primary text-text-muted">{svc.size}</span>
                  </div>
                </div>
                {/* Bullets */}
                <ul className="space-y-1">
                  {svc.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-[10px] text-text-muted leading-relaxed">
                      <span className="shrink-0 mt-0.5" style={{ color: svc.color }}>·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {/* Key fact */}
                <div
                  className="rounded-lg px-3 py-2 text-[10px] text-text-muted leading-relaxed"
                  style={{ background: `color-mix(in srgb, ${svc.color} 10%, var(--bg-secondary))`, borderLeft: `2px solid ${svc.color}` }}
                >
                  <span className="font-semibold" style={{ color: svc.color }}>{tx("Key fact: ", "关键事实: ")}</span>
                  {svc.keyFact}
                </div>
                {/* Dependency arrow */}
                <div className="flex items-center gap-2 text-[9px] text-text-muted">
                  <span className="px-1.5 py-0.5 rounded bg-bg-primary border border-border">{svc.needs}</span>
                  <span>→</span>
                  <span className="font-semibold" style={{ color: svc.color }}>{svc.name.replace("services/", "").replace("/", "")}</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-bg-primary border border-border">{svc.provides}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* API Call Lifecycle */}
      <Card
        id="lifecycle"
        title={tx("API Call Lifecycle — 7 Steps", "API 调用生命周期 — 7 步")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("A single API call touches multiple services in sequence.", "一次 API 调用会依次经过多个服务。")}
      >
        <div className="mt-2">
          {API_LIFECYCLE.map((s) => (
            <FlowStep key={s.number} number={s.number} title={s.title} description={s.description} color={s.color} />
          ))}
        </div>
      </Card>

      {/* Compaction deep dive — escalating bars */}
      <Card
        id="compaction"
        title={tx("Compaction — 4 Escalating Strategies", "压缩 — 4 级递进策略")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx(
          "When context gets large, compaction triggers. Each strategy is more aggressive than the last. Strategy 4 is the nuclear option.",
          "当上下文变大时，压缩触发。每个策略都比上一个更激进。策略 4 是终极选项。"
        )}
        links={[{ label: "services/compact/", href: ghTree("services/compact") }]}
      >
        <div className="space-y-3">
          {COMPACTION_STRATEGIES.map((s) => (
            <div
              key={s.n}
              className="rounded-xl p-4"
              style={{ background: `color-mix(in srgb, ${s.color} 6%, var(--bg-tertiary))`, borderLeft: `4px solid ${s.color}` }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
                    style={{ background: s.color }}
                  >
                    {s.n}
                  </div>
                  <span className="text-xs font-semibold text-text-primary">{s.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[9px] text-text-muted uppercase tracking-wider">{tx("aggressiveness", "激进程度")}</span>
                  <div className="w-20 h-2 rounded-full bg-bg-primary overflow-hidden border border-border/50">
                    <div className="h-full rounded-full" style={{ width: `${s.aggressiveness}%`, background: s.color }} />
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: s.color }}>{s.aggressiveness}%</span>
                </div>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 20%, var(--border))" }}
        >
          <strong className="text-text-primary">{tx("Strategy 4 = Context Collapse (Nuclear Option)", "策略 4 = 上下文坍塌（终极方案）")}</strong>
          {" — "}{tx("Replaces everything except the last N turns with a single AI-generated summary. Information is lost — but the session continues.", "用单个 AI 生成的摘要替换除最后 N 轮之外的所有内容。信息会丢失——但会话会继续。")}
        </div>
      </Card>

      {/* MCP transport diagram */}
      <Card
        id="mcp"
        title={tx("MCP — 4 Transport Types", "MCP — 4 种传输类型")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("470KB of MCP client code — all behind one unified interface. Different transports for different deployment contexts.", "470KB 的 MCP 客户端代码，全部在一个统一接口之后。针对不同部署环境的不同传输类型。")}
        links={[{ label: "services/mcp/", href: ghTree("services/mcp") }]}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MCP_TRANSPORTS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-4 border border-border/60 flex flex-col gap-2"
              style={{ background: `color-mix(in srgb, ${t.color} 6%, var(--bg-tertiary))`, borderTop: `3px solid ${t.color}` }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.icon}</span>
                <code className="text-sm font-bold" style={{ color: t.color }}>{t.name}</code>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="rounded px-2 py-0.5 text-[9px] font-medium" style={{ background: `color-mix(in srgb, ${t.color} 10%, var(--bg-secondary))`, color: t.color }}>
                  {t.useCase}
                </div>
                <div className="rounded px-2 py-0.5 text-[9px] text-text-muted bg-bg-primary border border-border">
                  {t.latency}
                </div>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--orange) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--orange) 25%, transparent)" }}
        >
          <strong className="text-text-primary">{tx("Patch-at-runtime pattern", "运行时动态注入模式")}</strong>
          {" — "}{tx("MCP tool definitions are fetched from connected servers at startup and patched directly into the Claude tool namespace. Claude sees MCP tools as if they were native built-in tools.", "MCP 工具定义在启动时从已连接的服务器获取，并直接注入 Claude 的工具命名空间。Claude 将 MCP 工具视为原生内置工具。")}
        </div>
      </Card>

      <RelatedPages pages={[
        { href: "/modules/query-engine", title: "Query/Engine Module", color: "var(--green)", desc: "When compaction triggers, what the loop looks like, and how API calls fit in the 7-phase cycle." },
        { href: "/modules/tools", title: "Tools Module", color: "var(--orange)", desc: "StreamingToolExecutor (services/tools) is the bridge between the query loop and the 43 tools." },
        { href: "/services", title: "Services Deep Dive", color: "var(--accent)", desc: "The main site's services page — more on MCP, compaction strategies, and memory." },
      ]} />
    </div>
  );
}
