"use client";

import { PageHeader, Card, CodeBlock } from "@/components/Section";
import { useTx } from "@/components/T";
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

export default function ToolsPage() {
  const tx = useTx();
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
      />

      {/* Tool Interface */}
      <Card title={tx("Tool Interface (Tool.ts)", "工具接口（Tool.ts）", "ツールインターフェース（Tool.ts）")} className="mb-6">
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

      {/* Tool Registry Visual */}
      <Card title={tx("Built-in Tools (43 total)", "内置工具（共 43 个）", "組み込みツール（全43種）")} className="mb-6">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {toolCards.map((t) => (
            <div key={t.name} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border/50 hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <t.icon className="w-3.5 h-3.5 shrink-0" style={{ color: t.color }} />
                <span className="text-xs font-semibold text-text-primary">{t.name}</span>
              </div>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-medium mb-1.5" style={{
                background: `color-mix(in srgb, ${t.color} 12%, transparent)`,
                color: t.color,
              }}>
                {t.type}
              </span>
              <p className="text-[10px] text-text-muted leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* BashTool Deep Dive */}
      <Card title={tx("BashTool Deep Dive", "BashTool 深入解析", "BashTool 詳解")} className="mb-6" accent="var(--orange)">
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The BashTool is the largest and most complex tool (~300KB across 5 files). It has multi-layered security to prevent dangerous command execution.",
            "BashTool 是体积最大也最复杂的工具（5 个文件约 300KB），采用多层安全防护来阻止危险命令执行。",
            "BashTool は最大かつ最も複雑なツールです（5ファイル合計約300KB）。危険なコマンド実行を防ぐため多層防御を備えています。"
          )}
        </p>
        <CodeBlock
          code={`// Execution flow:
Input → validateInput()
     → checkPermissions() [bashToolHasPermission]
     → shouldUseSandbox()?
     → exec() via SandboxManager
     → Output parsing + image detection
     → Result persistence if >100K chars

// Security layers:
1. AST-based parsing (tree-sitter)
   → Detects dangerous patterns: redirection, pipes, subshells

2. ML classifier (opt-in)
   → AI evaluates command safety with confidence scoring
   → Can auto-approve safe patterns (git status, ls, etc.)

3. Permission rule matching
   → Exact: "git"
   → Prefix: "git *" (any git subcommand)
   → Wildcard: "*test*" (contains pattern)

4. Semantic analysis
   → Detects dangerous redirections to system files
   → Blocks shell config modifications (.bashrc, .zshrc)

5. Read-only constraints
   → Blocks write commands in non-privileged sessions
   → Prevents privilege escalation via package managers

// Key files:
bashPermissions.ts  — 98KB — Permission rules + classifier
bashSecurity.ts     — 102KB — Dangerous pattern detection
readOnlyValidation.ts — 68KB — Privilege escalation prevention
sedValidation.ts    — 21KB — Sed command validation
shouldUseSandbox.ts — Sandbox decision logic`}
        />
      </Card>

      {/* FileEdit Deep Dive */}
      <Card title={tx("FileEditTool", "FileEditTool", "FileEditTool")} className="mb-6" accent="var(--accent)">
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
      <Card title={tx("Tool Orchestration Strategy", "工具编排策略", "ツールオーケストレーション戦略")}>
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Tools declare ",
            "工具通过声明 ",
            "ツールは "
          )}<code className="text-accent">isConcurrencySafe()</code>{tx(
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
    </div>
  );
}
