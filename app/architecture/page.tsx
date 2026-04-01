"use client";

import { PageHeader, Card, CodeBlock, Table, SectionNav, InsightCallout, NextPage, TldrBox, KeyFact } from "@/components/Section";
import { useTx } from "@/components/T";
import { CLAUDE_CODE_REPO, ghBlob, ghTree } from "@/lib/sourceLinks";
import Link from "next/link";
import {
  VscCode,
  VscExtensions,
  VscTerminalBash,
  VscServerProcess,
  VscDatabase,
  VscShield,
  VscSymbolStructure,
} from "react-icons/vsc";
import {
  HiOutlineArrowDown,
  HiOutlineCpuChip,
  HiOutlineCommandLine,
  HiOutlineCircleStack,
  HiOutlineArrowPath,
} from "react-icons/hi2";

export default function ArchitecturePage() {
  const tx = useTx();
  const sections = [
    { id: "directory-structure", label: tx("Directory Structure", "目录结构", "ディレクトリ構成"), description: tx("The top-level map of the codebase.", "代码库的顶层地图。", "コードベースの全体地図。") },
    { id: "core-abstractions", label: tx("Core Abstractions", "核心抽象", "主要抽象"), description: tx("The main concepts you need before reading source.", "阅读源码前需要先掌握的核心概念。", "ソースを読む前に必要な主要概念。") },
    { id: "control-plane", label: tx("Control Plane", "控制平面", "コントロールプレーン"), description: tx("Why Claude Code is more than a simple loop plus tools.", "为什么 Claude Code 不只是一个循环加工具。", "なぜ単なるループ+ツールではないのか。") },
    { id: "largest-files", label: tx("Largest Files", "最大文件", "最大ファイル"), description: tx("Where a lot of complexity is concentrated.", "复杂度最集中的地方。", "複雑さが集中する場所。") },
  ];

  /* Visual data flow layers */
  const dataFlowLayers = [
    {
      id: "entry",
      label: tx("Entry Point", "入口点", "エントリーポイント"),
      sublabel: "cli.tsx / SDK",
      icon: HiOutlineCommandLine,
      color: "var(--accent)",
      items: tx(
        "Fast-path: --version, daemon workers  |  Full init: MDM, keychain, GrowthBook (~135ms parallel)",
        "快速路径：--version、daemon workers  |  完整初始化：MDM、keychain、GrowthBook（约135ms并行）",
        "高速パス: --version、daemonワーカー  |  完全初期化: MDM、keychain、GrowthBook（~135ms並列）",
      ),
    },
    {
      id: "engine",
      label: "QueryEngine",
      sublabel: "QueryEngine.ts",
      icon: HiOutlineCpuChip,
      color: "var(--green)",
      items: tx(
        "System prompt assembly  ·  User input processing  ·  Skill & plugin loading  ·  Yield init message",
        "系统提示构建  ·  用户输入处理  ·  技能与插件加载  ·  产出初始化消息",
        "システムプロンプト構築  ·  ユーザー入力処理  ·  スキル読み込み  ·  初期化メッセージ出力",
      ),
    },
    {
      id: "loop",
      label: tx("query() Loop", "query() 循环", "query() ループ"),
      sublabel: "query.ts  ~1700 lines",
      icon: HiOutlineArrowPath,
      color: "var(--orange)",
      isLoop: true,
      items: tx(
        "Context projection  ·  Auto-compaction  ·  API streaming  ·  Tool execution  ·  Attachments  ·  Continuation",
        "上下文投影  ·  自动压缩  ·  API流式输出  ·  工具执行  ·  附件处理  ·  继续判断",
        "コンテキスト投影  ·  自動圧縮  ·  APIストリーミング  ·  ツール実行  ·  添付処理  ·  継続判定",
      ),
    },
    {
      id: "terminal",
      label: tx("Terminal State", "终止状态", "終了状態"),
      sublabel: tx("Session ends", "会话结束", "セッション終了"),
      icon: HiOutlineCircleStack,
      color: "var(--purple)",
      items: "completed  ·  prompt_too_long  ·  aborted  ·  token_budget_completed",
    },
  ];

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
      <TldrBox
        color="var(--accent)"
        items={[
          tx(
            "Claude Code is a TypeScript monolith of ~512K lines across ~1,800 files — 3× larger than the Linux 1.0 kernel.",
            "Claude Code 是一个 TypeScript 单体应用，约 512K 行代码，约 1,800 个文件——是 Linux 1.0 内核的 3 倍。",
            "Claude Code は TypeScript モノリスで約 512K 行・約 1,800 ファイル — Linux 1.0 の 3 倍の規模です。"
          ),
          tx(
            "The entry point (cli.tsx) starts fast-path detection immediately, then spawns parallel init tasks: MDM, keychain, GrowthBook — all before the first user prompt.",
            "入口点 cli.tsx 立即启动快速路径检测，然后并行初始化：MDM、keychain、GrowthBook——全在第一个用户提示之前完成。",
            "エントリポイント cli.tsx は即座に高速パス検出を開始し、MDM・keychain・GrowthBook を並列初期化します — 最初のユーザープロンプトの前に完了。"
          ),
          tx(
            "QueryEngine.ts owns the conversation lifecycle: it assembles the system prompt, loads skills/plugins, and yields the first message to the loop.",
            "QueryEngine.ts 拥有会话生命周期：构建系统提示、加载技能/插件，并向循环产出初始消息。",
            "QueryEngine.ts が会話ライフサイクルを管理します：システムプロンプトの組み立て、スキル/プラグインの読み込み、最初のメッセージをループへ渡します。"
          ),
          tx(
            "query.ts is the heart — a 7-phase loop that handles context projection, streaming, tool execution, and token budget management. A single turn can call this loop many times.",
            "query.ts はその心臓部——コンテキスト投影、ストリーミング、ツール実行、トークン予算管理を処理する 7 フェーズのループです。1 ターンでこのループを何度も呼び出すことがあります。",
            "query.ts はその中核 — コンテキスト投影、ストリーミング、ツール実行、トークン予算管理を行う 7 フェーズループです。1 ターンでこのループが何度も実行されることがあります。"
          ),
        ]}
      />
      {/* Key facts row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KeyFact label={tx("Lines of Code", "代码行数", "コード行数")} value="512K" sub={tx("TypeScript", "TypeScript", "TypeScript")} color="var(--accent)" />
        <KeyFact label={tx("Source Files", "源文件数", "ソースファイル")} value="1,884" sub=".ts / .tsx" color="var(--green)" />
        <KeyFact label={tx("Built-in Tools", "内置工具", "組み込みツール")} value="43" sub={tx("Bash → MCP", "Bash → MCP", "Bash → MCP")} color="var(--orange)" />
        <KeyFact label={tx("Slash Commands", "斜杠命令", "スラッシュコマンド")} value="101" sub={tx("/compact → /stickers", "/compact → /stickers", "/compact → /stickers")} color="var(--purple)" />
      </div>
      {/* ── Visual System Architecture Poster ── */}
      <div className="mb-8 rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border px-4 py-3 flex items-center justify-between bg-bg-secondary">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {tx("System Architecture — at a glance", "系统架构一览", "システムアーキテクチャ概観")}
          </span>
          <span className="text-[9px] text-text-muted">{tx("outer → inner = higher abstraction", "外 → 内 = 更高抽象层", "外→内 = 高い抽象度")}</span>
        </div>
        <div className="p-3 sm:p-4 bg-bg-primary">
          {/* Outermost: CLI entry */}
          <div className="rounded-xl border-2 p-3 sm:p-4" style={{ borderColor: "color-mix(in srgb, var(--accent) 35%, var(--border))", background: "color-mix(in srgb, var(--accent) 4%, var(--bg-primary))" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                {tx("Entry — cli.tsx / SDK", "入口 — cli.tsx / SDK", "エントリ — cli.tsx / SDK")}
              </span>
              <span className="text-[9px] text-text-muted ml-auto">{tx("fast-path + parallel init", "快速路径 + 并行初始化", "高速パス + 並列初期化")}</span>
            </div>
            {/* QueryEngine */}
            <div className="rounded-xl border-2 p-3" style={{ borderColor: "color-mix(in srgb, var(--green) 35%, var(--border))", background: "color-mix(in srgb, var(--green) 4%, var(--bg-secondary))" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full" style={{ background: "var(--green)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--green)" }}>QueryEngine.ts</span>
                <span className="text-[9px] text-text-muted ml-auto">{tx("conversation lifecycle · system prompt · skills", "会话生命周期 · 系统提示 · 技能", "会話ライフサイクル · プロンプト · スキル")}</span>
              </div>
              {/* query() loop */}
              <div className="rounded-xl border-2 p-3" style={{ borderColor: "color-mix(in srgb, var(--orange) 40%, var(--border))", background: "color-mix(in srgb, var(--orange) 5%, var(--bg-tertiary))" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--orange)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--orange)" }}>
                    {tx("query() loop — ~1700 lines", "query() 循环 — 约1700行", "query() ループ — 約1700行")}
                  </span>
                </div>
                {/* 7 phases */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { n: 1, label: tx("Project Context", "投影上下文", "文脈投影"), c: "var(--accent)" },
                    { n: 2, label: tx("Compact Check", "压缩检查", "圧縮確認"), c: "var(--green)" },
                    { n: 3, label: tx("API Stream", "API流式", "APIストリーム"), c: "var(--orange)" },
                    { n: 4, label: tx("Recovery", "错误恢复", "エラー回復"), c: "var(--red)" },
                    { n: 5, label: tx("Tool Exec", "工具执行", "ツール実行"), c: "var(--purple)" },
                    { n: 6, label: tx("Attachments", "附件注入", "添付注入"), c: "var(--pink)" },
                    { n: 7, label: tx("Continue?", "继续？", "継続？"), c: "var(--accent)" },
                  ].map(({ n, label, c }) => (
                    <div key={n} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px]" style={{ background: `color-mix(in srgb, ${c} 12%, var(--bg-primary))`, border: `1px solid color-mix(in srgb, ${c} 25%, var(--border))` }}>
                      <span className="font-black" style={{ color: c }}>{n}</span>
                      <span className="text-text-muted font-medium hidden sm:inline">{label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] border border-dashed border-border">
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>↻ {tx("loop", "循环", "ループ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: Tools | Services | Bridge */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { label: tx("Tools Layer", "工具层", "ツール層"), sub: tx("43 tools · Bash, Edit, Agent…", "43个工具 · Bash/Edit/Agent…", "43ツール · Bash/Edit/Agent…"), c: "var(--orange)" },
                { label: tx("Services", "服务层", "サービス層"), sub: tx("MCP 470KB · Compact · LSP · Analytics", "MCP 470KB · 压缩 · LSP · 分析", "MCP 470KB · 圧縮 · LSP · 分析"), c: "var(--pink)" },
                { label: tx("Bridge / Remote", "桥接/远程", "ブリッジ/リモート"), sub: tx("Remote sessions via CCR", "通过CCR的远程会话", "CCR経由のリモートセッション"), c: "var(--purple)" },
              ].map(({ label, sub, c }) => (
                <div key={label} className="rounded-lg border p-2.5" style={{ borderColor: `color-mix(in srgb, ${c} 25%, var(--border))`, background: `color-mix(in srgb, ${c} 5%, var(--bg-secondary))` }}>
                  <div className="text-[10px] font-semibold mb-0.5" style={{ color: c }}>{label}</div>
                  <div className="text-[9px] text-text-muted leading-snug">{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Utils foundation */}
          <div className="mt-2 rounded-xl border border-dashed border-border/70 px-4 py-2.5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-border shrink-0" />
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Utils</span>
            <span className="text-[9px] text-text-muted">{tx("— 220 files · zero inbound dependencies · everything imports from utils, nothing imports into it", "— 220个文件 · 零入向依赖 · 一切从utils引入，无任何向utils输入", "— 220ファイル · 入向依存ゼロ · すべてがutilsからインポートし、utilsへのインポートはゼロ")}</span>
          </div>
        </div>
      </div>

      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />

      {/* Directory Map */}
      <Card
        id="directory-structure"
        title={tx("Directory Structure", "目录结构", "ディレクトリ構成")}
        className="mb-6"
        summary={tx("Use this map first if you need to orient yourself before diving into specific source files.", "如果你想在深入具体源码前先建立方向感，先看这张图。", "個別ファイルへ入る前の地図です。")}
        links={[
          { label: "src/", href: ghTree("") },
          { label: "services/", href: ghTree("services") },
          { label: "tools/", href: ghTree("tools") },
          { label: "bridge/", href: ghTree("bridge") },
        ]}
      >
        {/* Overview stats card */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-bg-tertiary/40 p-3 sm:col-span-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
              {tx("Codebase Scale", "代码库规模", "コードベース規模")}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-text-primary stat-number">512K</span>
                <span className="text-[10px] text-text-muted">{tx("lines", "行", "行")}</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-text-primary stat-number">~1,800</span>
                <span className="text-[10px] text-text-muted">{tx("files", "文件", "ファイル")}</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-bg-tertiary/40 p-3 sm:col-span-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted mb-2">
              {tx("3 Key Entry Points", "3 个关键入口", "3つの主要エントリ")}
            </div>
            <div className="space-y-1.5">
              {[
                { file: "entrypoints/cli.tsx", desc: tx("Bootstrap, fast-path & full init", "引导、快速路径与完整初始化", "起動、高速パスと完全初期化"), color: "var(--accent)" },
                { file: "QueryEngine.ts", desc: tx("Conversation lifecycle owner", "会话生命周期管理者", "会話ライフサイクルの管理者"), color: "var(--green)" },
                { file: "query.ts", desc: tx("7-phase agentic loop ~1700 lines", "7阶段代理循环 约1700行", "7段階ループ 約1700行"), color: "var(--orange)" },
              ].map((e) => (
                <div key={e.file} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: e.color }} />
                  <code className="text-[10px] font-semibold" style={{ color: e.color }}>{e.file}</code>
                  <span className="text-[10px] text-text-muted truncate">{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
            "Claude Code is no longer just a REPL + tools. It now has bridge/remote subsystems, speculation services, and rich session infrastructure around the core query loop.",
            "Claude Code 已不只是 REPL 加工具。它现在有 bridge/remote 子系统、推测服务和围绕核心 query loop 的丰富会话基础设施。",
            "Claude Code はもはや REPL + ツールではありません。bridge/remote、speculation サービス、豊富なセッション基盤が中核ループを取り囲んでいます。"
          )}
        </p>
        <InsightCallout emoji="🏛️" title={tx("Key Insight", "核心洞察", "重要なポイント")} className="mt-4">
          {tx(
            "The /utils directory has 220 files but zero inbound package dependencies — it's the foundation everything builds on. Nothing in the codebase imports into utils; everything imports from it.",
            "/utils 目录有 220 个文件，但没有任何入向包依赖——它是整个代码库的基础。代码库中没有任何东西向 utils 输出，一切都从它引入。",
            "/utils ディレクトリには 220 ファイルがありますが、入向パッケージ依存は一切ありません。コードベース全体の土台であり、全てが utils からインポートし、utils へのインポートはゼロです。"
          )}
        </InsightCallout>
      </Card>

      {/* Key Abstractions */}
      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card
          id="core-abstractions"
          title={tx("Core Abstractions", "核心抽象", "主要な抽象")}
          accent="var(--accent)"
          summary={tx("These abstractions are the vocabulary of the rest of the system.", "这些抽象就是后续系统各部分的共同语言。", "以後のシステムを読むための語彙です。")}
          links={[
            { label: "QueryEngine.ts", href: ghBlob("QueryEngine.ts") },
            { label: "query.ts", href: ghBlob("query.ts") },
            { label: "Tool.ts", href: ghBlob("Tool.ts") },
          ]}
        >
          <div className="space-y-3 text-sm text-text-secondary">
            {[
              {
                name: "QueryEngine",
                desc: tx(
                  "Owns the complete conversation lifecycle. Async generator that yields SDKMessage objects. Handles system prompt assembly, user input processing, and delegates to query() loop.",
                  "负责完整的会话生命周期。它是会产出 SDKMessage 的异步生成器，处理系统提示构建、用户输入处理，并把执行委派给 query() 循环。",
                  "会話ライフサイクル全体を担います。SDKMessage を yield する async generator であり、システムプロンプト構築、ユーザー入力処理、query() ループへの委譲を行います。"
                ),
              },
              {
                name: "query()",
                desc: tx(
                  "The main agentic loop — a state machine that streams API responses, executes tools, handles recovery, and decides whether to continue or exit.",
                  "主代理循环，是一个负责流式处理 API 响应、执行工具、处理恢复逻辑并决定继续还是退出的状态机。",
                  "メインのエージェントループであり、API 応答のストリーミング、ツール実行、回復処理、継続/終了判定を行う状態機械です。"
                ),
              },
              {
                name: "Tool<Input, Output, Progress>",
                desc: tx(
                  "Unified interface for all tools. Built via buildTool() factory. Declares permissions, concurrency safety, and rendering.",
                  "所有工具统一遵循的接口。通过 buildTool() 工厂构建，并声明权限、并发安全性和渲染行为。",
                  "全ツール共通のインターフェースです。buildTool() ファクトリで構築され、権限、並行安全性、レンダリング方法を宣言します。"
                ),
              },
              {
                name: "ToolUseContext",
                desc: tx(
                  "Central communication channel between tools and the query loop. Contains options, state accessors, abort controller, analytics.",
                  "工具与查询循环之间的中央通信通道，包含选项、状态访问器、中止控制器和分析能力。",
                  "ツールとクエリループの中心的な通信経路です。options、状態アクセサ、abort controller、analytics を含みます。"
                ),
              },
            ].map((item) => (
              <div key={item.name} className="rounded-lg border border-border/50 bg-bg-primary/60 p-3">
                <code className="text-accent text-xs font-semibold">{item.name}</code>
                <p className="mt-1 text-xs text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
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
          <div className="space-y-3">
            {[
              {
                name: tx("Async Generator Architecture", "异步生成器架构", "非同期ジェネレーターアーキテクチャ"),
                color: "var(--green)",
                desc: tx(
                  "Both QueryEngine and query() are async generators that yield intermediate results for real-time streaming.",
                  "QueryEngine 和 query() 都是 async generator，会产出中间结果以支持实时流式输出。",
                  "QueryEngine と query() はどちらも async generator であり、リアルタイム配信のために中間結果を yield します。"
                ),
              },
              {
                name: tx("Streaming Concurrency", "流式并发", "ストリーミング並行処理"),
                color: "var(--orange)",
                desc: tx(
                  "Tools start executing while the model is still generating. StreamingToolExecutor queues tool_use blocks as they arrive.",
                  "模型仍在生成时工具就开始执行。StreamingToolExecutor 会在 tool_use 块到达时立即入队。",
                  "モデルがまだ生成中でもツール実行を開始します。StreamingToolExecutor は到着した tool_use ブロックを即座にキューへ入れます。"
                ),
              },
              {
                name: tx("Cache Sharing (CacheSafeParams)", "缓存共享", "キャッシュ共有"),
                color: "var(--accent)",
                desc: tx(
                  "Frozen system prompt bytes enable zero-cost forked queries for subagents. Identical bytes = automatic prompt cache hit.",
                  "被冻结的系统提示字节使子代理的 fork 查询几乎零成本。字节完全一致就会自动命中 prompt cache。",
                  "凍結されたシステムプロンプトのバイト列により、サブエージェントの fork クエリがほぼ無料になります。"
                ),
              },
              {
                name: tx("DeepImmutable State", "深度不可变状态", "DeepImmutable State"),
                color: "var(--purple)",
                desc: tx(
                  "Zustand-like AppState with type-safe mutations. setAppState(prev => {...prev, field: newValue}).",
                  "类似 Zustand 的 AppState，并支持类型安全的状态变更。",
                  "Zustand 風の AppState と型安全な更新方式です。"
                ),
              },
            ].map((item) => (
              <div
                key={item.name}
                className="rounded-lg border border-border/50 p-3"
                style={{ borderLeft: `3px solid ${item.color}` }}
              >
                <strong className="text-[11px] font-semibold text-text-primary">{item.name}</strong>
                <p className="mt-1 text-[11px] text-text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Visual Data Flow Diagram */}
      <Card
        id="control-plane"
        title={tx("High-Level Data Flow", "高层数据流", "高レベルデータフロー")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("Visual walkthrough of a request from entry to terminal state.", "从入口到终止状态的可视化全流程。", "エントリーから終了状態までのビジュアルフロー。")}
        links={[
          { label: "state/AppStateStore.ts", href: ghBlob("state/AppStateStore.ts") },
          { label: "bridge/", href: ghTree("bridge") },
          { label: "services/PromptSuggestion/", href: ghTree("services/PromptSuggestion") },
        ]}
      >
        <div className="flex flex-col items-stretch gap-0">
          {dataFlowLayers.map((layer, i) => (
            <div key={layer.id} className="flex flex-col items-center">
              {/* Layer Box — poster style with colored left border */}
              <div
                className="w-full rounded-xl border overflow-hidden"
                style={{
                  borderColor: `color-mix(in srgb, ${layer.color} 30%, var(--border))`,
                  background: `color-mix(in srgb, ${layer.color} 5%, var(--bg-secondary))`,
                }}
              >
                <div className="flex">
                  {/* Colored left border stripe */}
                  <div className="w-1 shrink-0" style={{ background: layer.color }} />
                  <div className="flex-1 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `color-mix(in srgb, ${layer.color} 18%, transparent)`,
                          border: `1.5px solid color-mix(in srgb, ${layer.color} 35%, transparent)`,
                        }}
                      >
                        <layer.icon className="h-5 w-5" style={{ color: layer.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                          <span className="text-sm font-bold text-text-primary">{layer.label}</span>
                          <code
                            className="text-[10px] rounded-md px-2 py-0.5 font-mono"
                            style={{
                              background: `color-mix(in srgb, ${layer.color} 14%, transparent)`,
                              color: layer.color,
                              border: `1px solid color-mix(in srgb, ${layer.color} 25%, transparent)`,
                            }}
                          >
                            {layer.sublabel}
                          </code>
                          {layer.isLoop && (
                            <span className="text-[9px] rounded-full border px-2 py-0.5 text-text-muted border-border">
                              {tx("loops while tools called", "工具调用期间持续循环", "ツール呼び出し中はループ")}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted leading-relaxed break-words">{layer.items}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Connector arrow between layers */}
              {i < dataFlowLayers.length - 1 && (
                <div className="phase-connector">
                  <div className="h-5 w-px bg-border" />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] text-text-muted">delegates to</span>
                    <HiOutlineArrowDown className="h-3.5 w-3.5 text-text-muted" />
                  </div>
                  <div className="h-5 w-px bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-border/50 bg-bg-tertiary/30 p-4">
          <p className="text-[11px] text-text-muted leading-relaxed">
            {tx(
              "A second top-level flow now exists beside the local REPL path: bridge/remote execution. In that mode, a bridge loop polls for work, spawns or reconnects sessions, and lets the same QueryEngine/query() core run inside managed remote capacity. Architecturally, that means the agent loop is the center, but not the whole product anymore.",
              "现在除了本地 REPL 路径之外，还存在第二条顶层流程：bridge/remote 执行。在该模式下，bridge loop 负责轮询任务、生成或重连会话，并让同一套 QueryEngine/query() 核心运行在受管控的远程容量中。从架构上说，agent loop 仍然是中心，但它已经不再等于整个产品。",
              "現在はローカル REPL の隣に、bridge/remote 実行というもう一つのトップレベル経路があります。bridge loop が作業をポーリングし、セッションを起動/再接続し、同じ QueryEngine/query() コアを管理された遠隔実行環境で動かします。つまり、agent loop は依然として中心ですが、もはや製品全体ではありません。"
            )}
          </p>
        </div>

        {/* Control Plane AppState families */}
        <div className="mt-5">
          <p className="mb-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            {tx("AppState Families", "AppState 状态族", "AppState のファミリー")}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { label: tx("Runtime", "运行时", "ランタイム"), color: "var(--accent)", items: "remoteConnectionStatus · replBridgeConnected · remoteBackgroundTaskCount" },
              { label: tx("Agent Orchestration", "代理编排", "エージェント編成"), color: "var(--green)", items: "tasks · agentNameRegistry · coordinatorTaskIndex · viewingAgentTaskId" },
              { label: tx("Background Intelligence", "后台智能", "バックグラウンド知性"), color: "var(--orange)", items: "promptSuggestionEnabled · speculationState · notifications · elicitation" },
              { label: tx("UX Subsystems", "UX 子系统", "UXサブシステム"), color: "var(--purple)", items: "companionReaction · bagelActive · tungstenActiveSession · footerSelection" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-border/50 p-3"
                style={{ borderLeft: `3px solid ${f.color}` }}
              >
                <span className="text-[11px] font-semibold" style={{ color: f.color }}>{f.label}</span>
                <p className="mt-1 text-[10px] text-text-muted font-mono leading-relaxed">{f.items}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Size Comparison */}
      <Card title={tx("Codebase Size Comparison", "代码库规模对比", "コードベース規模の比較")} className="mb-6" accent="var(--accent)">
        <p className="text-xs text-text-muted mb-4">
          {tx(
            "Lines of code compared to well-known projects (approximate):",
            "与知名项目对比的大致代码行数：",
            "著名プロジェクトと比較した概算行数："
          )}
        </p>
        <div className="space-y-3">
          {[
            { name: "Linux 1.0 (1994)", lines: 176000, color: "var(--green)" },
            { name: "jQuery 3.x", lines: 10000, color: "var(--text-muted)" },
            { name: "Express.js", lines: 14000, color: "var(--text-muted)" },
            { name: "React (core)", lines: 200000, color: "var(--accent)" },
            { name: "Claude Code v2.1.88", lines: 512664, color: "var(--red)", highlight: true },
          ].map((p) => (
            <div key={p.name} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
              <span className={`text-xs sm:w-44 sm:shrink-0 ${p.highlight ? "font-semibold text-text-primary" : "text-text-muted"}`}>
                {p.name}
              </span>
              <div className="flex flex-1 items-center gap-2">
                <div className="flex-1 h-6 bg-bg-primary rounded-lg overflow-hidden border border-border/50">
                  <div
                    className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                    style={{
                      width: `${Math.max((p.lines / 512664) * 100, 4)}%`,
                      background: p.highlight ? p.color : `color-mix(in srgb, ${p.color} 60%, transparent)`,
                    }}
                  >
                    <span className="text-[10px] font-mono text-white font-medium">
                      {(p.lines / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Largest Files */}
      <Card id="largest-files" title={tx("Top 10 Largest Files", "最大文件 Top 10", "最大ファイル Top 10")} className="mb-6" accent="var(--red)" summary={tx("Use this table when you want to know where the codebase is densest and worth deeper reading.", "如果你想知道哪些文件最重、最值得深入阅读，就看这张表。", "密度の高いファイルを知るための表です。")}>
        <div className="overflow-x-auto">
          <div className="min-w-[520px] space-y-1">
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
            <div key={f.file} className="flex items-center gap-3 py-1.5 rounded-lg hover:bg-bg-tertiary/30 px-2 transition-colors">
              <span className="text-[10px] text-text-muted w-4 text-right font-mono shrink-0">{i + 1}</span>
              <code className="text-[11px] text-accent flex-1 truncate min-w-0">{f.file}</code>
              <span className="hidden sm:block text-[10px] text-text-muted shrink-0 w-28 text-right">{f.desc}</span>
              <div className="w-20 h-2.5 bg-bg-primary rounded-full overflow-hidden border border-border/50 shrink-0">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(f.lines / 5594) * 100}%`,
                    background: `color-mix(in srgb, var(--red) ${50 + (f.lines / 5594) * 50}%, transparent)`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-12 text-right shrink-0">{f.lines.toLocaleString()}</span>
            </div>
          ))}
          </div>
        </div>
        <InsightCallout emoji="📏" title={tx("Key Insight", "核心洞察", "重要なポイント")} className="mt-4">
          {tx(
            "print.ts is 5,594 lines and does ONE thing: format terminal output. That's more lines than the entire React core scheduler. When output formatting gets complex enough, it becomes its own subsystem.",
            "print.ts 有 5,594 行，只做一件事：格式化终端输出。这比整个 React 核心调度器的代码还多。当输出格式化变得足够复杂，它就成了自己的子系统。",
            "print.ts は 5,594 行で、ただ一つのことを行います: ターミナル出力の書式設定。React コアスケジューラ全体よりも行数が多い。出力書式設定が十分複雑になると、独自のサブシステムになります。"
          )}
        </InsightCallout>
      </Card>

      {/* Module Size Breakdown */}
      <Card title={tx("Module Size Breakdown", "模块规模拆解", "モジュール別規模")} className="mb-6" accent="var(--purple)">
        <div className="space-y-2">
          {[
            { icon: VscSymbolStructure, name: tx("Components", "组件", "コンポーネント"), files: 346, linesK: 40, color: "var(--purple)", href: "/modules/components" },
            { icon: VscCode, name: tx("Utils", "工具库", "ユーティリティ"), files: 220, linesK: 60, color: "var(--accent)", href: "/modules/utils" },
            { icon: VscExtensions, name: tx("Tools", "工具", "ツール"), files: 140, linesK: 65, color: "var(--orange)", href: "/modules/tools" },
            { icon: VscTerminalBash, name: tx("Commands", "命令", "コマンド"), files: 110, linesK: 8, color: "var(--orange)", href: "/modules/commands" },
            { icon: VscDatabase, name: tx("Services", "服务", "サービス"), files: 110, linesK: 80, color: "var(--green)", href: "/modules/services" },
            { icon: VscShield, name: tx("Permissions", "权限", "権限"), files: 30, linesK: 20, color: "var(--red)", href: "/modules/permissions" },
            { icon: VscServerProcess, name: tx("Query/Engine", "查询/引擎", "Query/Engine"), files: 15, linesK: 15, color: "var(--green)", href: "/modules/query-engine" },
            { icon: VscDatabase, name: tx("Bridge", "桥接层", "ブリッジ"), files: 12, linesK: 13, color: "var(--pink)", href: "/modules/bridge" },
          ].map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center gap-3 rounded-lg border border-border/50 px-3 py-2.5 hover:border-border hover:bg-bg-tertiary/30 transition-all group"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `color-mix(in srgb, ${m.color} 14%, transparent)` }}
              >
                <m.icon className="h-3.5 w-3.5" style={{ color: m.color }} />
              </div>
              <div className="w-24 shrink-0">
                <div className="text-xs font-semibold text-text-primary group-hover:text-accent transition-colors">{m.name}</div>
                <div className="text-[9px] text-text-muted">{m.files} {tx("files", "个", "ファイル")}</div>
              </div>
              {/* Mini bar chart */}
              <div className="flex-1 h-3 bg-bg-primary rounded-full overflow-hidden border border-border/50">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max((m.linesK / 80) * 100, 8)}%`,
                    background: `color-mix(in srgb, ${m.color} 70%, transparent)`,
                  }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-[10px] font-mono text-text-muted">~{m.linesK}K</span>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-text-muted italic">{tx("Bar = relative lines of code", "条形图 = 相对代码行数", "バー = 相対的なコード行数")}</p>
      </Card>

      {/* Tech Stack */}
      <Card title={tx("Technology Stack", "技术栈", "技術スタック")} className="mb-6" accent="var(--green)">
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
        <InsightCallout emoji="⚡" title={tx("Key Insight", "核心洞察", "重要なポイント")} className="mt-4">
          {tx(
            "Claude Code uses a CUSTOM FORK of Ink — they've modified the terminal rendering engine itself. The ink/ directory isn't just configuration; it's a patched version of React-for-terminals with layout engine changes, focus management, and selection behavior Anthropic needed but upstream doesn't have.",
            "Claude Code 使用了 Ink 的自定义分支——他们修改了终端渲染引擎本身。ink/ 目录不只是配置；它是 React for terminals 的打补丁版本，包含布局引擎变更、焦点管理和 Anthropic 需要但上游没有的选择行为。",
            "Claude Code は Ink のカスタム FORK を使用しており、端末レンダリングエンジン自体を改変しています。ink/ ディレクトリは単なる設定ではなく、Anthropic が必要だが上流にはないレイアウト変更・フォーカス管理・選択動作を含む改修版です。"
          )}
        </InsightCallout>
      </Card>

      <NextPage
        href="/query-loop"
        title={tx("The Query Loop", "查询循环", "クエリループ")}
        description={tx(
          "Dive into the 7-phase agentic loop — how query.ts orchestrates API streaming, tool execution, and error recovery across ~1700 lines of state machine.",
          "深入了解 7 阶段代理循环——query.ts 如何在约 1700 行状态机中编排 API 流式输出、工具执行和错误恢复。",
          "7段階のエージェントループを詳解 — query.ts が約1700行の状態機械でAPIストリーミング、ツール実行、エラー回復をどう調整するか。"
        )}
      />
    </div>
  );
}
