"use client";

import Link from "next/link";
import { PageHeader, Card, FileCard, FlowStep } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob } from "@/lib/sourceLinks";

const PHASES = [
  {
    number: 1,
    title: "Context Projection",
    description: "Trim the conversation to fit within the context window. Applies compression heuristics — drops oldest messages, truncates large tool outputs.",
    color: "var(--accent)",
    recovery: "If too much is dropped, phase 2 takes over.",
  },
  {
    number: 2,
    title: "Auto-Compaction Check",
    description: "If token budget is near limit (>80%), trigger services/compact to summarize older context. The escalation strategy runs: trim → truncate → summarize → replace.",
    color: "var(--green)",
    recovery: "After compaction, loop restarts at phase 1.",
  },
  {
    number: 3,
    title: "API Streaming",
    description: "Call the Anthropic API. Stream the response — collect text_delta tokens and tool_use blocks as they arrive. Render partial text to the terminal in real-time.",
    color: "var(--orange)",
    recovery: "On API error: exponential backoff, up to 3 retries.",
  },
  {
    number: 4,
    title: "Tool Execution",
    description: "Execute queued tool_use blocks via StreamingToolExecutor. Permission checks happen here. Tools can run concurrently if isReadOnly() and maxConcurrency allow.",
    color: "var(--purple)",
    recovery: "Tool errors are returned as tool_result blocks — not exceptions.",
  },
  {
    number: 5,
    title: "Attachment Processing",
    description: "Prefetch and resize any attachments (images, PDFs) referenced in upcoming messages. Inject them into the next message turn before sending.",
    color: "var(--accent)",
    recovery: "Failed attachments become error messages, not crashes.",
  },
  {
    number: 6,
    title: "Continuation Check",
    description: "Decide: did the model finish (stop_reason = end_turn) or must we loop for more tool results? If tools are pending, loop back to phase 1.",
    color: "var(--green)",
    recovery: "Max iterations guard: loops terminate after N turns.",
  },
  {
    number: 7,
    title: "Yield Result / Loop",
    description: "Yield SDKMessage objects to the caller (terminal or SDK). Then either loop back to phase 1 for more, or exit with a terminal state (done, error, cancelled).",
    color: "var(--orange)",
    recovery: "Cancelled state is propagated to cleanup handlers.",
  },
];

const LOOP_STATE_GROUPS = [
  {
    group: "Conversation",
    color: "var(--accent)",
    fields: [
      { field: "messages", type: "Message[]", desc: "Full conversation history, including all tool calls and results" },
      { field: "systemPrompt", type: "string", desc: "Assembled system prompt including project context, CLAUDE.md, memory" },
      { field: "tools", type: "Tool[]", desc: "Active tools for this query — built-in + MCP-proxied" },
    ],
  },
  {
    group: "Tracking",
    color: "var(--orange)",
    fields: [
      { field: "tokenBudget", type: "TokenBudget", desc: "Tracks used/remaining tokens across prompt, output, and tool results" },
      { field: "loopCount", type: "number", desc: "Current iteration count — guard against infinite tool loops" },
      { field: "stopReason", type: "StopReason | null", desc: "end_turn | max_tokens | tool_use | error | cancelled" },
    ],
  },
  {
    group: "Security",
    color: "var(--red)",
    fields: [
      { field: "permissionRules", type: "PermissionRule[]", desc: "Session-scoped rules the user has approved during this conversation" },
    ],
  },
];

const TOKEN_BUDGET = [
  { label: "System Prompt", pct: 15, color: "var(--accent)", note: "CLAUDE.md + project context + memory" },
  { label: "Conversation History", pct: 40, color: "var(--green)", note: "User+assistant turns, trimmed by compaction" },
  { label: "Tool Results", pct: 25, color: "var(--orange)", note: "BashTool, FileRead outputs — truncated if large" },
  { label: "Output Budget", pct: 15, color: "var(--purple)", note: "Reserved for assistant response tokens" },
  { label: "Safety Buffer", pct: 5, color: "var(--red)", note: "Headroom to avoid mid-response cutoffs" },
];

