"use client";

import { PageHeader, Card, CodeBlock } from "@/components/Section";
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

export default function ServicesPage() {
  const tx = useTx();
  const serviceCards = [
    { icon: VscDatabase, name: tx("Compaction", "压缩", "圧縮"), files: 13, size: "~15K", color: "var(--accent)", desc: tx("4-level context window management", "4 级上下文窗口管理", "4段階のコンテキストウィンドウ管理") },
    { icon: VscPlug, name: "MCP", files: 25, size: "470KB", color: "var(--green)", desc: tx("External tool integration (4 transports)", "外部工具集成（4 种传输方式）", "外部ツール統合（4つのトランスポート）") },
    { icon: VscServerProcess, name: "LSP", files: 6, size: "~5K", color: "var(--orange)", desc: tx("Language Server Protocol", "语言服务器协议", "言語サーバープロトコル") },
    { icon: VscGraphLine, name: tx("Analytics", "分析", "分析"), files: 6, size: "~8K", color: "var(--purple)", desc: tx("Datadog + GrowthBook pipeline", "Datadog + GrowthBook 流水线", "Datadog + GrowthBook パイプライン") },
    { icon: VscLightbulb, name: tx("Memory", "记忆", "メモリ"), files: 5, size: "~6K", color: "var(--pink)", desc: tx("Auto-extraction + session memory", "自动提取 + 会话记忆", "自動抽出 + セッションメモリ") },
    { icon: VscServerProcess, name: tx("API", "API", "API"), files: 8, size: "~45K", color: "var(--accent)", desc: tx("Streaming client, retries, betas, prompt caching", "流式客户端、重试、betas、提示缓存", "ストリーミングクライアント、再試行、betas、プロンプトキャッシュ") },
    { icon: VscExtensions, name: tx("Tools", "工具", "ツール"), files: 2, size: "~1K", color: "var(--orange)", desc: tx("StreamingToolExecutor + orchestration", "StreamingToolExecutor + 编排", "StreamingToolExecutor + オーケストレーション") },
    { icon: VscPackage, name: tx("Plugins", "插件", "プラグイン"), files: 8, size: "~10K", color: "var(--green)", desc: tx("Plugin install + marketplace", "插件安装 + 市场", "プラグイン導入 + マーケットプレイス") },
    { icon: VscSymbolNumeric, name: tx("Tokens", "Token", "トークン"), files: 1, size: "~2K", color: "var(--accent)", desc: tx("Multi-provider token counting", "多提供商 token 计数", "複数プロバイダーのトークン計数") },
    { icon: VscGitCompare, name: tx("Bridge/Remote", "桥接/远程", "ブリッジ/リモート"), files: 20, size: "~35K", color: "var(--pink)", desc: tx("Remote sessions, work dispatch, reconnect logic", "远程会话、任务分发、重连逻辑", "リモートセッション、作業ディスパッチ、再接続ロジック") },
  ];
  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Services", "服务", "サービス")}
        description={tx(
          "Claude Code's service layer handles compaction, MCP integration, LSP, analytics, memory extraction, and more. These run as background processes alongside the main query loop.",
          "Claude Code 的服务层处理压缩、MCP 集成、LSP、分析、记忆提取等。这些作为后台进程与主查询循环并行运行。",
          "Claude Code のサービス層は、圧縮、MCP 統合、LSP、分析、メモリ抽出などを担います。これらはメインのクエリループと並行して動作します。"
        )}
        badge={tx("20+ services", "20+ 服务", "20+ サービス")}
        links={[
          { label: "services/", href: ghTree("services") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "remote/", href: ghTree("remote") },
          { label: "mcp/", href: ghTree("services/mcp") },
        ]}
      />

      {/* Service Overview */}
      <Card title={tx("Service Overview", "服务概览", "サービス概要")} className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {serviceCards.map((s) => (
            <div key={s.name} className="p-3 rounded-xl bg-bg-tertiary/30 border border-border/50">
              <s.icon className="w-4 h-4 mb-2" style={{ color: s.color }} />
              <div className="text-xs font-semibold text-text-primary mb-0.5">{s.name}</div>
              <div className="text-[10px] text-text-muted mb-1.5">{s.files} files &middot; {s.size}</div>
              <p className="text-[10px] text-text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Compaction */}
      <Card
        title={tx("Compaction System", "压缩系统", "圧縮システム")}
        className="mb-6"
        accent="var(--accent)"
        links={[
          { label: "services/compact/", href: ghTree("services/compact") },
          { label: "autoCompact.ts", href: ghBlob("services/compact/autoCompact.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Multi-level context window management keeps conversations within token limits. The system uses 4 strategies with increasing aggressiveness:",
            "多级上下文窗口管理使对话保持在 token 限制内。系统提供 4 种逐步增强的策略：",
            "多段階のコンテキスト管理により会話をトークン上限内に保ちます。システムは強度の異なる4つの戦略を使います："
          )}
        </p>
        <CodeBlock
          code={`// Token budget calculation:
effective_window = model_context (e.g., 200K for opus)
  - max_output_tokens (e.g., 16K)
  - reserved_for_summary (20K)
  = ~164K effective

autocompact_threshold = effective_window - 13K buffer

// Strategy 1: Microcompact (every API call)
  → Single-turn compression inline
  → Cached, no API call needed
  → Compresses tool results if unchanged

// Strategy 2: Autocompact (threshold trigger)
  → Full conversation summary via forked agent
  → Replaces old messages with summary + preserved tail
  → Marks boundary message with summary metrics
  → Circuit breaker: max 3 consecutive failures

// Strategy 3: History Snipping (feature-gated)
  → Removes oldest messages below threshold
  → Less aggressive than autocompact

// Strategy 4: Context Collapse (experimental)
  → Incremental context reduction
  → Builds collapse store separately
  → Projected at read-time (non-destructive)`}
        />
      </Card>

      {/* MCP */}
      <Card
        title={tx("MCP (Model Context Protocol)", "MCP（模型上下文协议）", "MCP（Model Context Protocol）")}
        className="mb-6"
        accent="var(--green)"
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
        <CodeBlock
          code={`// MCP client supports 4 transport types:
1. stdio  → Local process communication
2. SSE    → Server-Sent Events (HTTP streaming)
3. HTTP   → Standard HTTP requests
4. WebSocket → Full-duplex communication

// How MCP tools work:
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
        <CodeBlock
          code={`// Event pipeline with queue-until-sink pattern:
logEvent(name, metadata)        → Sync event logging
logEventAsync(name, metadata)   → Async event logging
attachAnalyticsSink()           → Register backend (Datadog, 1P)

// Safety type:
AnalyticsMetadata_I_VERIFIED_THIS_IS_NOT_CODE_OR_FILEPATHS
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
        title={tx("API Layer Is a Policy Engine", "API 层其实是策略引擎", "API 層は単なるクライアントではない")}
        className="mb-6"
        accent="var(--accent)"
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
        title={tx("Bridge & Remote Execution", "桥接与远程执行", "ブリッジとリモート実行")}
        className="mb-6"
        accent="var(--pink)"
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
        title={tx("Speculation & Prompt Suggestions", "推测与提示建议", "推測とプロンプト提案")}
        className="mb-6"
        accent="var(--accent)"
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
