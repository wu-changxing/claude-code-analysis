"use client";

import { PageHeader, Card, FileCard, ArchPosition } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

const ARCH_LAYERS = [
  { name: "Components / CLI", desc: "terminal UI, Ink renderer", color: "var(--purple)" },
  { name: "Query / Engine", desc: "orchestrates the agent loop", color: "var(--green)" },
  { name: "Commands", desc: "slash command handlers", color: "var(--orange)" },
  { name: "Tools", desc: "43+ built-in tools", color: "var(--orange)" },
  { name: "Services", desc: "API, MCP, compaction, LSP", color: "var(--green)" },
  { name: "Permissions", desc: "security layer", color: "var(--red)" },
  { name: "Utils", desc: "shared foundation", color: "var(--accent)" },
];

// API call lifecycle steps
const LIFECYCLE_STEPS = [
  { label: "QueryEngine calls query()", color: "var(--green)", step: "1" },
  { label: "services/api/claude.ts — buildRequest()", color: "var(--accent)", step: "2" },
  { label: "Anthropic API — streams tokens", color: "var(--orange)", step: "3" },
  { label: "StreamingToolExecutor — queues tool_use blocks", color: "var(--purple)", step: "4" },
  { label: "services/tools/ — executes tools", color: "var(--pink)", step: "5" },
  { label: "services/analytics/ — async drain", color: "var(--text-muted)", step: "6" },
  { label: "services/extractMemories/ — post-turn", color: "var(--green)", step: "7" },
];

