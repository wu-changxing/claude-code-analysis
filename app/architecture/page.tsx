"use client";

import { PageHeader, Card, CodeBlock, Table } from "@/components/Section";
import { useTx } from "@/components/T";
import { CLAUDE_CODE_REPO, ghBlob, ghTree } from "@/lib/sourceLinks";
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
    <div className="page-shell">
      <PageHeader
        title={tx("Architecture", "系统架构", "アーキテクチャ")}
        description={tx(
          "High-level system design of Claude Code — how the TypeScript monolith is organized, key abstractions, and the data flow between components.",
          "Claude Code 的高层系统设计 — TypeScript 单体应用的组织方式、核心抽象和组件间的数据流。",
          "Claude Code の高レベルなシステム設計。TypeScript モノリスの構成、主要な抽象、コンポーネント間のデータフローを解説。"
        )}
        badge={tx("~1800 files", "约 1800 个文件", "約1800ファイル")}
        links={[
          { label: tx("Repo", "仓库", "リポジトリ"), href: CLAUDE_CODE_REPO },
          { label: "src/", href: ghTree("") },
          { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
          { label: "query.ts", href: ghBlob("query.ts") },
        ]}
      />

      {/* Directory Map */}
      <Card
        title={tx("Directory Structure", "目录结构", "ディレクトリ構成")}
        className="mb-6"
        links={[
          { label: "src/", href: ghTree("") },
          { label: "services/", href: ghTree("services") },
          { label: "tools/", href: ghTree("tools") },
          { label: "bridge/", href: ghTree("bridge") },
        ]}
      >
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
├── bridge/            # Remote session bridge / control plane
├── remote/            # Remote session manager + websocket adapters
├── components/        # Ink UI components (React for terminal)
├── ink/               # Terminal rendering engine (custom fork)
├── hooks/             # React hooks + permission hooks
├── utils/             # Utilities (bash, git, permissions, etc.)
└── types/             # TypeScript type definitions`}
        />
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "The important update from the current source tree is that Claude Code is no longer just a local REPL plus tools. It now has explicit bridge/remote subsystems, richer prompt-suggestion/speculation services, and much more session infrastructure around the original query loop.",
            "当前源码树最重要的新变化是：Claude Code 已经不只是本地 REPL 加一组工具。它现在有明确的 bridge/remote 子系统、更完整的 prompt-suggestion/speculation 服务，以及围绕原始查询循环构建的大量会话基础设施。",
            "現在のソースツリーで重要なのは、Claude Code がもはや「ローカル REPL + ツール」だけではないことです。bridge/remote サブシステム、より厚い prompt-suggestion/speculation サービス、そして元の query loop を取り巻く多くのセッション基盤が加わっています。"
          )}
        </p>
      </Card>

      {/* Key Abstractions */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card
          title={tx("Core Abstractions", "核心抽象", "主要な抽象")}
          accent="var(--accent)"
          links={[
            { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
            { label: "query.ts", href: ghBlob("query.ts") },
            { label: "Tool.ts", href: ghBlob("Tool.ts") },
          ]}
        >
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <code className="text-accent text-xs">QueryEngine</code>
              <p className="mt-1 text-xs">
                {tx(
                  "Owns the complete conversation lifecycle. Async generator that yields SDKMessage objects. Handles system prompt assembly, user input processing, and delegates to query() loop.",
                  "负责完整的会话生命周期。它是会产出 SDKMessage 的异步生成器，处理系统提示构建、用户输入处理，并把执行委派给 query() 循环。",
                  "会話ライフサイクル全体を担います。SDKMessage を yield する async generator であり、システムプロンプト構築、ユーザー入力処理、query() ループへの委譲を行います。"
                )}
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">query()</code>
              <p className="mt-1 text-xs">
                {tx(
                  "The main agentic loop — a state machine that streams API responses, executes tools, handles recovery, and decides whether to continue or exit.",
                  "主代理循环，是一个负责流式处理 API 响应、执行工具、处理恢复逻辑并决定继续还是退出的状态机。",
                  "メインのエージェントループであり、API 応答のストリーミング、ツール実行、回復処理、継続/終了判定を行う状態機械です。"
                )}
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">Tool&lt;Input, Output, Progress&gt;</code>
              <p className="mt-1 text-xs">
                {tx(
                  "Unified interface for all tools. Built via buildTool() factory. Declares permissions, concurrency safety, and rendering.",
                  "所有工具统一遵循的接口。通过 buildTool() 工厂构建，并声明权限、并发安全性和渲染行为。",
                  "全ツール共通のインターフェースです。buildTool() ファクトリで構築され、権限、並行安全性、レンダリング方法を宣言します。"
                )}
              </p>
            </div>
            <div>
              <code className="text-accent text-xs">ToolUseContext</code>
              <p className="mt-1 text-xs">
                {tx(
                  "Central communication channel between tools and the query loop. Contains options, state accessors, abort controller, analytics.",
                  "工具与查询循环之间的中央通信通道，包含选项、状态访问器、中止控制器和分析能力。",
                  "ツールとクエリループの中心的な通信経路です。options、状態アクセサ、abort controller、analytics を含みます。"
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card
          title={tx("Design Patterns", "设计模式", "設計パターン")}
          accent="var(--green)"
          links={[
            { label: "query.ts", href: ghBlob("query.ts") },
            { label: "services/tools/", href: ghTree("services/tools") },
            { label: "state/", href: ghTree("state") },
          ]}
        >
          <div className="space-y-3 text-sm text-text-secondary">
            <div>
              <strong className="text-text-primary text-xs">Async Generator Architecture</strong>
              <p className="mt-1 text-xs">
                {tx(
                  "Both QueryEngine and query() are async generators that yield intermediate results for real-time streaming.",
                  "QueryEngine 和 query() 都是 async generator，会产出中间结果以支持实时流式输出。",
                  "QueryEngine と query() はどちらも async generator であり、リアルタイム配信のために中間結果を yield します。"
                )}
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">Streaming Concurrency</strong>
              <p className="mt-1 text-xs">
                {tx(
                  "Tools start executing while the model is still generating. StreamingToolExecutor queues tool_use blocks as they arrive.",
                  "模型仍在生成时工具就开始执行。StreamingToolExecutor 会在 tool_use 块到达时立即入队。",
                  "モデルがまだ生成中でもツール実行を開始します。StreamingToolExecutor は到着した tool_use ブロックを即座にキューへ入れます。"
                )}
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">Cache Sharing (CacheSafeParams)</strong>
              <p className="mt-1 text-xs">
                {tx(
                  "Frozen system prompt bytes enable zero-cost forked queries for subagents. Identical bytes = automatic prompt cache hit.",
                  "被冻结的系统提示字节使子代理的 fork 查询几乎零成本。字节完全一致就会自动命中 prompt cache。",
                  "凍結されたシステムプロンプトのバイト列により、サブエージェントの fork クエリがほぼ無料になります。同一バイト列なら自動で prompt cache hit です。"
                )}
              </p>
            </div>
            <div>
              <strong className="text-text-primary text-xs">DeepImmutable State</strong>
              <p className="mt-1 text-xs">
                {tx(
                  "Zustand-like AppState with type-safe mutations. setAppState(prev => {...prev, field: newValue}).",
                  "类似 Zustand 的 AppState，并支持类型安全的状态变更，例如 setAppState(prev => {...prev, field: newValue})。",
                  "Zustand 風の AppState と型安全な更新方式です。例: setAppState(prev => {...prev, field: newValue})。"
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Size Comparison */}
      <Card title={tx("Codebase Size Comparison", "代码库规模对比", "コードベース規模の比較")} className="mb-6" accent="var(--accent)">
        <p className="text-xs text-text-muted mb-4">
          {tx(
            "Lines of code compared to well-known projects (approximate):",
            "与知名项目对比的大致代码行数：",
            "著名プロジェクトと比較した概算行数："
          )}
        </p>
        <div className="space-y-2.5">
          {[
            { name: "Linux 1.0 (1994)", lines: 176000, color: "var(--green)" },
            { name: "jQuery 3.x", lines: 10000, color: "var(--orange)" },
            { name: "Express.js", lines: 14000, color: "var(--orange)" },
            { name: "React (core)", lines: 200000, color: "var(--accent)" },
            { name: "Claude Code v2.1.88", lines: 512664, color: "var(--red)", highlight: true },
          ].map((p) => (
            <div key={p.name} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className={`text-xs sm:w-40 sm:shrink-0 ${p.highlight ? "font-semibold text-text-primary" : "text-text-muted"}`}>
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
      <Card title={tx("Top 10 Largest Files", "最大文件 Top 10", "最大ファイル Top 10")} className="mb-6" accent="var(--red)">
        <div className="overflow-x-auto">
          <div className="min-w-[560px] space-y-1.5">
          {[
            { file: "cli/print.ts", lines: 5594, desc: tx("Formatted terminal output", "格式化终端输出", "整形済みターミナル出力") },
            { file: "utils/messages.ts", lines: 5512, desc: tx("Message creation & formatting", "消息创建与格式化", "メッセージ生成と整形") },
            { file: "utils/sessionStorage.ts", lines: 5105, desc: tx("Session persistence", "会话持久化", "セッション永続化") },
            { file: "utils/hooks.ts", lines: 5022, desc: tx("React hooks for REPL", "REPL 用 React hooks", "REPL 向け React hooks") },
            { file: "screens/REPL.tsx", lines: 5005, desc: tx("Main REPL screen", "主 REPL 界面", "メイン REPL 画面") },
            { file: "main.tsx", lines: 4683, desc: tx("CLI initialization", "CLI 初始化", "CLI 初期化") },
            { file: "utils/bash/bashParser.ts", lines: 4436, desc: tx("Bash AST parser", "Bash AST 解析器", "Bash AST パーサ") },
            { file: "utils/attachments.ts", lines: 3997, desc: tx("Attachment prefetch", "附件预取", "添付の事前取得") },
            { file: "services/api/claude.ts", lines: 3419, desc: tx("API client + streaming", "API 客户端 + 流式处理", "API クライアント + ストリーミング") },
            { file: "services/mcp/client.ts", lines: 3348, desc: tx("MCP protocol client", "MCP 协议客户端", "MCP プロトコルクライアント") },
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
        </div>
      </Card>

      {/* Module Size Breakdown */}
      <Card title={tx("Module Size Breakdown", "模块规模拆解", "モジュール別規模")} className="mb-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {[
            { icon: VscExtensions, name: tx("Tools", "工具", "ツール"), files: 140, lines: "~65K", color: "var(--orange)" },
            { icon: VscDatabase, name: tx("Services", "服务", "サービス"), files: 110, lines: "~80K", color: "var(--green)" },
            { icon: VscCode, name: tx("Utils", "工具库", "ユーティリティ"), files: 220, lines: "~60K", color: "var(--accent)" },
            { icon: VscSymbolStructure, name: tx("Components", "组件", "コンポーネント"), files: 346, lines: "~40K", color: "var(--purple)" },
            { icon: VscTerminalBash, name: tx("Commands", "命令", "コマンド"), files: 110, lines: "~8K", color: "var(--orange)" },
            { icon: VscServerProcess, name: tx("Query/Engine", "查询/引擎", "Query/Engine"), files: 15, lines: "~15K", color: "var(--green)" },
            { icon: VscShield, name: tx("Permissions", "权限", "権限"), files: 30, lines: "~20K", color: "var(--red)" },
            { icon: VscDatabase, name: tx("Bridge", "桥接层", "ブリッジ"), files: 12, lines: "~13K", color: "var(--pink)" },
          ].map((m) => (
            <div key={m.name} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50">
              <m.icon className="w-4 h-4 mb-2" style={{ color: m.color }} />
              <div className="text-xs font-semibold text-text-primary">{m.name}</div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {m.files} {tx("files", "个文件", "ファイル")} &middot; {m.lines} {tx("lines", "行", "行")}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card title={tx("Technology Stack", "技术栈", "技術スタック")} className="mb-6">
        <Table
          headers={[
            tx("Technology", "技术", "技術"),
            tx("Usage", "用途", "用途"),
            tx("Notes", "说明", "メモ"),
          ]}
          rows={[
            ["TypeScript", tx("Primary language", "主要语言", "主要言語"), tx("Strict mode, Zod for runtime validation", "严格模式，运行时使用 Zod 校验", "strict mode と Zod による実行時検証")],
            ["Ink (React)", tx("Terminal UI", "终端 UI", "ターミナルUI"), tx("Custom fork with layout engine, focus, selection", "带布局引擎、焦点和选区能力的自定义 fork", "レイアウト、フォーカス、選択機能付きの独自 fork")],
            ["Zod", tx("Schema validation", "Schema 校验", "スキーマ検証"), tx("Tool input/output schemas, config validation", "工具输入输出 schema 与配置校验", "ツール入出力スキーマと設定検証")],
            ["Yoga Layout", tx("Terminal layout", "终端布局", "ターミナルレイアウト"), tx("Flexbox for terminal via yoga-layout", "通过 yoga-layout 为终端提供 Flexbox", "yoga-layout による端末向け Flexbox")],
            ["Ripgrep", tx("File search", "文件搜索", "ファイル検索"), tx("GrepTool wraps rg for fast content search", "GrepTool 封装 rg 以实现快速内容搜索", "GrepTool が rg を包み高速検索を実現")],
            ["Tree-sitter", tx("Bash parsing", "Bash 解析", "Bash 解析"), tx("AST-based security analysis of shell commands", "基于 AST 的 shell 命令安全分析", "AST ベースのシェル安全解析")],
            ["Sharp", tx("Image processing", "图像处理", "画像処理"), tx("Resize/compress images for API token limits", "为适应 API token 限制而缩放和压缩图片", "API のトークン制限に合わせて画像を縮小・圧縮")],
            ["MCP Protocol", tx("External tools", "外部工具", "外部ツール"), tx("stdio, SSE, HTTP, WebSocket transports", "支持 stdio、SSE、HTTP、WebSocket 传输", "stdio、SSE、HTTP、WebSocket をサポート")],
            ["GrowthBook", tx("Feature flags", "功能开关", "機能フラグ"), tx("A/B testing with cached gate values", "基于缓存 gate 值的 A/B 测试", "キャッシュ済み gate 値による A/B テスト")],
          ]}
        />
      </Card>

      {/* Data Flow */}
      <Card title={tx("High-Level Data Flow", "高层数据流", "高レベルなデータフロー")}>
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
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "A second top-level flow now exists beside the local REPL path: bridge/remote execution. In that mode, a bridge loop polls for work, spawns or reconnects sessions, and lets the same QueryEngine/query() core run inside managed remote capacity. Architecturally, that means the agent loop is the center, but not the whole product anymore.",
            "现在除了本地 REPL 路径之外，还存在第二条顶层流程：bridge/remote 执行。在该模式下，bridge loop 负责轮询任务、生成或重连会话，并让同一套 QueryEngine/query() 核心运行在受管控的远程容量中。从架构上说，agent loop 仍然是中心，但它已经不再等于整个产品。",
            "現在はローカル REPL の隣に、bridge/remote 実行というもう一つのトップレベル経路があります。bridge loop が作業をポーリングし、セッションを起動/再接続し、同じ QueryEngine/query() コアを管理された遠隔実行環境で動かします。つまり、agent loop は依然として中心ですが、もはや製品全体ではありません。"
          )}
        </p>
      </Card>
    </div>
  );
}
