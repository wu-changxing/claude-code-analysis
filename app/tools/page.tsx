"use client";

import { PageHeader, Card, CodeBlock, SectionNav, NextPage } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  VscTerminalBash,
  VscEdit,
  VscNewFile,
  VscOpenPreview,
  VscSearch,
  VscFileSymlinkDirectory,
  VscGitMerge,
  VscWand,
  VscPlug,
  VscGlobe,
  VscBrowser,
  VscNotebook,
  VscGitCompare,
  VscSignOut,
  VscComment,
  VscChecklist,
  VscSymbolMisc,
  VscServerProcess,
  VscTerminalPowershell,
  VscWatch,
} from "react-icons/vsc";

const TOOL_CARDS = [
  { name: "Bash", icon: VscTerminalBash, type: "Execution", color: "var(--orange)", desc: "Shell commands with AST security analysis, sandbox, ML classifier" },
  { name: "FileEdit", icon: VscEdit, type: "Modification", color: "var(--accent)", desc: "String find/replace with fuzzy matching and unified diff" },
  { name: "FileWrite", icon: VscNewFile, type: "Modification", color: "var(--accent)", desc: "Full content atomic file replacement" },
  { name: "FileRead", icon: VscOpenPreview, type: "Read", color: "var(--green)", desc: "Read files with PDF, notebook, image handling" },
  { name: "Grep", icon: VscSearch, type: "Search", color: "var(--green)", desc: "Ripgrep-based content search with permission filtering" },
  { name: "Glob", icon: VscFileSymlinkDirectory, type: "Search", color: "var(--green)", desc: "Fast file pattern matching, mod-time sorted" },
  { name: "Agent", icon: VscGitMerge, type: "Spawning", color: "var(--purple)", desc: "Isolated sub-agents with zero-cost cache sharing" },
  { name: "Skill", icon: VscWand, type: "Invocation", color: "var(--purple)", desc: "User-defined prompt templates from .md files" },
  { name: "MCP", icon: VscPlug, type: "Proxy", color: "var(--pink)", desc: "Wraps external tools via Model Context Protocol" },
  { name: "WebSearch", icon: VscGlobe, type: "Search", color: "var(--green)", desc: "Web search integration" },
  { name: "WebFetch", icon: VscBrowser, type: "Read", color: "var(--green)", desc: "Fetch web page content" },
  { name: "NotebookEdit", icon: VscNotebook, type: "Modification", color: "var(--accent)", desc: "Jupyter notebook cell editing" },
  { name: "Worktree", icon: VscGitCompare, type: "Isolation", color: "var(--orange)", desc: "Git worktree creation and cleanup" },
  { name: "SendMessage", icon: VscComment, type: "Comms", color: "var(--purple)", desc: "Inter-agent messaging" },
  { name: "Task*", icon: VscChecklist, type: "Management", color: "var(--orange)", desc: "Create, get, update, stop tracked subtasks" },
  { name: "ToolSearch", icon: VscSymbolMisc, type: "Discovery", color: "var(--green)", desc: "Deferred tool loading for large tool sets" },
  { name: "LSP", icon: VscServerProcess, type: "Integration", color: "var(--accent)", desc: "Language Server Protocol queries" },
  { name: "PowerShell", icon: VscTerminalPowershell, type: "Execution", color: "var(--orange)", desc: "Windows PowerShell execution" },
  { name: "Sleep", icon: VscWatch, type: "Utility", color: "var(--green)", desc: "Async wait/delay" },
  { name: "Exit*", icon: VscSignOut, type: "Cleanup", color: "var(--red)", desc: "Exit worktree/plan with safety checks" },
];

