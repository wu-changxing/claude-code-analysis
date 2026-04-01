"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

const COMPACTION_STRATEGIES = [
  { n: 1, name: "Window Trim", color: "var(--accent)", aggressiveness: 20, desc: "Drop oldest messages that exceed context budget. Simple FIFO drop — no summarization yet." },
  { n: 2, name: "Tool Result Truncation", color: "var(--green)", aggressiveness: 40, desc: "Truncate large tool outputs (file contents, bash output) to their first N tokens. Tool call is preserved." },
  { n: 3, name: "Conversation Summarization", color: "var(--orange)", aggressiveness: 65, desc: "Send older conversation turns to Claude for summarization. Compressed summary replaces raw messages." },
  { n: 4, name: "Full Context Replacement", color: "var(--red)", aggressiveness: 90, desc: "Replace everything except the last N turns with a single summary. Nuclear option — only when critically close to limit." },
];

const MCP_TRANSPORTS = [
  { name: "stdio", color: "var(--orange)", desc: "Spawns a local subprocess (e.g. npx some-mcp-server). Communication over stdin/stdout JSON-RPC. Most common for local tools." },
  { name: "SSE", color: "var(--green)", desc: "HTTP Server-Sent Events. The MCP server runs as an HTTP endpoint. Claude sends requests and receives a stream of events." },
  { name: "HTTP", color: "var(--accent)", desc: "Plain HTTP REST. Each tool call is a POST request. Stateless — no persistent connection required." },
  { name: "WebSocket", color: "var(--purple)", desc: "Bidirectional WebSocket. Full duplex — the server can push updates to Claude mid-execution." },
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

  const keyFiles = [
    { name: "services/api/claude.ts", size: "3500+ lines", purpose: tx("API client, streaming, token management", "API 客户端、流式处理、token 管理"), color: "var(--accent)" },
    { name: "services/mcp/client.ts", size: "119KB", purpose: tx("MCP protocol client — 4 transport types (stdio, SSE, HTTP, WS)", "MCP 协议客户端 — 支持 4 种传输类型"), color: "var(--orange)" },
    { name: "services/compact/", size: "13 files", purpose: tx("Context window compression pipeline, 4-strategy escalation", "上下文窗口压缩管道，4 级压缩策略"), color: "var(--green)" },
    { name: "services/lsp/", size: "6 files", purpose: tx("Language Server Protocol diagnostics integration", "语言服务器协议诊断集成"), color: "var(--purple)" },
    { name: "services/extractMemories/", size: "~15KB", purpose: tx("Background agent that mines conversation for persistent memories", "后台代理，从对话中挖掘并持久化记忆"), color: "var(--pink)" },
    { name: "services/analytics/", size: "~10KB", purpose: tx("Event pipeline: Datadog + first-party analytics, async drain", "事件管道：Datadog + 自有分析，异步排队"), color: "var(--text-muted)" },
    { name: "services/tools/", size: "~20KB", purpose: tx("Tool orchestration, StreamingToolExecutor, concurrency guard", "工具编排、StreamingToolExecutor、并发守卫"), color: "var(--red)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Services Module", "服务模块")}
        description={tx(
          "The Service Layer — background processes that power the query loop. API client, MCP runtime (470KB!), context compaction, LSP diagnostics, memory extraction, analytics.",
          "服务层 — 驱动查询循环的后台进程。API 客户端、MCP 运行时（470KB！）、上下文压缩、LSP 诊断、记忆提取、分析。"
        )}
        badge="110 files · ~80K lines"
        links={[
          { label: "services/", href: ghTree("services") },
          { label: "services/api/claude.ts", href: ghBlob("services/api/claude.ts") },
          { label: "services/mcp/", href: ghTree("services/mcp") },
          { label: "services/compact/", href: ghTree("services/compact") },
        ]}
      />

      {/* Service dependency tree */}
      <Card
        id="deps"
        title={tx("Service Dependency Tree", "服务依赖树")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("Which services depend on which — and who calls them.", "哪些服务依赖哪些服务，以及谁调用它们。")}
      >
        <div className="space-y-2">
          {[
            { name: "Query/Engine", color: "var(--green)", calls: ["services/api", "services/compact", "services/tools", "services/extractMemories"] },
            { name: "Tools module", color: "var(--orange)", calls: ["services/tools (StreamingToolExecutor)", "services/mcp"] },
            { name: "Commands module", color: "var(--orange)", calls: ["services/compact (/compact command)", "services/mcp (/mcp command)"] },
          ].map((caller) => (
            <div key={caller.name} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center rounded-lg p-2 border border-border/50"
              style={{ background: `color-mix(in srgb, ${caller.color} 5%, var(--bg-tertiary))` }}>
              <span className="text-xs font-semibold shrink-0 min-w-[120px]" style={{ color: caller.color }}>{caller.name}</span>
              <span className="text-text-muted text-[10px]">→</span>
              <div className="flex flex-wrap gap-1">
                {caller.calls.map((s) => (
                  <code key={s} className="text-[10px] px-1.5 py-0.5 rounded border border-border/60 bg-bg-primary text-text-secondary">{s}</code>
                ))}
              </div>
            </div>
          ))}
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

      {/* Compaction deep dive */}
      <Card
        id="compaction"
        title={tx("Compaction Deep Dive — 4 Escalating Strategies", "压缩深度分析 — 4 级递进策略")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx(
          "When context gets large, compaction triggers. Each strategy is more aggressive than the last.",
          "当上下文变大时，压缩触发。每个策略都比上一个更激进。"
        )}
        links={[{ label: "services/compact/", href: ghTree("services/compact") }]}
      >
        <div className="space-y-3">
          {COMPACTION_STRATEGIES.map((s) => (
            <div
              key={s.n}
              className="flex gap-3 rounded-xl p-3"
              style={{ background: `color-mix(in srgb, ${s.color} 6%, var(--bg-tertiary))`, borderLeft: `3px solid ${s.color}` }}
            >
              <div
                className="w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `color-mix(in srgb, ${s.color} 20%, transparent)`, color: s.color }}
              >
                {s.n}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary">{s.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] text-text-muted">aggressiveness</span>
                    <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.aggressiveness}%`, background: s.color }} />
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* MCP deep dive */}
      <Card
        id="mcp"
        title={tx("MCP Deep Dive — 4 Transport Types", "MCP 深度分析 — 4 种传输类型")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("470KB of MCP client code — all behind one unified interface.", "470KB 的 MCP 客户端代码，全部在一个统一接口之后。")}
        links={[{ label: "services/mcp/", href: ghTree("services/mcp") }]}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {MCP_TRANSPORTS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ background: `color-mix(in srgb, ${t.color} 7%, var(--bg-tertiary))`, borderTop: `3px solid ${t.color}` }}
            >
              <code className="text-xs font-bold" style={{ color: t.color }}>{t.name}</code>
              <p className="mt-1 text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--orange) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--orange) 25%, transparent)" }}
        >
          <strong className="text-text-primary">{tx("Patch-at-runtime pattern", "运行时动态注入模式")}</strong>
          {" — "}{tx("MCP tool definitions are fetched from connected servers at startup and patched directly into the Claude tool namespace. Claude sees MCP tools as if they were native built-in tools — same schema, same permission flow.", "MCP 工具定义在启动时从已连接的服务器获取，并直接注入 Claude 的工具命名空间。Claude 将 MCP 工具视为原生内置工具，相同的 schema，相同的权限流。")}
        </div>
      </Card>

      {/* Memory services */}
      <Card
        id="memory"
        title={tx("Memory Services", "记忆服务")}
        className="mb-6"
        accent="var(--pink)"
        summary={tx("How Claude remembers facts across sessions.", "Claude 如何跨会话记忆事实。")}
      >
        <div className="space-y-3">
          {[
            {
              name: "extractMemories",
              color: "var(--pink)",
              desc: tx("Runs after each conversation turn as a background agent. Sends recent messages to Claude with a prompt: 'extract facts worth remembering'. Stores results as YAML in ~/.claude/memories/.", "在每次对话轮次后作为后台代理运行。将最近的消息发送给 Claude，提示：'提取值得记住的事实'。将结果存储为 YAML 文件。"),
            },
            {
              name: "sessionMemory",
              color: "var(--green)",
              desc: tx("In-session memory buffer — stores facts extracted mid-conversation so they're available in the current turn's context without re-processing the full history.", "会话内记忆缓冲区——存储对话中提取的事实，使其在当前轮次的上下文中可用，无需重新处理完整历史记录。"),
            },
          ].map((m) => (
            <div
              key={m.name}
              className="rounded-lg border border-border/50 p-3"
              style={{ borderLeft: `3px solid ${m.color}` }}
            >
              <code className="text-[11px] font-semibold" style={{ color: m.color }}>{m.name}</code>
              <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      {/* Related pages */}
      <Card title={tx("Related Pages", "相关页面")} className="mb-6" accent="var(--accent)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/modules/query-engine", label: "Query/Engine Module", color: "var(--green)", desc: "When compaction triggers, what the loop looks like, and how API calls fit in the 7-phase cycle." },
            { href: "/modules/tools", label: "Tools Module", color: "var(--orange)", desc: "StreamingToolExecutor (services/tools) is the bridge between the query loop and the 43 tools." },
            { href: "/services", label: "Services Deep Dive", color: "var(--accent)", desc: "The main site's services page — more on MCP, compaction strategies, and memory." },
          ].map((rel) => (
            <Link
              key={rel.href}
              href={rel.href}
              className="rounded-xl border border-border/60 p-3 hover:border-border hover:bg-bg-tertiary/30 transition-all group"
              style={{ borderLeft: `3px solid ${rel.color}` }}
            >
              <div className="text-xs font-semibold text-text-primary mb-1 group-hover:underline">{rel.label}</div>
              <p className="text-[10px] text-text-muted leading-relaxed">{rel.desc}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