export default function QueryEnginePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "QueryEngine.ts", size: "~1295 lines", purpose: tx("Conversation lifecycle, system prompt assembly, message buffering", "对话生命周期、系统提示构建、消息缓冲"), color: "var(--green)" },
    { name: "query.ts", size: "~1729 lines", purpose: tx("The main agentic loop state machine, 7 distinct phases", "主代理循环状态机，7 个不同阶段"), color: "var(--orange)" },
    { name: "Task.ts", size: "~300 lines", purpose: tx("Task abstraction for multi-agent parallel work", "多代理并行工作的任务抽象"), color: "var(--purple)" },
    { name: "entrypoints/cli.tsx", size: "~200 lines", purpose: tx("CLI bootstrap — fast-path (--version, daemon) then calls QueryEngine", "CLI 引导，快速路径（--version、daemon），调用 QueryEngine"), color: "var(--accent)" },
    { name: "entrypoints/sdk/", size: "~400 lines", purpose: tx("Headless SDK entrypoint — exposes QueryEngine as a programmatic API", "无界面 SDK 入口点 — 将 QueryEngine 作为编程 API 公开"), color: "var(--pink)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Query/Engine Module", "查询/引擎模块")}
        description={tx(
          "The Orchestrator — every user message passes through here. QueryEngine.ts owns the conversation lifecycle; query.ts implements the 7-phase agentic loop state machine. This is the heart of everything.",
          "编排器 — 每条用户消息都经过这里。QueryEngine.ts 负责会话生命周期；query.ts 实现 7 阶段代理循环状态机。这是一切的核心。"
        )}
        badge="15 files · ~15K lines"
        links={[
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "query.ts", href: ghBlob("query.ts") },
        ]}
      />

      {/* QueryEngine vs query() */}
      <Card
        id="distinction"
        title={tx("QueryEngine vs query() — the distinction", "QueryEngine 与 query() 的区别")}
        className="mb-6"
        accent="var(--green)"
      >
        {/* Visual outer-shell diagram */}
        <div className="rounded-xl border-2 p-4 mb-4" style={{ borderColor: "color-mix(in srgb, var(--green) 40%, var(--border))", background: "color-mix(in srgb, var(--green) 5%, var(--bg-tertiary))" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-3 w-3 rounded-full" style={{ background: "var(--green)" }} />
            <code className="text-sm font-bold" style={{ color: "var(--green)" }}>QueryEngine</code>
            <span className="text-[9px] px-1.5 py-0.5 rounded border border-border text-text-muted">{tx("Stateful class · one per conversation", "有状态类 · 每对话一个")}</span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed mb-4">
            {tx("Owns the conversation: message history, system prompt assembly, session config. Async generator — call .input() with user text, get an async iterator of SDKMessage back.", "负责会话：消息历史、系统提示构建、会话配置。Async generator — 用用户文本调用 .input()，返回 SDKMessage 的异步迭代器。")}
          </p>
          {/* Inner box: query() delegated to */}
          <div className="rounded-xl border-2 p-4" style={{ borderColor: "color-mix(in srgb, var(--orange) 40%, var(--border))", background: "color-mix(in srgb, var(--orange) 6%, var(--bg-secondary))" }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span style={{ color: "var(--green)" }}>QueryEngine</span>
                <span className="text-[9px]">→ delegates each turn →</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full" style={{ background: "var(--orange)" }} />
              <code className="text-sm font-bold" style={{ color: "var(--orange)" }}>query()</code>
              <span className="text-[9px] px-1.5 py-0.5 rounded border border-border text-text-muted">{tx("Stateless loop · called per turn", "无状态循环 · 每轮调用")}</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              {tx("The inner loop. Runs the 7 phases using state QueryEngine passes in. Does NOT store state — each call is independent. This makes the loop testable and forkable for subagents.", "内部循环。使用 QueryEngine 传入的状态运行 7 个阶段。不存储状态——每次调用都独立。这使循环可测试，子代理可 fork。")}
            </p>
          </div>
        </div>
      </Card>

      {/* 7-Phase Loop */}
      <Card
        id="phases"
        title={tx("The 7-Phase query() Loop", "7 阶段 query() 循环")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("Each iteration of query.ts goes through exactly these 7 phases. Every tool execution, every compaction, every token passes through this 1729-line file.", "query.ts 的每次迭代都会经历这 7 个阶段。每次工具执行、每次压缩、每个 token 都经过这个 1729 行的文件。")}
      >
        <div className="mt-2">
          {PHASES.map((p) => (
            <div key={p.number} className="flex gap-4 mb-5 last:mb-0">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                  style={{ background: p.color }}
                >
                  {p.number}
                </div>
                <div className="w-px flex-1 bg-border mt-2" />
              </div>
              <div className="pb-4">
                <div className="text-sm font-semibold text-text-primary mb-1">{p.title}</div>
                <div className="text-xs text-text-muted leading-relaxed mb-1.5 max-w-lg">{p.description}</div>
                <div
                  className="text-[10px] px-2 py-1 rounded-lg inline-block"
                  style={{ background: `color-mix(in srgb, ${p.color} 10%, var(--bg-tertiary))`, color: p.color }}
                >
                  {tx("Recovery", "恢复策略")}: {p.recovery}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* LoopState visualization */}
      <Card
        id="state"
        title={tx("LoopState — What query() Carries", "LoopState — query() 携带的状态")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("The state object passed through all 7 phases. Each phase reads and mutates parts of it.", "贯穿 7 个阶段传递的状态对象。每个阶段都读取并修改其中的部分内容。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {LOOP_STATE_GROUPS.map((group) => (
            <div
              key={group.group}
              className="rounded-xl border border-border/60 overflow-hidden"
              style={{ background: `color-mix(in srgb, ${group.color} 4%, var(--bg-tertiary))` }}
            >
              <div
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider border-b border-border/40"
                style={{ color: group.color, background: `color-mix(in srgb, ${group.color} 10%, transparent)` }}
              >
                {group.group}
              </div>
              <div className="p-3 space-y-2.5">
                {group.fields.map((f) => (
                  <div key={f.field}>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <code className="text-[10px] font-semibold" style={{ color: group.color }}>{f.field}</code>
                      <span className="text-[9px] font-mono text-text-muted">{f.type}</span>
                    </div>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Token Budget */}
      <Card
        id="tokens"
        title={tx("Token Budget Math — 200K Context Window", "Token 预算数学 — 200K 上下文窗口")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("How the 200K context window of Claude Sonnet splits up in a typical session.", "Claude Sonnet 的 200K 上下文窗口在典型会话中如何分配。")}
      >
        <div className="space-y-2">
          {TOKEN_BUDGET.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <div className="shrink-0 w-36 text-[11px] text-text-secondary font-medium">{b.label}</div>
              <div className="flex-1 h-4 rounded-full bg-bg-tertiary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${b.pct}%`, background: b.color }}
                />
              </div>
              <div className="shrink-0 w-8 text-[10px] font-mono text-text-muted text-right">{b.pct}%</div>
              <div className="shrink-0 hidden sm:block text-[10px] text-text-muted max-w-xs">{b.note}</div>
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

      {/* Related pages — all other modules since it depends on all */}
      <Card title={tx("Related Pages", "相关页面")} className="mb-6" accent="var(--accent)">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/modules/tools", label: "Tools Module", color: "var(--orange)", desc: "Phase 4 executes tools. 43 tools, all flowing through StreamingToolExecutor." },
            { href: "/modules/services", label: "Services Module", color: "var(--green)", desc: "Phase 2 triggers compaction. Phase 3 uses the API client. Phase 7 fires extractMemories." },
            { href: "/modules/permissions", label: "Permissions Module", color: "var(--red)", desc: "Phase 4 checks permissions before every tool execute." },
            { href: "/modules/bridge", label: "Bridge Module", color: "var(--pink)", desc: "Bridge wraps QueryEngine for headless/SDK use. Same loop, no terminal." },
            { href: "/query-loop", label: "Query Loop Deep Dive", color: "var(--accent)", desc: "The main site's full analysis of the query loop with annotated code." },
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