/* Group tools by category for visual clarity */
const TOOL_GROUPS = [
  { label: "Execution", color: "var(--orange)", types: ["Execution"] },
  { label: "File I/O", color: "var(--accent)", types: ["Modification", "Read"] },
  { label: "Search", color: "var(--green)", types: ["Search"] },
  { label: "Agents", color: "var(--purple)", types: ["Spawning", "Invocation", "Comms"] },
  { label: "Protocol", color: "var(--pink)", types: ["Proxy", "Integration"] },
  { label: "Infra", color: "var(--red)", types: ["Isolation", "Management", "Discovery", "Utility", "Cleanup"] },
];

export default function ToolsPage() {
  const tx = useTx();
  const sections = [
    { id: "tool-interface", label: tx("Interface", "接口", "インターフェース"), description: tx("The shared contract every tool implements.", "每个工具都遵循的公共契约。", "全ツール共通の契約。") },
    { id: "tool-registry", label: tx("Built-ins", "内置工具", "組み込みツール"), description: tx("A map of the major tool families.", "主要工具家族的概览。", "主要ツール群の地図。") },
    { id: "bash-tool", label: tx("BashTool", "BashTool", "BashTool"), description: tx("The most security-sensitive tool in the system.", "系统里安全要求最高的工具。", "最もセキュリティが重いツール。") },
    { id: "file-edit", label: tx("FileEditTool", "FileEditTool", "FileEditTool"), description: tx("How text edits are validated and applied safely.", "文本编辑如何被安全校验并应用。", "テキスト編集がどう安全に行われるか。") },
    { id: "tool-orchestration", label: tx("Orchestration", "编排", "オーケストレーション"), description: tx("How multiple tools run together without breaking state.", "多个工具如何协同运行而不破坏状态。", "複数ツールをどう安全に走らせるか。") },
  ];

  const toolCards = TOOL_CARDS.map((tool) => ({
    ...tool,
    type: tx(tool.type, ({
      Execution: "执行",
      Modification: "修改",
      Read: "读取",
      Search: "搜索",
      Spawning: "派生",
      Invocation: "调用",
      Proxy: "代理",
      Isolation: "隔离",
      Comms: "通信",
      Management: "管理",
      Discovery: "发现",
      Integration: "集成",
      Utility: "工具",
      Cleanup: "清理",
    } as Record<string, string>)[tool.type], ({
      Execution: "実行",
      Modification: "変更",
      Read: "読み取り",
      Search: "検索",
      Spawning: "起動",
      Invocation: "呼び出し",
      Proxy: "プロキシ",
      Isolation: "隔離",
      Comms: "通信",
      Management: "管理",
      Discovery: "探索",
      Integration: "統合",
      Utility: "ユーティリティ",
      Cleanup: "終了処理",
    } as Record<string, string>)[tool.type]),
    originalType: tool.type,
    desc: tx(
      tool.desc,
      ({
        "Shell commands with AST security analysis, sandbox, ML classifier": "带 AST 安全分析、沙箱和 ML 分类器的 shell 命令执行",
        "String find/replace with fuzzy matching and unified diff": "支持模糊匹配和统一 diff 的字符串查找替换",
        "Full content atomic file replacement": "原子化整文件内容替换",
        "Read files with PDF, notebook, image handling": "读取文件，并支持 PDF、notebook、图片处理",
        "Ripgrep-based content search with permission filtering": "基于 ripgrep 的内容搜索，并带权限过滤",
        "Fast file pattern matching, mod-time sorted": "快速文件模式匹配，并按修改时间排序",
        "Isolated sub-agents with zero-cost cache sharing": "隔离子代理，并共享零成本缓存",
        "User-defined prompt templates from .md files": "从 .md 文件加载用户定义的提示模板",
        "Wraps external tools via Model Context Protocol": "通过 Model Context Protocol 包装外部工具",
        "Web search integration": "Web 搜索集成",
        "Fetch web page content": "抓取网页内容",
        "Jupyter notebook cell editing": "Jupyter notebook 单元格编辑",
        "Git worktree creation and cleanup": "Git worktree 创建与清理",
        "Inter-agent messaging": "代理间消息传递",
        "Create, get, update, stop tracked subtasks": "创建、获取、更新、停止已跟踪子任务",
        "Deferred tool loading for large tool sets": "面向大型工具集的延迟工具加载",
        "Language Server Protocol queries": "Language Server Protocol 查询",
        "Windows PowerShell execution": "Windows PowerShell 执行",
        "Async wait/delay": "异步等待/延迟",
        "Exit worktree/plan with safety checks": "带安全检查地退出 worktree/plan",
      } as Record<string, string>)[tool.desc],
      ({
        "Shell commands with AST security analysis, sandbox, ML classifier": "AST安全解析、サンドボックス、ML分類器付きのシェル実行",
        "String find/replace with fuzzy matching and unified diff": "あいまい一致と unified diff を伴う文字列置換",
        "Full content atomic file replacement": "ファイル全体の原子的置換",
        "Read files with PDF, notebook, image handling": "PDF・notebook・画像対応のファイル読み取り",
        "Ripgrep-based content search with permission filtering": "権限フィルタ付きの ripgrep ベース検索",
        "Fast file pattern matching, mod-time sorted": "更新時刻順の高速ファイルパターン照合",
        "Isolated sub-agents with zero-cost cache sharing": "ゼロコストキャッシュ共有付きの隔離サブエージェント",
        "User-defined prompt templates from .md files": ".md ファイル由来のユーザー定義プロンプトテンプレート",
        "Wraps external tools via Model Context Protocol": "Model Context Protocol 経由で外部ツールをラップ",
        "Web search integration": "Web検索統合",
        "Fetch web page content": "Webページ内容の取得",
        "Jupyter notebook cell editing": "Jupyter notebook セル編集",
        "Git worktree creation and cleanup": "Git worktree の作成と掃除",
        "Inter-agent messaging": "エージェント間メッセージ",
        "Create, get, update, stop tracked subtasks": "追跡サブタスクの作成・取得・更新・停止",
        "Deferred tool loading for large tool sets": "大規模ツール群向けの遅延ロード",
        "Language Server Protocol queries": "Language Server Protocol クエリ",
        "Windows PowerShell execution": "Windows PowerShell 実行",
        "Async wait/delay": "非同期待機/遅延",
        "Exit worktree/plan with safety checks": "安全検査付きで worktree/plan を終了",
      } as Record<string, string>)[tool.desc],
    ),
  }));

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Tools", "工具", "ツール")}
        description={tx(
          "Claude Code has 43 built-in tools, each implementing a unified Tool<Input, Output, Progress> interface. Tools are built via the buildTool() factory and validated with Zod schemas at runtime.",
          "Claude Code 有 43 个内置工具，每个都实现统一的 Tool<Input, Output, Progress> 接口。通过 buildTool() 工厂构建，运行时用 Zod schema 验证。",
          "Claude Code には43個の組み込みツールがあり、すべてが統一された Tool<Input, Output, Progress> インターフェースを実装しています。buildTool() で構築され、実行時に Zod で検証されます。"
        )}
        badge={tx("43 tools", "43 个工具", "43ツール")}
        links={[
          { label: "Tool.ts", href: ghBlob("Tool.ts") },
          { label: "tools/", href: ghTree("tools") },
          { label: "services/tools/", href: ghTree("services/tools") },
          { label: "tools/BashTool/", href: ghTree("tools/BashTool") },
        ]}
      />
      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />

      {/* Tool Interface */}
      <Card
        id="tool-interface"
        title={tx("Tool Interface (Tool.ts)", "工具接口（Tool.ts）", "ツールインターフェース（Tool.ts）")}
        className="mb-6"
        summary={tx("Start here if you want the mental model that unifies Bash, Edit, MCP, Agent, and the rest.", "如果你想先建立一个统一理解 Bash、Edit、MCP、Agent 等工具的模型，从这里开始。", "Bash、Edit、MCP、Agent などをまとめて理解する入口です。")}
        links={[
          { label: "Tool.ts", href: ghBlob("Tool.ts") },
          { label: "buildTool()", href: ghBlob("Tool.ts") },
        ]}
      >
        <CodeBlock
          code={`interface Tool<Input, Output, Progress> {
  name: string
  aliases?: string[]              // backwards compatibility
  searchHint?: string             // for ToolSearch keyword matching
  inputSchema: ZodSchema          // validated at runtime
  strict?: boolean                // strict API mode

  // Core execution
  call(args, context, canUseTool, parentMessage, onProgress): Promise<ToolResult>

  // Metadata
  description(input, options): Promise<string>
  prompt(): string                // system prompt instructions
  userFacingName(): string        // display name for UI

  // Security
  validateInput(): ValidationResult
  checkPermissions(): PermissionResult
  isReadOnly(): boolean
  isDestructive(): boolean
  isConcurrencySafe(): boolean

  // Rendering
  renderToolUseMessage(): ReactNode
  renderToolResultMessage(): ReactNode
  getToolUseSummary(): string     // compact status display
  getActivityDescription(): string // "Reading src/foo.ts"

  // Limits
  maxResultSizeChars?: number     // triggers disk persistence if exceeded
}`}
        />
      </Card>

      {/* Tool Registry Visual — grouped by category */}
      <Card
        id="tool-registry"
        title={tx("Built-in Tools (43 total)", "内置工具（共 43 个）", "組み込みツール（全43種）")}
        className="mb-6"
        summary={tx("This section helps you orient which tools are for reading, writing, searching, spawning, or protocol bridging.", "这节帮助你快速分清哪些工具负责读取、写入、搜索、派生或协议桥接。", "読み取り、書き込み、検索、起動、プロトコル橋渡しのどれかを把握できます。")}
        links={[
          { label: "tools/", href: ghTree("tools") },
          { label: "MCPTool/", href: ghTree("tools/MCPTool") },
          { label: "AgentTool/", href: ghTree("tools/AgentTool") },
        ]}
      >
        {/* Category legend pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TOOL_GROUPS.map((g) => (
            <span
              key={g.label}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border"
              style={{
                background: `color-mix(in srgb, ${g.color} 12%, transparent)`,
                color: g.color,
                borderColor: `color-mix(in srgb, ${g.color} 30%, transparent)`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: g.color }} />
              {g.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {toolCards.map((t) => (
            <div
              key={t.name}
              className="flex gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-bg-tertiary/30"
              style={{ borderLeft: `3px solid ${t.color}` }}
            >
              <div
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `color-mix(in srgb, ${t.color} 14%, transparent)` }}
              >
                <t.icon className="h-4 w-4" style={{ color: t.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold text-text-primary">{t.name}</span>
                  <span
                    className="inline-block rounded px-1.5 py-0.5 text-[9px] font-medium"
                    style={{
                      background: `color-mix(in srgb, ${t.color} 10%, transparent)`,
                      color: t.color,
                    }}
                  >
                    {t.type}
                  </span>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* BashTool Deep Dive */}
      <Card
        id="bash-tool"
        title={tx("BashTool Deep Dive", "BashTool 深入解析", "BashTool 詳解")}
        className="mb-6"
        accent="var(--orange)"
        summary={tx("Read this if you want to understand why shell execution in Claude Code is so heavily guarded.", "如果你想理解为什么 Claude Code 对 shell 执行做了这么多防护，读这一节。", "シェル実行に多層防御がある理由を知る節です。")}
        links={[
          { label: "BashTool.tsx", href: ghBlob("tools/BashTool/BashTool.tsx") },
          { label: "bashPermissions.ts", href: ghBlob("tools/BashTool/bashPermissions.ts") },
          { label: "bashSecurity.ts", href: ghBlob("tools/BashTool/bashSecurity.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The BashTool is the largest and most complex tool (~300KB across 5 files). It has multi-layered security to prevent dangerous command execution.",
            "BashTool 是体积最大也最复杂的工具（5 个文件约 300KB），采用多层安全防护来阻止危险命令执行。",
            "BashTool は最大かつ最も複雑なツールです（5ファイル合計約300KB）。危険なコマンド実行を防ぐため多層防御を備えています。"
          )}
        </p>

        {/* Security layers visual */}
        <div className="mb-4 space-y-2">
          {[
            { n: 1, label: tx("AST-based Parsing (tree-sitter)", "AST 解析（tree-sitter）", "AST解析（tree-sitter）"), detail: tx("Detects dangerous patterns: redirections, pipes, subshells", "检测危险模式：重定向、管道、子 shell", "危険なパターンを検出：リダイレクト、パイプ、サブシェル"), color: "var(--orange)" },
            { n: 2, label: tx("ML Classifier (opt-in)", "ML 分类器（可选）", "ML分類器（オプション）"), detail: tx("AI evaluates command safety with confidence scoring, can auto-approve safe patterns", "AI 评估命令安全性并打置信分，可自动批准安全模式", "AIがコマンドを評価し安全パターンを自動承認"), color: "var(--red)" },
            { n: 3, label: tx("Permission Rule Matching", "权限规则匹配", "権限ルールマッチング"), detail: tx("Exact, prefix (*), and wildcard (*test*) patterns", "精确、前缀（*）和通配符（*test*）模式", "完全一致・プレフィックス・ワイルドカードパターン"), color: "var(--purple)" },
            { n: 4, label: tx("Semantic Analysis", "语义分析", "意味解析"), detail: tx("Detects dangerous redirections to system files, blocks shell config modifications", "检测对系统文件的危险重定向，阻止 shell 配置修改", "システムファイルへの危険なリダイレクトをブロック"), color: "var(--accent)" },
            { n: 5, label: tx("Read-only Constraints", "只读约束", "読み取り専用制約"), detail: tx("Blocks write commands in non-privileged sessions, prevents privilege escalation", "在非特权会话中阻止写命令，防止权限提升", "非特権セッションで書き込みコマンドをブロック"), color: "var(--green)" },
          ].map((layer) => (
            <div
              key={layer.n}
              className="flex items-start gap-3 rounded-xl border p-3"
              style={{
                borderColor: `color-mix(in srgb, ${layer.color} 25%, transparent)`,
                background: `color-mix(in srgb, ${layer.color} 5%, var(--bg-secondary))`,
              }}
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                style={{ background: layer.color }}
              >
                {layer.n}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-text-primary">{layer.label}</span>
                <p className="mt-0.5 text-[10px] text-text-muted leading-relaxed">{layer.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`// Execution flow:
Input → validateInput()
     → checkPermissions() [bashToolHasPermission]
     → shouldUseSandbox()?
     → exec() via SandboxManager
     → Output parsing + image detection
     → Result persistence if >100K chars

// Key files:
bashPermissions.ts  — 98KB — Permission rules + classifier
bashSecurity.ts     — 102KB — Dangerous pattern detection
readOnlyValidation.ts — 68KB — Privilege escalation prevention
sedValidation.ts    — 21KB — Sed command validation
shouldUseSandbox.ts — Sandbox decision logic`}
        />
      </Card>

      {/* FileEdit Deep Dive */}
      <Card
        id="file-edit"
        title={tx("FileEditTool", "FileEditTool", "FileEditTool")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("This section explains why edits are more than a simple string replace.", "这一节解释为什么编辑并不只是简单的字符串替换。", "編集が単なる文字列置換ではない理由を説明します。")}
        links={[
          { label: "FileEditTool.ts", href: ghBlob("tools/FileEditTool/FileEditTool.ts") },
          { label: "FileReadTool.ts", href: ghBlob("tools/FileReadTool/FileReadTool.ts") },
        ]}
      >
        <CodeBlock
          code={`// Input schema:
{
  file_path: string    // absolute path
  old_string: string   // text to find
  new_string: string   // replacement text
  replace_all?: boolean // global replace
}

// Key features:
1. findActualString() — fuzzy matching
   → Quote-style preservation
   → Whitespace/indentation variations
   → Multiple match handling via exact-position lookup

2. Validation
   → File must exist or be newly created
   → File must have been read first (tracked via readFileState)
   → File timestamp must not have changed since read
   → Blocks team memory files with secrets

3. Side effects
   → Notifies LSP servers (triggers diagnostics)
   → Notifies VSCode SDK MCP
   → Updates file modification tracking
   → Discovers conditional skills by path pattern
   → Fires fileHistoryTrackEdit for versioning`}
        />
      </Card>

      {/* Tool Execution */}
      <Card
        id="tool-orchestration"
        title={tx("Tool Orchestration Strategy", "工具编排策略", "ツールオーケストレーション戦略")}
        summary={tx("Use this section to understand how many tool calls can happen in one turn without corrupting shared state.", "如果你想理解一轮里多个工具调用如何在不破坏共享状态的前提下运行，就看这里。", "複数ツール呼び出しを状態破壊なく処理する仕組みです。")}
        links={[
          { label: "toolOrchestration.ts", href: ghBlob("services/tools/toolOrchestration.ts") },
          { label: "StreamingToolExecutor.ts", href: ghBlob("services/tools/StreamingToolExecutor.ts") },
        ]}
      >
        {/* Parallel vs serial visual */}
        <div className="mb-5 overflow-hidden rounded-xl border border-border/50 bg-bg-primary p-4">
          <div className="mb-3 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold text-green">
                {tx("Read-only (parallel, up to 10)", "只读（并行，最多 10 个）", "読み取り専用（並列、最大10）")}
              </p>
              <div className="space-y-1.5">
                {["Grep", "Glob", "FileRead"].map((t) => (
                  <div key={t} className="h-5 rounded-md bg-green/20 border border-green/30 flex items-center px-2">
                    <span className="text-[9px] text-green font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-orange">
                {tx("Write (serial)", "写（串行）", "書き込み（直列）")}
              </p>
              <div className="space-y-1.5">
                {["FileEdit", "FileWrite", "Bash"].map((t) => (
                  <div key={t} className="h-5 rounded-md bg-orange/20 border border-orange/30 flex items-center px-2">
                    <span className="text-[9px] text-orange font-mono">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4">
          {tx("Tools declare ", "工具通过声明 ", "ツールは ")}<code className="text-accent">isConcurrencySafe()</code>{tx(
            " to enable parallel execution. The orchestrator partitions tool calls into batches.",
            " 来启用并行执行。编排器会把工具调用拆分成多个批次。",
            " を宣言して並列実行可否を示します。オーケストレーターはそれを基にツール呼び出しをバッチ分割します。"
          )}
        </p>
        <CodeBlock
          code={`// toolOrchestration.ts — runTools() generator

1. Partition by concurrency safety:
   → Group consecutive read-only tools (Grep, Glob, Read)
   → Isolate write tools (Edit, Write, Bash)

2. Read-only batch: parallel execution
   → Up to 10 concurrent tool calls
   → No state interference between reads

3. Write batch: serial execution
   → One tool at a time
   → Context modifiers applied between calls
   → File state cache updated after each

4. Result collection:
   → Each tool returns ToolResult<Output>
   → data, newMessages, contextModifier, mcpMeta
   → Wrapped in tool_result block with tool_use_id pairing`}
        />
      </Card>
      <NextPage
        href="/permissions"
        title={tx("Permissions & Security", "权限与安全", "権限とセキュリティ")}
        description={tx(
          "5-layer security model including the ML-powered yoloClassifier, AST-based Bash analysis, and how permission modes work.",
          "5 层安全模型，包括 ML 驱动的 yoloClassifier、基于 AST 的 Bash 分析，以及权限模式的工作方式。",
          "MLベースのyoloClassifier、AST解析、権限モードを含む5層のセキュリティモデル。"
        )}
      />
    </div>
  );
}
