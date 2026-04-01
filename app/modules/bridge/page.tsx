"use client";

import { PageHeader, Card, FileCard, FlowStep, InsightCallout, RelatedPages } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghTree } from "@/lib/sourceLinks";

const SDK_ENTRY_POINTS = [
  { name: "runClaude()", color: "var(--pink)", desc: "Main SDK entry point. Takes messages and options, returns an async iterator of SDKMessage objects. Same interface whether running local or remote." },
  { name: "createSession()", color: "var(--accent)", desc: "Creates a new QueryEngine instance with the given config. The session is stateful — call .send() repeatedly to continue a conversation." },
  { name: "streamQuery()", color: "var(--green)", desc: "Low-level function. Wraps query() and yields SDKMessage events as they arrive. Used internally by runClaude() and createSession()." },
];

const AGENT_TOOL_FLOW = [
  { number: 1, title: "LLM calls AgentTool", description: "Claude decides to spawn a subagent via AgentTool — generates a tool_use block with the task description.", color: "var(--orange)" },
  { number: 2, title: "AgentTool calls Bridge", description: "AgentTool invokes the SDK Bridge directly, not the terminal entry point. This creates a headless execution context.", color: "var(--pink)" },
  { number: 3, title: "New QueryEngine instance", description: "The Bridge creates a fresh QueryEngine with forked state from the parent: inherited tools, separate message history, same permissions.", color: "var(--green)" },
  { number: 4, title: "Subagent runs headlessly", description: "The subagent's query() loop runs identically to the parent — 7 phases, tools, permissions — but outputs SDKMessages instead of terminal text.", color: "var(--accent)" },
  { number: 5, title: "Results returned to parent", description: "When the subagent finishes, its output SDKMessages are formatted as a tool_result and injected into the parent's conversation.", color: "var(--purple)" },
];

// Side-by-side comparison data
const MODE_COMPARISON = [
  {
    aspect: "Entry point",
    terminal: "entrypoints/cli.tsx → main.tsx",
    sdk: "entrypoints/sdk/ → Bridge",
  },
  {
    aspect: "QueryEngine",
    terminal: "Same QueryEngine class",
    sdk: "Same QueryEngine class",
    shared: true,
  },
  {
    aspect: "query() loop",
    terminal: "Identical 7-phase loop",
    sdk: "Identical 7-phase loop",
    shared: true,
  },
  {
    aspect: "Output",
    terminal: "ANSI escape codes → terminal stdout",
    sdk: "SDKMessage objects → async iterator",
  },
  {
    aspect: "UI",
    terminal: "Ink component tree (REPL.tsx)",
    sdk: "No UI — caller processes messages",
  },
  {
    aspect: "Permissions",
    terminal: "User dialog in terminal",
    sdk: "Programmatic approval callback",
  },
];