export default function ServicesModulePage() {
  const tx = useTx();

  const keyFiles = [
    { name: "services/api/claude.ts", size: "3500+ lines", purpose: tx("API client, streaming, token management", "API 客户端、流式处理、token 管理", "APIクライアント、ストリーミング、トークン管理"), color: "var(--accent)" },
    { name: "services/mcp/client.ts", size: "119KB", purpose: tx("MCP protocol client — 4 transport types (stdio, SSE, HTTP, WS)", "MCP 协议客户端 — 支持 4 种传输类型", "MCP プロトコルクライアント — 4 つのトランスポート"), color: "var(--orange)" },
    { name: "services/compact/", size: "13 files", purpose: tx("Context window compression pipeline", "上下文窗口压缩管道", "コンテキストウィンドウ圧縮パイプライン"), color: "var(--green)" },
    { name: "services/lsp/", size: "6 files", purpose: tx("Language Server Protocol diagnostics integration", "语言服务器协议诊断集成", "Language Server Protocol 診断統合"), color: "var(--purple)" },
    { name: "services/extractMemories/", size: "~15KB", purpose: tx("Background agent that mines conversation for persistent memories", "后台代理，从对话中挖掘并持久化记忆", "会話から記憶を抽出するバックグラウンドエージェント"), color: "var(--pink)" },
    { name: "services/analytics/", size: "~10KB", purpose: tx("Event pipeline: Datadog + first-party analytics, async drain", "事件管道：Datadog + 自有分析，异步排队", "イベントパイプライン: Datadog + 自社分析、非同期ドレイン"), color: "var(--text-muted)" },
    { name: "services/tools/", size: "~20KB", purpose: tx("Tool orchestration, StreamingToolExecutor, concurrency guard", "工具编排、StreamingToolExecutor、并发守卫", "ツール編成、StreamingToolExecutor、並行ガード"), color: "var(--red)" },
  ];

  const patterns = [
    {
      name: tx("Service Isolation", "服务隔离", "サービス分離"),
      color: "var(--green)",
      desc: tx(
        "Each service lives in its own subdirectory and owns its complete logic — no shared service registry. Services are imported directly where needed, keeping coupling explicit.",
        "每个服务都在自己的子目录中，拥有完整的逻辑，没有共享的服务注册表。服务在需要的地方直接导入，让耦合关系明确可见。",
        "各サービスは独自のサブディレクトリに収まり、共有サービスレジストリは存在しません。必要な場所で直接インポートされ、依存関係が明示的になります。"
      ),
    },
    {
      name: tx("Async Drain Pattern", "异步排队模式", "非同期ドレインパターン"),
      color: "var(--accent)",
      desc: tx(
        "Analytics events are queued and drained asynchronously in batches. This avoids blocking the main query loop with I/O on every tool call.",
        "分析事件以批量方式异步排队和排放，避免在每次工具调用时用 I/O 阻塞主查询循环。",
        "分析イベントはバッチで非同期にキューされドレインされます。ツール呼び出しごとのI/Oでメインクエリループをブロックしません。"
      ),
    },
    {
      name: tx("MCP Multi-Transport", "MCP 多传输", "MCP マルチトランスポート"),
      color: "var(--orange)",
      desc: tx(
        "The MCP client supports stdio (subprocess), SSE (HTTP streaming), HTTP (REST), and WebSocket — all behind a single unified interface. Transport selection is automatic based on the server config.",
        "MCP 客户端支持 stdio（子进程）、SSE（HTTP 流）、HTTP（REST）和 WebSocket，全部统一在一个接口之后。传输选择根据服务器配置自动完成。",
        "MCP クライアントは stdio（サブプロセス）、SSE（HTTP ストリーミング）、HTTP（REST）、WebSocket をサポートし、すべて単一の統一インターフェースの背後にあります。"
      ),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Services Module", "服务模块", "Servicesモジュール")}
        description={tx(
          "Backend services powering Claude Code: the API client, MCP integration (25 files, 470KB!), context compaction, LSP diagnostics, memory extraction, and analytics.",
          "驱动 Claude Code 的后端服务：API 客户端、MCP 集成（25 个文件，470KB！）、上下文压缩、LSP 诊断、记忆提取和分析。",
          "Claude Code を支えるバックエンドサービス: API クライアント、MCP 統合（25ファイル・470KB！）、コンテキスト圧縮、LSP 診断、記憶抽出、分析。"
        )}
        badge="110 files · ~80K lines"
        links={[
          { label: "services/", href: ghTree("services") },
          { label: "services/api/claude.ts", href: ghBlob("services/api/claude.ts") },
          { label: "services/mcp/", href: ghTree("services/mcp") },
          { label: "services/compact/", href: ghTree("services/compact") },
        ]}
      />

      {/* Architecture Position */}
      <Card title={tx("Position in Architecture", "在架构中的位置", "アーキテクチャ上の位置")} className="mb-6" accent="var(--green)">
        <p className="text-[11px] text-text-muted mb-4">
          {tx(
            "Services sit below Tools and Commands — providing external I/O and infrastructure. The Query/Engine layer talks directly to the API through Services.",
            "服务层位于工具和命令层之下，提供外部 I/O 和基础设施。查询/引擎层通过服务直接与 API 通信。",
            "サービスはツールとコマンドの下に位置し、外部 I/O とインフラを提供します。"
          )}
        </p>
        <ArchPosition position={4} label={tx("here", "当前", "ここ")} color="var(--green)" layers={ARCH_LAYERS} />
      </Card>

      {/* Dependency Diagram */}
      <Card title={tx("Module Dependencies", "模块依赖关系", "モジュール依存関係")} className="mb-6" accent="var(--green)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depended on by", "被依赖方", "依存元")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Query/Engine", color: "var(--green)", href: "/modules/query-engine" },
                { name: "Tools", color: "var(--orange)", href: "/modules/tools" },
                { name: "Components", color: "var(--purple)", href: "/modules/components" },
              ].map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary hover:opacity-80 transition-opacity"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="h-6 w-px bg-border" />
            <span className="text-text-muted text-xs">↓</span>
          </div>

          <div
            className="w-full max-w-xs rounded-xl border-2 p-4 text-center"
            style={{ borderColor: "var(--green)", background: "color-mix(in srgb, var(--green) 10%, transparent)" }}
          >
            <div className="text-sm font-bold text-text-primary">Services</div>
            <div className="text-[10px] text-text-muted mt-0.5">110 files · ~80K</div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="text-text-muted text-xs">↓</span>
            <div className="h-6 w-px bg-border" />
          </div>

          <div className="w-full">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2 text-center">
              {tx("Depends on", "依赖方", "依存先")}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { name: "Utils", color: "var(--accent)", href: "/modules/utils" },
              ].map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  className="px-4 py-2 rounded-lg border text-xs font-semibold text-text-primary hover:opacity-80 transition-opacity"
                  style={{ borderColor: m.color, background: `color-mix(in srgb, ${m.color} 10%, transparent)` }}
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* API Call Lifecycle */}
      <Card
        title={tx("API Call Lifecycle", "API 调用生命周期", "API 呼び出しライフサイクル")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("A single API call touches multiple services in sequence.", "一次 API 调用会依次经过多个服务。", "1回のAPI呼び出しが複数のサービスを順に経由します。")}
      >
        <div className="space-y-1.5">
          {LIFECYCLE_STEPS.map((s) => (
            <div
              key={s.step}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5"
              style={{
                background: `color-mix(in srgb, ${s.color} 7%, var(--bg-tertiary))`,
                borderLeft: `3px solid ${s.color}`,
              }}
            >
              <span
                className="w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center shrink-0"
                style={{ background: `color-mix(in srgb, ${s.color} 20%, transparent)`, color: s.color }}
              >
                {s.step}
              </span>
              <code className="text-[11px] text-text-secondary">{s.label}</code>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件", "主要ファイル")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {keyFiles.map((f) => (
            <FileCard key={f.name} name={f.name} size={f.size} purpose={f.purpose} color={f.color} />
          ))}
        </div>
      </Card>

      {/* Key Patterns */}
      <Card title={tx("Key Patterns", "关键设计模式", "主要パターン")} className="mb-6" accent="var(--green)">
        <div className="space-y-3">
          {patterns.map((p) => (
            <div
              key={p.name}
              className="rounded-lg border border-border/50 p-3"
              style={{ borderLeft: `3px solid ${p.color}` }}
            >
              <strong className="text-[11px] font-semibold text-text-primary">{p.name}</strong>
              <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Deep Insight */}
      <Card title={tx("Deep Insight", "深度洞察", "深い洞察")} className="mb-6" accent="var(--red)">
        <div
          className="rounded-xl p-4"
          style={{ background: "color-mix(in srgb, var(--red) 8%, var(--bg-secondary))", border: "1px solid color-mix(in srgb, var(--red) 30%, transparent)" }}
        >
          <p className="text-sm font-semibold text-text-primary mb-2">
            {tx("MCP alone is 470KB — nearly as large as React core", "MCP 服务单独就有 470KB，几乎与 React 核心相当", "MCP だけで 470KB — React コアとほぼ同じ規模")}
          </p>
          <p className="text-xs text-text-muted leading-relaxed">
            {tx(
              "The services/mcp/ subdirectory weighs 470KB across 25 files. It implements the Model Context Protocol from scratch with 4 transport types, connection pooling, server discovery, and a full permission system for tool approval. This is not a thin wrapper — it's a complete MCP runtime embedded inside Claude Code.",
              "services/mcp/ 子目录在 25 个文件中共重 470KB。它从头实现了模型上下文协议，支持 4 种传输类型、连接池、服务器发现和完整的工具审批权限系统。这不是一个薄包装层，而是嵌入 Claude Code 内部的完整 MCP 运行时。",
              "services/mcp/ サブディレクトリは 25 ファイルで 470KB あります。4 つのトランスポート、接続プール、サーバー検出、ツール承認の完全な権限システムを持つ Model Context Protocol をゼロから実装しています。薄いラッパーではなく、Claude Code に組み込まれた完全な MCP ランタイムです。"
            )}
          </p>
        </div>
      </Card>
    </div>
  );
}
