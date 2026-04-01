"use client";

import { PageHeader, Card, CodeBlock, SectionNav } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  VscDatabase,
  VscPlug,
  VscServerProcess,
  VscGraphLine,
  VscLightbulb,
  VscExtensions,
  VscPackage,
  VscSymbolNumeric,
  VscGitCompare,
} from "react-icons/vsc";
import {
  HiOutlineArrowUp,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const tx = useTx();
  const sections = [
    { id: "service-overview", label: tx("Overview", "概览", "概要"), description: tx("A quick map of the major service families.", "主要服务家族的快速地图。", "主要サービス群の地図。") },
    { id: "compaction-system", label: tx("Compaction", "压缩", "圧縮"), description: tx("How context is kept inside model limits.", "如何让上下文保持在模型限制内。", "文脈を上限内に保つ方法。") },
    { id: "mcp-service", label: "MCP", description: tx("External tool integration and transport handling.", "外部工具集成与传输层处理。", "外部ツール統合と転送方式。") },
    { id: "api-policy", label: tx("API Layer", "API 层", "API 層"), description: tx("The request/stream/retry layer behind every turn.", "每一轮背后的请求、流处理与重试层。", "各ターンの背後にある要求・ストリーム・再試行層。") },
    { id: "bridge-remote", label: tx("Bridge/Remote", "桥接/远程", "ブリッジ/リモート"), description: tx("Remote session control-plane logic.", "远程会话控制平面逻辑。", "リモートセッション制御プレーン。") },
    { id: "speculation", label: tx("Speculation", "推测执行", "推測実行"), description: tx("PromptSuggestion and cheap background previews.", "PromptSuggestion 与低成本后台预执行。", "PromptSuggestion と安価な先読み実行。") },
  ];

  const serviceCards = [
    { icon: VscDatabase, name: tx("Compaction", "压缩", "圧縮"), files: 13, size: "~15K", color: "var(--accent)", desc: tx("4-level context window management", "4 级上下文窗口管理", "4段階のコンテキストウィンドウ管理") },
    { icon: VscPlug, name: "MCP", files: 25, size: "470KB", color: "var(--green)", desc: tx("External tool integration (4 transports)", "外部工具集成（4 种传输方式）", "外部ツール統合（4つのトランスポート）") },
    { icon: VscServerProcess, name: "LSP", files: 6, size: "~5K", color: "var(--orange)", desc: tx("Language Server Protocol", "语言服务器协议", "言語サーバープロトコル") },
    { icon: VscGraphLine, name: tx("Analytics", "分析", "分析"), files: 6, size: "~8K", color: "var(--purple)", desc: tx("Datadog + GrowthBook pipeline", "Datadog + GrowthBook 流水线", "Datadog + GrowthBook パイプライン") },
    { icon: VscLightbulb, name: tx("Memory", "记忆", "メモリ"), files: 5, size: "~6K", color: "var(--pink)", desc: tx("Auto-extraction + session memory", "自动提取 + 会话记忆", "自動抽出 + セッションメモリ") },
    { icon: VscServerProcess, name: "API", files: 8, size: "~45K", color: "var(--accent)", desc: tx("Streaming client, retries, betas, prompt caching", "流式客户端、重试、betas、提示缓存", "ストリーミングクライアント、再試行、betas、プロンプトキャッシュ") },
    { icon: VscExtensions, name: tx("Tools", "工具", "ツール"), files: 2, size: "~1K", color: "var(--orange)", desc: tx("StreamingToolExecutor + orchestration", "StreamingToolExecutor + 编排", "StreamingToolExecutor + オーケストレーション") },
    { icon: VscPackage, name: tx("Plugins", "插件", "プラグイン"), files: 8, size: "~10K", color: "var(--green)", desc: tx("Plugin install + marketplace", "插件安装 + 市场", "プラグイン導入 + マーケットプレイス") },
    { icon: VscSymbolNumeric, name: tx("Tokens", "Token", "トークン"), files: 1, size: "~2K", color: "var(--accent)", desc: tx("Multi-provider token counting", "多提供商 token 计数", "複数プロバイダーのトークン計数") },
    { icon: VscGitCompare, name: tx("Bridge/Remote", "桥接/远程", "ブリッジ/リモート"), files: 20, size: "~35K", color: "var(--pink)", desc: tx("Remote sessions, work dispatch, reconnect logic", "远程会话、任务分发、重连逻辑", "リモートセッション、作業ディスパッチ、再接続ロジック") },
  ];

  const compactionStrategies = [
    {
      name: tx("Microcompact", "微压缩", "マイクロ圧縮"),
      trigger: tx("Every API call", "每次 API 调用", "APIコール毎"),
      desc: tx("Single-turn inline compression. Uses cached tool results. No extra API call.", "单轮内联压缩，利用缓存工具结果，无需额外 API 调用。", "単一ターンのインライン圧縮。キャッシュ済みツール結果を利用。追加API不要。"),
      color: "var(--accent)",
      intensity: 1,
    },
    {
      name: tx("History Snipping", "历史裁剪", "履歴スニッピング"),
      trigger: tx("Feature-gated threshold", "功能门控阈值", "機能ゲート閾値"),
      desc: tx("Removes oldest messages below threshold. Less aggressive than autocompact.", "移除低于阈值的最旧消息，比 autocompact 温和。", "閾値以下の古いメッセージを削除。autocompactより穏やか。"),
      color: "var(--green)",
      intensity: 2,
    },
    {
      name: tx("Autocompact", "自动压缩", "自動圧縮"),
      trigger: tx("Token threshold trigger", "Token 阈值触发", "トークン閾値トリガー"),
      desc: tx("Full conversation summary via forked agent. Replaces old messages. Circuit breaker: max 3 failures.", "通过 fork 代理生成完整会话摘要，替换旧消息，熔断器：最多 3 次失败。", "forkエージェントで完全な会話要約。旧メッセージを置換。サーキットブレーカー：最大3回失敗。"),
      color: "var(--orange)",
      intensity: 3,
    },
    {
      name: tx("Context Collapse", "上下文折叠", "コンテキストコラプス"),
      trigger: tx("Experimental", "实验性", "実験的"),
      desc: tx("Incremental context reduction. Builds collapse store separately. Projected at read-time (non-destructive).", "增量上下文缩减，单独构建折叠存储，读取时投影（非破坏性）。", "段階的なコンテキスト縮小。折りたたみストアを別途構築。読み取り時にプロジェクション（非破壊）。"),
      color: "var(--red)",
      intensity: 4,
    },
  ];

  const mcpTransports = [
    {
      name: "stdio",
      icon: "⚡",
      desc: tx("Local process communication", "本地进程通信", "ローカルプロセス通信"),
      color: "var(--accent)",
      latency: tx("Lowest — direct pipe", "最低 — 直接管道", "最低 — 直接パイプ"),
      useCase: tx("Local tools, shell commands, filesystem access", "本地工具、shell 命令、文件系统访问", "ローカルツール、シェルコマンド、ファイルアクセス"),
    },
    {
      name: "SSE",
      icon: "📡",
      desc: tx("Server-Sent Events (HTTP streaming)", "服务器推送事件（HTTP 流）", "Server-Sent Events（HTTPストリーミング）"),
      color: "var(--green)",
      latency: tx("Low — persistent HTTP stream", "低 — 持久 HTTP 流", "低 — 持続HTTPストリーム"),
      useCase: tx("Remote servers with streaming responses", "支持流式响应的远程服务器", "ストリーミングレスポンスのリモートサーバー"),
    },
    {
      name: "HTTP",
      icon: "🌐",
      desc: tx("Standard HTTP requests", "标准 HTTP 请求", "標準HTTPリクエスト"),
      color: "var(--orange)",
      latency: tx("Medium — per-request round trip", "中 — 每次请求往返", "中 — リクエスト毎のラウンドトリップ"),
      useCase: tx("REST APIs, web services, stateless tools", "REST API、Web 服务、无状态工具", "REST API、Webサービス、ステートレスツール"),
    },
    {
      name: "WebSocket",
      icon: "🔌",
      desc: tx("Full-duplex communication", "全双工通信", "全二重通信"),
      color: "var(--purple)",
      latency: tx("Low — persistent bidirectional", "低 — 持久双向连接", "低 — 持続双方向接続"),
      useCase: tx("Real-time tools, interactive services", "实时工具、交互式服务", "リアルタイムツール、インタラクティブサービス"),
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Services", "服务", "サービス")}
        description={tx(
          "Claude Code's service layer handles compaction, MCP integration, LSP, analytics, memory extraction, and more — running in parallel with the main query loop.",
          "Claude Code 的服务层处理压缩、MCP 集成、LSP、分析、记忆提取等，与主查询循环并行运行。",
          "Claude Code のサービス層は圧縮、MCP統合、LSP、分析、メモリ抽出などを担い、メインのクエリループと並行して動作します。"
        )}
        badge={tx("20+ services", "20+ 服务", "20+ サービス")}
        links={[
          { label: "services/", href: ghTree("services") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "remote/", href: ghTree("remote") },
          { label: "mcp/", href: ghTree("services/mcp") },
        ]}
      />
      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-xl border-l-4 bg-bg-secondary p-4 sm:p-5"
        style={{ borderLeftColor: "var(--green)" }}
      >
        <div className="text-[10px] font-semibold uppercase tracking-wider text-green mb-1.5">
          {tx("Key Insight", "核心洞察", "重要なポイント")}
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {tx(
            "MCP is the largest single service at 470KB across 25 files — larger than BashTool. External tool integration is treated as a first-class architectural concern, not an afterthought.",
            "MCP 是最大的单个服务，25 个文件共 470KB，比 BashTool 还大。外部工具集成被视为一等架构关注点，而非事后添加。",
            "MCPは25ファイル・470KBで最大のサービスです。BashToolより大きい。外部ツール統合は後付けではなく、最優先の設計課題として扱われています。"
          )}
        </p>
      </motion.div>

      {/* Service Overview */}
      <Card id="service-overview" title={tx("Service Overview", "服务概览", "サービス概要")} className="mb-6" summary={tx("Start here to see which responsibilities live outside the main query loop.", "如果你想先弄清哪些职责不在主 query loop 内部，先看这里。", "メイン query loop の外にある責務を整理する入口です。")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((s) => (
            <div key={s.name} className="group p-4 rounded-xl border transition-shadow hover:shadow-sm"
              style={{
                background: `color-mix(in srgb, ${s.color} 5%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${s.color} 15%, var(--border))`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono"
                  style={{ color: s.color, background: `color-mix(in srgb, ${s.color} 10%, transparent)` }}
                >
                  {s.size}
                </span>
              </div>
              <div className="text-xs font-semibold text-text-primary mb-0.5">{s.name}</div>
              <div className="text-[10px] text-text-muted mb-1.5">{s.files} {tx("files", "文件", "ファイル")}</div>
              <p className="text-[10px] text-text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Compaction — Escalation Ladder */}
      <Card
        id="compaction-system"
        title={tx("Compaction System", "压缩系统", "圧縮システム")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("This section explains how Claude Code keeps long sessions alive instead of hitting a hard wall.", "这一节解释 Claude Code 如何维持超长会话，而不是直接撞上上下文墙。", "長い会話を打ち切らずに維持する仕組みです。")}
        links={[
          { label: "services/compact/", href: ghTree("services/compact") },
          { label: "autoCompact.ts", href: ghBlob("services/compact/autoCompact.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Multi-level context window management keeps conversations within token limits. Four strategies with increasing aggressiveness:",
            "多级上下文窗口管理使对话保持在 token 限制内。四种策略按积极程度逐级递增：",
            "多段階のコンテキスト管理により会話をトークン上限内に保ちます。強度の異なる4つの戦略："
          )}
        </p>

        {/* Escalation ladder */}
        <div className="mb-5 space-y-2">
          {compactionStrategies.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-xl border p-4"
              style={{
                background: `color-mix(in srgb, ${s.color} 6%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${s.color} 20%, var(--border))`,
              }}
            >
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                {/* Intensity bar */}
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="w-1.5 h-3 rounded-sm"
                      style={{
                        background: n <= s.intensity ? s.color : `color-mix(in srgb, ${s.color} 15%, var(--bg-tertiary))`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-bg-secondary border border-border text-text-muted">
                    {s.trigger}
                  </span>
                  {i > 0 && (
                    <span className="text-[9px] flex items-center gap-0.5 text-text-muted">
                      <HiOutlineArrowUp className="w-3 h-3" />
                      {tx("more aggressive", "更激进", "より積極的")}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <CodeBlock
          code={`// Token budget calculation:
effective_window = model_context (e.g., 200K for opus)
  - max_output_tokens (e.g., 16K)
  - reserved_for_summary (20K)
  = ~164K effective

autocompact_threshold = effective_window - 13K buffer`}
        />
      </Card>

      {/* MCP */}
      <Card
        id="mcp-service"
        title={tx("MCP (Model Context Protocol)", "MCP（模型上下文协议）", "MCP（Model Context Protocol）")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("Read this when you want to understand how Claude Code turns external MCP servers into first-class tools.", "如果你想理解 Claude Code 如何把外部 MCP 服务变成一等工具，读这一节。", "外部 MCP サーバーを一等ツールにする方法です。")}
        links={[
          { label: "services/mcp/", href: ghTree("services/mcp") },
          { label: "client.ts", href: ghBlob("services/mcp/client.ts") },
          { label: "auth.ts", href: ghBlob("services/mcp/auth.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The MCP service is the largest service at 470KB across 25 files. It enables Claude Code to integrate external tools from any MCP-compatible server.",
            "MCP 是最大的服务模块，25 个文件共 470KB。它让 Claude Code 能接入任何兼容 MCP 的外部工具服务器。",
            "MCP は25ファイル・470KBに及ぶ最大級のサービスです。Claude Code が MCP 互換サーバー上の外部ツールを統合できるようにします。"
          )}
        </p>

        {/* 4 Transport Types Grid — big cards */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mcpTransports.map(({ name, icon, desc, color, latency, useCase }) => (
            <div
              key={name}
              className="rounded-2xl border p-4 sm:p-5"
              style={{
                background: `color-mix(in srgb, ${color} 6%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color }}>{name}</div>
                  <div className="text-[10px] text-text-muted">{desc}</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted shrink-0 pt-0.5">
                    {tx("Latency", "延迟", "レイテンシ")}
                  </span>
                  <span className="text-[10px] text-text-secondary">{latency}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted shrink-0 pt-0.5">
                    {tx("Use", "用途", "用途")}
                  </span>
                  <span className="text-[10px] text-text-secondary">{useCase}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`// How MCP tools work:
1. MCP server exposes tools via JSON schema
2. mcpClient.ts patches MCPTool definition at runtime:
   - Sets real tool name (e.g., "mcp_weather_get_current")
   - Injects actual input/output schemas
   - Wires up call() to invoke MCP server RPC
3. MCPTool uses passthrough schema (z.object({}).passthrough())
4. No validation at Claude Code layer — MCP server is responsible

// Key files:
client.ts    — 119KB — Protocol client orchestrator
config.ts    — 51KB  — Settings, env vars, server validation
auth.ts      — 88KB  — OAuth flow, token management
elicitationHandler.ts — User prompts during tool calls`}
        />
      </Card>

      {/* LSP */}
      <Card
        title={tx("LSP (Language Server Protocol)", "LSP（语言服务器协议）", "LSP（Language Server Protocol）")}
        className="mb-6"
        accent="var(--orange)"
        links={[
          { label: "services/lsp/", href: ghTree("services/lsp") },
          { label: "index.ts", href: ghBlob("services/lsp/index.ts") },
        ]}
      >
        {/* 3-step integration flow */}
        <div className="mb-4 rounded-2xl border border-border bg-bg-tertiary/30 p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">
            {tx("FileEditTool → LSP integration flow", "FileEditTool → LSP 集成流程", "FileEditTool → LSP統合フロー")}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-2">
            {[
              { step: "1", label: tx("FileEditTool saves", "FileEditTool 保存", "FileEditTool保存"), detail: tx("File written to disk", "文件写入磁盘", "ファイルをディスクに書込"), color: "var(--orange)" },
              { step: "2", label: tx("Notifies LSP", "通知 LSP", "LSPに通知"), detail: tx("didChange/didSave event sent", "发送 didChange/didSave 事件", "didChange/didSaveイベント送信"), color: "var(--accent)" },
              { step: "3", label: tx("Triggers diagnostics", "触发诊断", "診断をトリガー"), detail: tx("Errors & warnings surfaced to model", "错误和警告暴露给模型", "エラー・警告をモデルに提供"), color: "var(--green)" },
            ].map(({ step, label, detail, color }, i) => (
              <div key={step} className="flex sm:flex-col sm:flex-1 items-center sm:items-stretch gap-2 sm:gap-0">
                <div
                  className="flex-1 sm:flex-none rounded-xl border p-3"
                  style={{
                    background: `color-mix(in srgb, ${color} 7%, var(--bg-secondary))`,
                    borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
                  }}
                >
                  <span
                    className="text-[9px] font-bold w-4 h-4 rounded-full inline-flex items-center justify-center mb-1.5"
                    style={{ background: color, color: "white" }}
                  >
                    {step}
                  </span>
                  <div className="text-[11px] font-semibold text-text-primary mb-0.5">{label}</div>
                  <div className="text-[9px] text-text-muted">{detail}</div>
                </div>
                {i < 2 && (
                  <div className="flex items-center justify-center shrink-0 sm:py-1.5">
                    <HiOutlineArrowRight className="hidden sm:block w-4 h-4 text-border" />
                    <HiOutlineArrowRight className="sm:hidden w-4 h-4 text-border rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <CodeBlock
          code={`// LSP provides IDE-like features:
- Diagnostics (errors, warnings)
- Hover information
- Go-to-definition
- Code completions

// Architecture:
LSPServerManager (singleton)
  └─ LSPServerInstance[] (per language/framework)
       └─ LSPClient (protocol implementation)
            └─ LSPDiagnosticRegistry (collects diagnostics)

// Lifecycle:
initializeLspServerManager()  → Async init with generation counter
getLspServerManager()          → Get active manager (undefined if not ready)
getInitializationStatus()      → not-started | pending | success | failed

// Integration with tools:
FileEditTool → Notifies LSP of file changes → Triggers diagnostics
FileWriteTool → Same notification path
LSPTool → Direct query interface for the model`}
        />
      </Card>

      {/* Analytics */}
      <Card
        title={tx("Analytics Pipeline", "分析流水线", "分析パイプライン")}
        className="mb-6"
        accent="var(--purple)"
        links={[
          { label: "services/analytics/", href: ghTree("services/analytics") },
          { label: "index.ts", href: ghBlob("services/analytics/index.ts") },
        ]}
      >
        {/* PII safety type callout — this is genuinely hilarious */}
        <div
          className="mb-5 rounded-2xl border-2 p-4"
          style={{ borderColor: "var(--purple)", background: "color-mix(in srgb, var(--purple) 6%, var(--bg-secondary))" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple mb-2">
            {tx("Best TypeScript type name in the codebase", "代码库中最佳 TypeScript 类型名", "コードベース最高のTypeScript型名")}
          </div>
          <div className="overflow-x-auto">
            <code
              className="block text-[11px] sm:text-xs font-bold font-mono py-2 px-3 rounded-lg leading-relaxed whitespace-nowrap"
              style={{ color: "var(--purple)", background: "color-mix(in srgb, var(--purple) 10%, var(--bg-primary))" }}
            >
              AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
            </code>
          </div>
          <p className="mt-2 text-[11px] text-text-muted leading-relaxed">
            {tx(
              "This is a real TypeScript type. The name itself is the enforcement mechanism — every analytics event must be typed with this, forcing the developer to consciously confirm they aren't accidentally logging user code or file paths. It's the most creative use of a type name for PII safety we've ever seen.",
              "这是真实存在的 TypeScript 类型名。类型名本身就是执行机制——每个分析事件都必须用这个类型，强制开发者有意识地确认没有意外记录用户代码或文件路径。这是我们见过的最具创意的 PII 安全类型命名。",
              "これは実際のTypeScript型名です。名前自体が実施機構になっています。すべての分析イベントをこの型でタイプする必要があり、開発者がユーザーコードやファイルパスを誤ってログしていないことを意識的に確認することを強制します。PII安全のための型名の最も創造的な使用例です。"
            )}
          </p>
        </div>

        <CodeBlock
          code={`// Event pipeline with queue-until-sink pattern:
logEvent(name, metadata)        → Sync event logging
logEventAsync(name, metadata)   → Async event logging
attachAnalyticsSink()           → Register backend (Datadog, 1P)

// The safety type — you must use this for every analytics event:
type AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS = { ... }
// → Enforces: no file content, no user code in analytics

// PII handling:
_PROTO_* keys → PII-tagged columns (Anthropic 1P only)
stripProtoFields() → Removes PII before Datadog fanout

// GrowthBook integration (feature gates):
checkStatsigFeatureGate_CACHED_MAY_BE_STALE()
// → Cached gate values prevent blocking on init
// → User attributes: ID, session, platform, org, subscription
// → A/B experiment tracking with variation IDs`}
        />
      </Card>

      <Card
        id="api-policy"
        title={tx("API Layer Is a Policy Engine", "API 层其实是策略引擎", "API 層は単なるクライアントではない")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("This is the deeper service section: the API layer decides caching, retries, betas, and stream normalization.", "这是更底层的一节：API 层负责缓存、重试、betas 以及流式结果规范化。", "より深いサービス層で、キャッシュ、再試行、beta、ストリーム正規化を担います。")}
        links={[
          { label: "services/api/claude.ts", href: ghBlob("services/api/claude.ts") },
          { label: "services/api/withRetry.ts", href: ghBlob("services/api/withRetry.ts") },
          { label: "utils/api.ts", href: ghBlob("utils/api.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "One of the easiest things to underestimate in Claude Code is the API client. claude.ts is not a thin transport wrapper: it decides which beta headers to send, how to split cacheable vs dynamic system prompt sections, how to retry recoverable failures, when to record quota/cost state, and how to normalize streamed content back into the internal message model.",
            "Claude Code 最容易被低估的部分之一就是 API 客户端。claude.ts 并不是一个薄薄的传输封装层：它会决定发送哪些 beta headers、如何切分可缓存与动态 system prompt、怎样重试可恢复失败、何时记录配额/成本状态，以及如何把流式内容规范化回内部消息模型。",
            "Claude Code で見落とされやすいのが API クライアントです。claude.ts は単なる転送ラッパーではなく、送る beta header、キャッシュ可能/動的システムプロンプトの分割、再試行方針、quota/cost 記録、ストリーム結果の内部メッセージ正規化まで担います。"
          )}
        </p>
        <CodeBlock
          code={`// services/api/claude.ts
build request:
  → normalizeMessagesForAPI(...)
  → splitSysPromptPrefix(...) for prompt caching
  → choose beta headers (fast mode, effort, structured outputs, tool search)
  → attach attribution + client request IDs

stream response:
  → normalizeContentFromAPI(...)
  → ensureToolResultPairing(...)
  → capture usage deltas + request fingerprints
  → update quota/cost/session activity

failure path:
  → withRetry(...)
  → distinguish abort / timeout / 529 / fallback-triggered cases
  → emit assistant-visible API error messages`}
        />
      </Card>

      <Card
        id="bridge-remote"
        title={tx("Bridge & Remote Execution", "桥接与远程执行", "ブリッジとリモート実行")}
        className="mb-6"
        accent="var(--pink)"
        summary={tx("Use this section to understand how Claude Code can operate as remote capacity, not only as a local CLI loop.", "如果你想理解 Claude Code 如何不只作为本地 CLI，而是远程执行容量的一部分，就看这里。", "ローカル CLI を超えて遠隔実行基盤として動く仕組みです。")}
        links={[
          { label: "bridgeMain.ts", href: ghBlob("bridge/bridgeMain.ts") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The newer repo has a substantial bridge/remote layer that the older analysis pages barely mentioned. bridgeMain.ts is effectively a miniature control plane: it polls for work, spawns or reconnects sessions, heartbeats active jobs, refreshes ingress tokens, manages worktrees, and tears sessions down safely.",
            "新版本仓库里有一整层桥接/远程执行基础设施，而旧页面几乎没提。bridgeMain.ts 本质上是一个迷你控制平面：轮询任务、生成或重连会话、对活跃任务心跳保活、刷新入口令牌、管理 worktree，并在结束时安全回收。",
            "新しいリポジトリには大きな bridge/remote 層がありますが、既存ページではほとんど触れていませんでした。bridgeMain.ts は小さな control plane のようなもので、作業のポーリング、セッション生成/再接続、heartbeat、トークン更新、worktree 管理、安全な終了処理を担います。"
          )}
        </p>
        <CodeBlock
          code={`// bridge/bridgeMain.ts
runBridgeLoop(config, environmentId, secret, api, spawner, logger, signal)
  → poll bridge API for work
  → spawn local session or reconnect existing session
  → send heartbeatWork() for active jobs
  → refresh ingress/JWT tokens
  → create/remove agent worktrees
  → wake capacity when sessions finish
  → stop or reconnect timed-out sessions

// related files:
sessionRunner.ts        // child session spawning
workSecret.ts           // SDK / worker registration secrets
bridgeApi.ts            // typed bridge API client
remote/*.ts             // session manager + websocket transport`}
        />
      </Card>

      <Card
        id="speculation"
        title={tx("Speculation & Prompt Suggestions", "推测与提示建议", "推測とプロンプト提案")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("This explains the hidden background work Claude Code performs to make the next step feel faster.", "这一节解释 Claude Code 为了让下一步更快所做的隐藏后台工作。", "次の一手を速く見せるための裏側の処理を説明します。")}
        links={[
          { label: "services/PromptSuggestion/", href: ghTree("services/PromptSuggestion") },
          { label: "speculation.ts", href: ghBlob("services/PromptSuggestion/speculation.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Another service family worth studying is PromptSuggestion. It is no longer just a UI nicety: speculation.ts creates copy-on-write overlays under /tmp, forks a cheap background agent using cache-safe params, pre-executes likely next steps, and can copy successful writes back into the main working directory.",
            "另一个值得研究的服务族是 PromptSuggestion。它已经不只是 UI 小功能：speculation.ts 会在 /tmp 下创建 copy-on-write overlay，使用 cache-safe params fork 一个廉价后台代理，预执行可能的下一步，并在成功时把写入结果拷回主工作目录。",
            "もう一つ注目すべきサービス群が PromptSuggestion です。もはや単なる UI 補助ではなく、speculation.ts は /tmp に copy-on-write overlay を作り、cache-safe params で軽量 fork agent を走らせ、次の一手を先回り実行し、成功した書き込みを本作業ディレクトリへ戻すことまであります。"
          )}
        </p>
        <CodeBlock
          code={`// services/PromptSuggestion/speculation.ts
getOverlayPath(id) → /tmp/.../speculation/<pid>/<id>
prepareMessagesForInjection(messages)
runForkedAgent(cacheSafeParams, ...)
copyOverlayToMain(overlayPath, writtenPaths, cwd)

guards:
- stop at write tools outside the overlay rules
- stop on denied tools or non-read-only bash
- cap to 20 turns / 100 messages
- log speculation outcome + time saved`}
        />
      </Card>

      {/* Tool Orchestration */}
      <Card
        title={tx("Tool Orchestration Service", "工具编排服务", "ツールオーケストレーションサービス")}
        links={[
          { label: "toolOrchestration.ts", href: ghBlob("services/tools/toolOrchestration.ts") },
          { label: "StreamingToolExecutor.ts", href: ghBlob("services/tools/StreamingToolExecutor.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "There are really two orchestration layers. toolOrchestration.ts handles already-buffered tool blocks in ordered batches; StreamingToolExecutor handles the earlier phase where tool_use blocks are still arriving over the wire and must be launched optimistically without breaking ordering guarantees.",
            "实际上有两层编排。toolOrchestration.ts 负责处理已经缓冲好的 tool blocks，并按批次有序执行；StreamingToolExecutor 则负责更早的阶段，在 tool_use blocks 仍从流中到达时就乐观启动执行，同时不破坏顺序保证。",
            "実際には2層のオーケストレーションがあります。toolOrchestration.ts は既にバッファ済みの tool block を順序付きバッチで処理し、StreamingToolExecutor は tool_use block がまだストリームで到着中の段階から楽観的に起動しつつ順序保証を守ります。"
          )}
        </p>
        <CodeBlock
          code={`// services/tools/ — Two key files:

// 1. toolOrchestration.ts (189 lines) — runTools() generator
//    Batch partitioning and serial/concurrent execution
//    Read-only batch → up to 10 parallel
//    Write batch → serial with context modifiers

// 2. StreamingToolExecutor.ts (226 lines)
//    Concurrent execution while model streams
//    addTool() → enqueue as tool_use blocks arrive
//    processQueue() → respect concurrency constraints
//    getCompletedResults() → yield finished results
//    discard() → cleanup on streaming fallback
//    siblingAbortController → kill sibling subprocesses on bash error`}
        />
      </Card>
    </div>
  );
}