export default function BridgeModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "entrypoints/sdk/", size: "~400 lines", purpose: tx("Headless SDK entrypoint — exposes QueryEngine as a programmatic API without terminal UI", "无界面 SDK 入口点——将 QueryEngine 公开为无终端 UI 的编程 API"), color: "var(--pink)" },
    { name: "bridge/", size: "~20KB", purpose: tx("Remote session bridge — polls for work, spawns sessions, manages remote capacity", "远程会话桥——轮询任务、生成会话、管理远程容量"), color: "var(--accent)" },
    { name: "remote/", size: "~30KB", purpose: tx("WebSocket adapters and remote session manager for distributed execution", "分布式执行的 WebSocket 适配器和远程会话管理器"), color: "var(--green)" },
    { name: "coordinator/", size: "~15KB", purpose: tx("Multi-worker orchestration — coordinates parallel subagent execution", "多工作者编排——协调并行子代理执行"), color: "var(--orange)" },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Bridge Module", "桥接层模块")}
        description={tx(
          "The SDK Bridge — Claude Code as a Library. The same QueryEngine that powers the terminal REPL can run headlessly as a programmatic API. This is how subagents spawn, and how Claude Code scales to remote workers.",
          "SDK 桥接层 — Claude Code 作为库使用。驱动终端 REPL 的同一 QueryEngine 可以作为编程 API 无界面运行。这就是子代理的产生方式，也是 Claude Code 扩展到远程工作者的方式。"
        )}
        badge="12 files · ~13K lines"
        links={[
          { label: "entrypoints/sdk/", href: ghTree("entrypoints/sdk") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      />

      <InsightCallout emoji="🔀" title={tx("One Engine, Two Faces", "一个引擎，两张面孔")}>
        {tx(
          "The core insight: the entire 7-phase query loop is identical in both terminal and SDK modes. The Bridge is not a separate runtime — it's just a different output adapter on top of the exact same engine.",
          "核心洞察：整个 7 阶段查询循环在终端模式和 SDK 模式下完全相同。Bridge 不是独立的运行时——它只是同一引擎顶部不同的输出适配器。"
        )}
      </InsightCallout>

      {/* SDK vs Terminal — visual comparison */}
      <Card
        id="headless"
        title={tx("Terminal Mode vs SDK Mode", "终端模式 vs SDK 模式")}
        className="mb-6"
        accent="var(--pink)"
        summary={tx(
          "The same core loop runs in both modes. The Bridge is the diff — it swaps output and permissions handling.",
          "相同的核心循环在两种模式下运行。Bridge 是两者的差异——它替换了输出和权限处理。"
        )}
      >
        {/* Visual comparison blocks */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
          <div
            className="rounded-xl p-4 border border-border/60"
            style={{ borderTop: "3px solid var(--purple)", background: "color-mix(in srgb, var(--purple) 5%, var(--bg-tertiary))" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--purple)" }}>
              {tx("Terminal Mode", "终端模式")}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple shrink-0" style={{ background: "var(--purple)" }} />
                <code className="text-[10px] text-text-secondary">entrypoints/cli.tsx</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0 bg-green" style={{ background: "var(--green)" }} />
                <code className="text-[10px] text-text-secondary">QueryEngine (shared)</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--purple)" }} />
                <code className="text-[10px] text-text-secondary">Ink REPL.tsx UI</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--purple)" }} />
                <code className="text-[10px] text-text-secondary">Terminal permission dialog</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--purple)" }} />
                <code className="text-[10px] text-text-secondary">ANSI → stdout</code>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl p-4 border border-border/60"
            style={{ borderTop: "3px solid var(--pink)", background: "color-mix(in srgb, var(--pink) 5%, var(--bg-tertiary))" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--pink)" }}>
              {tx("SDK / Headless Mode", "SDK / 无界面模式")}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--pink)" }} />
                <code className="text-[10px] text-text-secondary">entrypoints/sdk/ → Bridge</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--green)" }} />
                <code className="text-[10px] text-text-secondary">QueryEngine (shared)</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--pink)" }} />
                <code className="text-[10px] text-text-secondary">No UI</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--pink)" }} />
                <code className="text-[10px] text-text-secondary">Programmatic callback</code>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--pink)" }} />
                <code className="text-[10px] text-text-secondary">SDKMessage async iterator</code>
              </div>
            </div>
          </div>
        </div>

        {/* Shared section highlight */}
        <div
          className="rounded-xl px-4 py-3 border border-border/60 flex items-center gap-3"
          style={{ background: "color-mix(in srgb, var(--green) 8%, var(--bg-secondary))", borderColor: "color-mix(in srgb, var(--green) 25%, var(--border))" }}
        >
          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: "var(--green)" }} />
          <div>
            <span className="text-xs font-semibold text-text-primary">
              {tx("QueryEngine + 7-phase loop — identical in both modes", "QueryEngine + 7 阶段循环——两种模式完全相同")}
            </span>
            <p className="text-[10px] text-text-muted mt-0.5">
              {tx("This is the core architectural fact about Bridge. It's adapters all the way down.", "这是 Bridge 的核心架构事实。底层全是适配器。")}
            </p>
          </div>
        </div>

        {/* Detail table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Aspect</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--purple)" }}>Terminal</th>
                <th className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--pink)" }}>SDK / Headless</th>
              </tr>
            </thead>
            <tbody>
              {MODE_COMPARISON.map((row) => (
                <tr key={row.aspect} className="border-b border-border/40 hover:bg-bg-tertiary/20">
                  <td className="py-2 px-3 text-[10px] font-medium text-text-secondary">{row.aspect}</td>
                  <td className="py-2 px-3">
                    <code className="text-[10px]" style={{ color: row.shared ? "var(--green)" : "var(--text-muted)" }}>{row.terminal}</code>
                  </td>
                  <td className="py-2 px-3">
                    <code className="text-[10px]" style={{ color: row.shared ? "var(--green)" : "var(--text-secondary)" }}>{row.sdk}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* API Surface */}
      <Card
        id="api"
        title={tx("SDK API Surface — Key Entry Points", "SDK API 入口点")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("The three functions external callers use to drive Claude Code programmatically.", "外部调用者用于以编程方式驱动 Claude Code 的三个函数。")}
      >
        <div className="space-y-3">
          {SDK_ENTRY_POINTS.map((ep) => (
            <div
              key={ep.name}
              className="rounded-xl p-3 border border-border/60"
              style={{ borderLeft: `3px solid ${ep.color}`, background: `color-mix(in srgb, ${ep.color} 6%, var(--bg-tertiary))` }}
            >
              <code className="text-sm font-bold mb-1 block" style={{ color: ep.color }}>{ep.name}</code>
              <p className="text-[10px] text-text-muted leading-relaxed">{ep.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* AgentTool uses Bridge */}
      <Card
        id="agent-tool"
        title={tx("How AgentTool Uses the Bridge — Subagent Spawning", "AgentTool 如何使用 Bridge — 子代理生成")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx(
          "When Claude decides to spawn a subagent, the Bridge is the mechanism. The subagent is a full Claude Code instance running headlessly.",
          "当 Claude 决定生成子代理时，Bridge 是其机制。子代理是一个无界面运行的完整 Claude Code 实例。"
        )}
      >
        <div className="mt-2">
          {AGENT_TOOL_FLOW.map((s) => (
            <FlowStep key={s.number} number={s.number} title={s.title} description={s.description} color={s.color} />
          ))}
        </div>
        <div
          className="mt-4 rounded-lg p-3 text-[11px] text-text-muted"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 25%, transparent)" }}
        >
          <strong className="text-text-primary">{tx("Claude Code is its own subagent runtime", "Claude Code 是自己的子代理运行时")}</strong>
          {" — "}{tx("The same code that powers your interactive terminal also powers every subagent it spawns. There is no separate subagent engine.", "驱动你交互式终端的代码，同样驱动它生成的每一个子代理。没有单独的子代理引擎。")}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件")} className="mb-6">
        <div className="grid grid-cols-2 gap-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      <RelatedPages pages={[
        { href: "/modules/query-engine", title: "Query/Engine Module", color: "var(--green)", desc: "Bridge wraps QueryEngine. The same 7-phase loop runs headlessly when Bridge is the caller." },
        { href: "/modules/tools", title: "Tools Module", color: "var(--orange)", desc: "AgentTool uses Bridge to spawn subagents — it's the connection between the tool system and the SDK." },
        { href: "/agents", title: "Agents Deep Dive", color: "var(--pink)", desc: "The main site's analysis of how multi-agent spawning works end to end." },
      ]} />
    </div>
  );
}
