"use client";

import { PageHeader, Card, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";

export default function ServicesModulePage() {
  const tx = useTx();

  const keyFiles = [
    ["services/api/claude.ts", tx("3500+ lines — API client, streaming, token management", "3500+ 行 — API 客户端、流式处理、token 管理", "3500行以上 — APIクライアント、ストリーミング、トークン管理")],
    ["services/mcp/client.ts", tx("119KB MCP protocol client — 4 transport types (stdio, SSE, HTTP, WS)", "119KB MCP 协议客户端 — 支持 4 种传输类型", "119KB MCP プロトコルクライアント — 4 つのトランスポート")],
    ["services/compact/", tx("13 files — context window compression pipeline", "13 个文件 — 上下文窗口压缩管道", "13ファイル — コンテキストウィンドウ圧縮パイプライン")],
    ["services/lsp/", tx("6 files — Language Server Protocol diagnostics integration", "6 个文件 — 语言服务器协议诊断集成", "6ファイル — Language Server Protocol 診断統合")],
    ["services/extractMemories/", tx("Background agent that mines conversation for persistent memories", "后台代理，从对话中挖掘并持久化记忆", "会話から記憶を抽出するバックグラウンドエージェント")],
    ["services/analytics/", tx("Event pipeline: Datadog + first-party analytics, async drain", "事件管道：Datadog + 自有分析，异步排队", "イベントパイプライン: Datadog + 自社分析、非同期ドレイン")],
    ["services/tools/", tx("Tool orchestration, StreamingToolExecutor, concurrency guard", "工具编排、StreamingToolExecutor、并发守卫", "ツール編成、StreamingToolExecutor、並行ガード")],
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

      {/* Key Files */}
      <Card title={tx("Key Files", "核心文件", "主要ファイル")} className="mb-6">
        <Table
          headers={[tx("File", "文件", "ファイル"), tx("Purpose", "用途", "目的")]}
          rows={keyFiles}
        />
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
