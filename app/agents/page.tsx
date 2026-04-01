"use client";

import { PageHeader, Card, CodeBlock, Table, SectionNav } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  VscGitMerge,
  VscServerProcess,
  VscGitCompare,
  VscLightbulb,
  VscSymbolEvent,
} from "react-icons/vsc";
import { HiOutlineBolt, HiOutlineGlobeAlt, HiOutlineCpuChip, HiOutlineArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";

export default function AgentsPage() {
  const tx = useTx();
  const sections = [
    { id: "agent-schema", label: tx("Input Schema", "输入模式", "入力スキーマ"), description: tx("What the agent tool accepts and why it matters.", "Agent tool 接受哪些参数，以及它们为什么重要。", "Agent tool の入力項目。") },
    { id: "execution-modes", label: tx("Execution Modes", "执行模式", "実行モード"), description: tx("Local, worktree, and remote isolation models.", "本地、worktree、远程三种隔离模型。", "ローカル、worktree、remote の違い。") },
    { id: "cache-sharing", label: tx("Cache Sharing", "缓存共享", "キャッシュ共有"), description: tx("Why subagents can be so cheap to launch.", "为什么子代理可以如此低成本地启动。", "サブエージェントが安価な理由。") },
    { id: "coordinator-mode", label: tx("Coordinator", "协调器", "コーディネーター"), description: tx("How leader/worker orchestration really works.", "leader/worker 编排到底如何运作。", "leader/worker 編成の実態。") },
    { id: "forked-agents", label: tx("Forked Agents", "分叉代理", "フォーク型エージェント"), description: tx("The background agents users often never see.", "用户通常看不到的后台代理。", "ユーザーが見ないことも多い裏方エージェント。") },
  ];

  const executionModes = [
    {
      icon: HiOutlineBolt,
      color: "var(--accent)",
      title: tx("Local", "本地", "ローカル"),
      subtitle: tx("In-process", "进程内", "同一プロセス"),
      badge: tx("Default", "默认", "デフォルト"),
      badgeColor: "var(--accent)",
      items: [
        tx("Runs in LocalAgentTask", "运行在 LocalAgentTask 中", "LocalAgentTask 上で動作"),
        tx("Shares parent AppState", "共享父级 AppState", "親 AppState を共有"),
        tx("Read/write parent filesystem", "可读写父级文件系统", "親ファイルシステムを読み書き"),
        tx("Token budget tracked separately", "Token 预算单独跟踪", "トークン予算は個別追跡"),
      ],
    },
    {
      icon: VscGitCompare,
      color: "var(--green)",
      title: tx("Worktree", "Worktree", "Worktree"),
      subtitle: tx("Git isolation", "Git 隔离", "Git 隔離"),
      badge: tx("Safe", "安全", "安全"),
      badgeColor: "var(--green)",
      items: [
        tx("Creates git worktree", "创建 git worktree", "git worktree を作成"),
        tx("Isolated git workspace", "隔离的 git 工作区", "隔離された git ワークスペース"),
        tx("Temporary branch", "临时分支", "一時ブランチ"),
        tx("Prevents code conflicts", "避免代码冲突", "コード競合を防止"),
      ],
    },
    {
      icon: HiOutlineGlobeAlt,
      color: "var(--purple)",
      title: tx("Remote", "远程", "リモート"),
      subtitle: "CCR",
      badge: tx("Full isolation", "完全隔离", "完全隔離"),
      badgeColor: "var(--purple)",
      items: [
        tx("Runs on remote servers", "运行在远程服务器上", "リモートサーバーで実行"),
        tx("Full isolation from local", "与本地完全隔离", "ローカルから完全隔離"),
        tx("Always runs in background", "始终在后台运行", "常にバックグラウンド実行"),
        tx("Requires isolation: 'remote'", "要求 isolation: 'remote'", "isolation: 'remote' が必須"),
      ],
    },
  ];

  const agentRows = [
    [tx("general-purpose", "general-purpose", "general-purpose"), tx("Default agent for complex tasks", "复杂任务的默认代理", "複雑タスク向けの標準エージェント"), tx("Full tool access", "完整工具访问", "完全なツールアクセス")],
    [tx("Explore", "Explore", "Explore"), tx("Fast codebase exploration", "快速探索代码库", "高速コード探索"), tx("Search-focused, no write tools", "专注搜索，不含写工具", "検索特化、書き込みなし")],
    [tx("Plan", "Plan", "Plan"), tx("Architecture planning", "架构规划", "設計プランニング"), tx("Design docs, no code changes", "设计文档，不改代码", "設計文書中心、コード変更なし")],
    [tx("code-review", "code-review", "code-review"), tx("PR code review", "PR 代码审查", "PRコードレビュー"), tx("Read-only analysis", "只读分析", "読み取り専用分析")],
    [tx("simplicity-engineer", "simplicity-engineer", "simplicity-engineer"), tx("Over-engineering review", "过度设计审查", "過剰設計レビュー"), tx("Complexity analysis", "复杂度分析", "複雑性分析")],
    [tx("Custom (.claude/agents/)", "自定义（.claude/agents/）", "カスタム（.claude/agents/）"), tx("User-defined agents", "用户自定义代理", "ユーザー定義エージェント"), tx("YAML/MD with frontmatter", "带 frontmatter 的 YAML/MD", "frontmatter付き YAML/MD")],
  ];

  const forkedAgents = [
    { name: "extractMemories", desc: tx("Auto-memory after each query", "每次查询后的自动记忆", "各クエリ後の自動メモリ"), icon: VscSymbolEvent, color: "var(--purple)", timing: tx("post-turn", "回合后", "ターン後") },
    { name: "sessionMemory", desc: tx("Periodic conversation notes", "周期性会话笔记", "定期的な会話メモ"), icon: VscServerProcess, color: "var(--accent)", timing: tx("periodic", "周期性", "定期") },
    { name: "promptSuggestion", desc: tx("Next prompt suggestions", "下一条提示建议", "次のプロンプト提案"), icon: VscLightbulb, color: "var(--orange)", timing: tx("post-turn", "回合后", "ターン後") },
    { name: "compaction", desc: tx("Conversation summary", "对话摘要", "会話要約"), icon: VscGitMerge, color: "var(--green)", timing: tx("threshold", "触发阈值", "閾値") },
    { name: "autoDream", desc: tx("Background memory consolidation", "后台记忆整合", "バックグラウンドの記憶統合"), icon: HiOutlineCpuChip, color: "var(--pink)", timing: tx("async", "异步", "非同期") },
    { name: "speculation", desc: tx("Fast hypothetical execution", "快速假设执行", "高速な仮想実行"), icon: HiOutlineBolt, color: "var(--red)", timing: tx("pre-turn", "回合前", "ターン前") },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Agents & Subagents", "代理与子代理", "エージェントとサブエージェント")}
        description={tx(
          "Claude Code can spawn isolated sub-agents with separate token budgets, custom prompts, and optional isolation. Cache-sharing makes forks nearly free.",
          "Claude Code 可以生成拥有独立 token 预算、自定义提示和可选隔离的子代理。缓存共享让 fork 几乎零成本。",
          "Claude Code は独立したトークン予算・カスタムプロンプト・任意の隔離を持つサブエージェントを起動できます。キャッシュ共有でforkはほぼ無料。"
        )}
        badge="AgentTool"
        links={[
          { label: "AgentTool.tsx", href: ghBlob("tools/AgentTool/AgentTool.tsx") },
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
          { label: "coordinator/", href: ghTree("coordinator") },
          { label: "remote/", href: ghTree("remote") },
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
            "When parent and subagent share the same system prompt bytes exactly, the API returns a prompt cache hit — making subagent spawning essentially free. This is why Claude Code can run 6 background agents after every turn without significant cost.",
            "当父代理与子代理的系统提示字节完全相同时，API 会命中 prompt cache，使子代理启动几乎零成本。这就是为什么 Claude Code 可以在每次回合结束后运行 6 个后台代理而不产生显著费用。",
            "親とサブエージェントのシステムプロンプトが完全に同一バイト列なら、APIがprompt cache hitを返しフォークはほぼ無料になります。毎ターン後に6つのバックグラウンドエージェントを動かせる理由はこれです。"
          )}
        </p>
      </motion.div>

      {/* Agent Input */}
      <Card
        id="agent-schema"
        title={tx("Agent Input Schema", "代理输入模式", "エージェント入力スキーマ")}
        className="mb-6"
        summary={tx("This is the interface surface for spawning or continuing agents.", "这是生成或继续代理时使用的接口层。", "エージェント起動/継続の入力面です。")}
        links={[
          { label: "AgentTool.tsx", href: ghBlob("tools/AgentTool/AgentTool.tsx") },
          { label: "loadAgentsDir.ts", href: ghBlob("tools/AgentTool/loadAgentsDir.ts") },
        ]}
      >
        <CodeBlock
          code={`// AgentTool.tsx input schema
{
  description: string          // 3-5 word task summary
  prompt: string              // Full task instructions
  subagent_type?: string      // Specialized agent selector
  model?: 'sonnet' | 'opus' | 'haiku'
  run_in_background?: boolean
  name?: string               // For multi-agent coordination
  team_name?: string          // Team context
  mode?: PermissionMode       // Override permission level
  isolation?: 'worktree' | 'remote'
  cwd?: string               // Working directory override
}`}
        />
      </Card>

      {/* Execution Modes — 3-column visual cards */}
      <Card
        id="execution-modes"
        title={tx("Execution Modes", "执行模式", "実行モード")}
        className="mb-6"
        summary={tx("Compare local, worktree, and remote execution tradeoffs.", "比较本地、worktree 与远程执行的取舍。", "ローカル、worktree、remote の比較です。")}
        links={[
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
          { label: "EnterWorktreeTool.ts", href: ghBlob("tools/EnterWorktreeTool/EnterWorktreeTool.ts") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {executionModes.map(({ icon: Icon, color, title, subtitle, badge, badgeColor, items }) => (
            <div
              key={title}
              className="rounded-xl border p-5"
              style={{
                background: `color-mix(in srgb, ${color} 5%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 20%, var(--border))`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    color: badgeColor,
                    background: `color-mix(in srgb, ${badgeColor} 10%, transparent)`,
                  }}
                >
                  {badge}
                </span>
              </div>
              <div className="mb-3">
                <h4 className="text-sm font-bold text-text-primary">{title}</h4>
                <span className="text-[11px] text-text-muted">{subtitle}</span>
              </div>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[11px] text-text-muted">
                    <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Comparison mini-table */}
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[480px] w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-muted font-medium text-[10px] uppercase tracking-wider">{tx("Feature", "特性", "機能")}</th>
                <th className="text-center py-2 px-3 text-accent font-semibold text-[10px]">Local</th>
                <th className="text-center py-2 px-3 text-green font-semibold text-[10px]">Worktree</th>
                <th className="text-center py-2 px-3 text-purple font-semibold text-[10px]">Remote</th>
              </tr>
            </thead>
            <tbody>
              {[
                [tx("Filesystem isolation", "文件系统隔离", "ファイル分離"), "✗", "✓", "✓"],
                [tx("Git branch isolation", "Git 分支隔离", "Git分離"), "✗", "✓", "✓"],
                [tx("Background execution", "后台执行", "バックグラウンド"), "opt", "opt", "✓"],
                [tx("Shared AppState", "共享 AppState", "AppState共有"), "✓", "✗", "✗"],
                [tx("Startup cost", "启动成本", "起動コスト"), tx("Lowest", "最低", "最低"), tx("Low", "低", "低"), tx("High", "高", "高")],
              ].map(([feat, local, wt, remote]) => (
                <tr key={String(feat)} className="border-b border-border/40">
                  <td className="py-2 px-3 text-text-secondary text-[11px]">{feat}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-accent">{local}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-green">{wt}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-purple">{remote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cache Sharing */}
      <Card
        id="cache-sharing"
        title={tx("Zero-Cost Cache Sharing", "零成本缓存共享", "ゼロコストのキャッシュ共有")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("The performance story of agents starts here: cache-stable prompt bytes make forks cheap.", "代理系统的性能故事从这里开始：稳定的 prompt 字节让 fork 变得便宜。", "エージェント性能の核心はここです。安定した prompt バイト列が fork を安くします。")}
        links={[
          { label: "forkedAgent.ts", href: ghBlob("utils/forkedAgent.ts") },
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
        ]}
      >
        {/* Visual cache flow diagram */}
        <div className="mb-5 rounded-xl border border-border bg-bg-tertiary/30 p-4">
          <div className="text-[10px] text-text-muted uppercase tracking-wider mb-3 font-semibold">
            {tx("Cache flow: parent → subagent", "缓存流：父代理 → 子代理", "キャッシュフロー：親 → サブエージェント")}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
            {/* Parent */}
            <div className="flex-1 rounded-lg border-2 p-3 sm:p-4" style={{ borderColor: "var(--accent)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2">
                {tx("Parent Agent", "父代理", "親エージェント")}
              </div>
              {[
                tx("System prompt", "系统提示", "システムプロンプト"),
                tx("User context", "用户上下文", "ユーザーコンテキスト"),
                tx("Tool schema", "工具模式", "ツールスキーマ"),
                tx("Thinking config", "思考配置", "思考設定"),
              ].map((item) => (
                <div key={item} className="text-[10px] text-text-muted py-0.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-sm bg-accent/40 shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center py-1 sm:pt-8">
              <div className="flex flex-col items-center gap-1">
                <HiOutlineArrowRight className="w-5 h-5 text-green hidden sm:block" />
                <div className="sm:hidden w-5 h-5 flex items-center justify-center rotate-90">
                  <HiOutlineArrowRight className="w-5 h-5 text-green" />
                </div>
                <span className="text-[9px] text-green font-semibold uppercase whitespace-nowrap">
                  {tx("frozen at fork", "fork时冻结", "fork時に固定")}
                </span>
              </div>
            </div>

            {/* Subagent */}
            <div className="flex-1 rounded-lg border-2 p-3 sm:p-4" style={{ borderColor: "var(--green)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-green mb-2">
                {tx("Subagent", "子代理", "サブエージェント")}
              </div>
              {[
                tx("Same bytes → cache HIT", "相同字节 → 缓存命中", "同一バイト列 → キャッシュHIT"),
                tx("Different bytes → cache MISS", "不同字节 → 缓存未命中", "異なるバイト → キャッシュMISS"),
              ].map((item, i) => (
                <div key={item} className="text-[10px] py-0.5 flex items-center gap-1.5" style={{ color: i === 0 ? "var(--green)" : "var(--red)" }}>
                  <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: i === 0 ? "var(--green)" : "var(--red)" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <CodeBlock
          code={`// CacheSafeParams — frozen at fork time
{
  systemPrompt: bytes      // Must match exactly
  userContext: variables    // Working dir, platform, git
  systemContext: resources  // Available tools, MCP
  toolSchema: definitions  // All tool definitions
  thinkingConfig: config   // Thinking mode settings
}

// Result: identical bytes = automatic prompt cache hit
// This enables cheap subagent spawning for:
//   - Post-turn forks (promptSuggestion, summary)
//   - Compact agents (conversation summary)
//   - Skill execution (forked command context)
//   - Speculation (fast hypothetical execution)`}
        />
      </Card>

      {/* Coordinator Mode */}
      <Card
        id="coordinator-mode"
        title={tx("Coordinator Mode", "协调器模式", "コーディネーターモード")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("This explains the leader/worker pattern Claude Code bakes into its own prompt design.", "这一节解释 Claude Code 如何把 leader/worker 模式写进自己的提示设计里。", "leader/worker パターンをどう prompt に組み込んでいるかを説明します。")}
        links={[
          { label: "coordinator/", href: ghTree("coordinator") },
          { label: "coordinatorMode.ts", href: ghBlob("coordinator/coordinatorMode.ts") },
          { label: "spawnMultiAgent.ts", href: ghBlob("tools/shared/spawnMultiAgent.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Multi-worker orchestration via a central coordinator agent. Workers report results as ",
            "通过中央协调器代理实现多 worker 编排。各 worker 以 ",
            "中央コーディネーターエージェントを通じたマルチワーカー編成です。各ワーカーは "
          )}<code className="text-accent">&lt;task-notification&gt;</code>{tx(
            " XML.",
            " XML 的形式回传结果。",
            " XML で結果を報告します。"
          )}
        </p>
        <CodeBlock
          code={`// Coordinator workflow:
1. Coordinator receives user task
2. Spawns workers via AgentTool
3. Workers execute independently
4. Results delivered as <task-notification> XML:
   - task-id, status, summary, result, usage
5. Coordinator synthesizes findings
6. Directs next task or reports to user

// Coordinator system prompt covers (~370 lines):
- Phases: research → synthesis → implementation → verification
- Parallelism strategy (when to fork)
- Prompt writing best practices
- Continuation vs. spawn decisions
- Failure handling`}
        />
        <p className="mt-4 text-sm text-text-secondary">
          {tx(
            "The important nuance in the real prompt is that the coordinator is not allowed to hand-wave research away. The system prompt explicitly says it must read worker findings, understand them itself, and then write follow-up prompts with concrete file paths and changes. In other words, Claude Code encodes a management style: synthesis stays with the leader, execution fans out to workers.",
            "真实提示里最重要的细节是：协调器不能把研究结果含糊带过。系统提示明确要求它必须先阅读 worker 的发现、自己理解，再写出带有具体文件路径和改动说明的后续提示。换句话说，Claude Code 把一种管理风格编码进了系统：综合判断留在 leader，执行则分发给 workers。",
            "実プロンプトで重要なのは、コーディネーターが調査結果を曖昧に受け流してはいけないことです。worker の発見を読み、自分で理解し、具体的なファイルパスと変更内容を含む follow-up prompt を書くことが明示されています。つまり Claude Code は一種のマネジメント様式を埋め込んでおり、統合判断は leader に残し、実行だけを workers に分散します。"
          )}
        </p>
      </Card>

      <Card
        title={tx("Coordinator Prompt Contract", "协调器提示契约", "コーディネータープロンプト契約")}
        className="mb-6"
        accent="var(--orange)"
        links={[
          { label: "coordinatorMode.ts", href: ghBlob("coordinator/coordinatorMode.ts") },
          { label: "constants/tools.ts", href: ghBlob("constants/tools.ts") },
        ]}
      >
        <CodeBlock
          code={`// coordinator/coordinatorMode.ts — notable rules
getCoordinatorUserContext(...)
  → enumerates worker tool access
  → injects MCP server names
  → may expose scratchpadDir for cross-worker knowledge

getCoordinatorSystemPrompt()
  → workers are async, launch independent work in parallel
  → don't use workers for trivial file/command reporting
  → don't say "based on your findings"
  → always synthesize findings before delegating
  → verification means proving behavior, not just presence of code`}
        />
      </Card>

      {/* Agent Types */}
      <Card
        title={tx("Built-in Agent Types", "内置代理类型", "組み込みエージェント種別")}
        className="mb-6"
        links={[
          { label: "loadAgentsDir.ts", href: ghBlob("tools/AgentTool/loadAgentsDir.ts") },
          { label: "skills/", href: ghTree("skills") },
        ]}
      >
        <Table
          headers={[
            tx("Type", "类型", "種類"),
            tx("Purpose", "用途", "目的"),
            tx("Key Capability", "关键能力", "主要機能"),
          ]}
          rows={agentRows}
        />
      </Card>

      {/* Forked Agents Timeline */}
      <Card
        id="forked-agents"
        title={tx("Forked Agents (Lightweight)", "分叉代理（轻量）", "フォーク型エージェント（軽量）")}
        className="mb-6"
        summary={tx("These are the small background agents that make the product feel smarter than a single visible loop.", "这些轻量后台代理让产品看起来不只是一个可见的单线程循环。", "単一ループ以上に賢く見せる裏方エージェントです。")}
        links={[
          { label: "extractMemories.ts", href: ghBlob("services/extractMemories/extractMemories.ts") },
          { label: "sessionMemory.ts", href: ghBlob("services/SessionMemory/sessionMemory.ts") },
          { label: "speculation.ts", href: ghBlob("services/PromptSuggestion/speculation.ts") },
        ]}
      >
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "Lightweight background queries that share the parent's cache. These fire at different points in the query lifecycle:",
            "共享父级缓存的轻量后台查询，在查询生命周期的不同节点触发：",
            "親キャッシュを共有する軽量バックグラウンドクエリです。クエリライフサイクルの異なる時点に発火します："
          )}
        </p>

        {/* Timeline strip */}
        <div className="mb-4 rounded-xl bg-bg-tertiary/30 border border-border p-4">
          <div className="flex items-center gap-3 text-[10px] text-text-muted mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="uppercase tracking-wider font-semibold">{tx("Query Lifecycle", "查询生命周期", "クエリライフサイクル")}</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-0">
            {[
              { label: tx("pre-turn", "回合前", "ターン前"), color: "var(--red)", items: ["speculation"] },
              { label: tx("main turn", "主回合", "メインターン"), color: "var(--accent)", items: [] },
              { label: tx("post-turn", "回合后", "ターン後"), color: "var(--purple)", items: ["extractMemories", "promptSuggestion"] },
              { label: tx("periodic", "周期", "定期"), color: "var(--green)", items: ["sessionMemory", "compaction", "autoDream"] },
            ].map(({ label, color, items }, i, arr) => (
              <div key={label} className="flex sm:flex-col sm:flex-1">
                <div className="flex-1 sm:flex-none">
                  <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-1 mb-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
                  </div>
                  {items.length > 0 && (
                    <div className="ml-4 sm:ml-0 flex flex-col gap-1">
                      {items.map((item) => (
                        <code key={item} className="text-[10px] text-text-muted bg-bg-secondary px-1.5 py-0.5 rounded border border-border/60 block">
                          {item}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div className="hidden sm:flex items-start pt-1 px-2">
                    <HiOutlineArrowRight className="w-3.5 h-3.5 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {forkedAgents.map(({ name, desc, icon: Icon, color, timing }) => (
            <div
              key={name}
              className="p-3 rounded-xl border"
              style={{
                background: `color-mix(in srgb, ${color} 5%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 15%, var(--border))`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
                >
                  {timing}
                </span>
              </div>
              <code className="text-[10px] text-accent block mb-0.5">{name}</code>
              <span className="text-[10px] text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Cost Comparison */}
      <Card
        title={tx("Cost Comparison: Forked vs Full Agent", "成本对比：分叉代理与完整代理", "コスト比較：フォーク型 vs フル型エージェント")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("Why forked background agents can run after every turn without breaking your budget.", "为什么分叉后台代理可以在每次回合后运行而不超出预算。", "なぜフォーク型バックグラウンドエージェントは毎ターン後でも予算を超えないか。")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "color-mix(in srgb, var(--green) 30%, var(--border))", background: "color-mix(in srgb, var(--green) 5%, var(--bg-secondary))" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-green mb-2">
              {tx("Forked Agent (cheap)", "分叉代理（便宜）", "フォーク型（安い）")}
            </div>
            {[
              { label: tx("Startup cost", "启动成本", "起動コスト"), value: tx("~0 tokens", "~0 token", "~0トークン"), good: true },
              { label: tx("System prompt", "系统提示", "システムプロンプト"), value: tx("Cache HIT", "缓存命中", "キャッシュHIT"), good: true },
              { label: tx("Memory", "内存", "メモリ"), value: tx("Shares parent AppState", "共享父 AppState", "親AppState共有"), good: true },
              { label: tx("Isolation", "隔离性", "隔離"), value: tx("None", "无", "なし"), good: false },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                <span className="text-[10px] text-text-muted">{row.label}</span>
                <span className="text-[10px] font-semibold" style={{ color: row.good ? "var(--green)" : "var(--text-muted)" }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div
            className="rounded-xl border p-4"
            style={{ borderColor: "color-mix(in srgb, var(--orange) 30%, var(--border))", background: "color-mix(in srgb, var(--orange) 5%, var(--bg-secondary))" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange mb-2">
              {tx("Full Agent (expensive)", "完整代理（昂贵）", "フル型（高い）")}
            </div>
            {[
              { label: tx("Startup cost", "启动成本", "起動コスト"), value: tx("Full context re-send", "重新发送完整上下文", "完全コンテキスト再送信"), good: false },
              { label: tx("System prompt", "系统提示", "システムプロンプト"), value: tx("May MISS cache", "可能未命中缓存", "キャッシュMISSの可能性"), good: false },
              { label: tx("Memory", "内存", "メモリ"), value: tx("Own AppState instance", "独立 AppState 实例", "独自AppStateインスタンス"), good: true },
              { label: tx("Isolation", "隔离性", "隔離"), value: tx("Git worktree / remote", "Git worktree / 远程", "Git worktree / リモート"), good: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1 border-b border-border/30 last:border-0">
                <span className="text-[10px] text-text-muted">{row.label}</span>
                <span className="text-[10px] font-semibold" style={{ color: row.good ? "var(--green)" : "var(--orange)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          {tx(
            "Forked agents like extractMemories and promptSuggestion fire after every turn. They get cache hits because their system prompt bytes are identical to the parent — making 6 background agents nearly free per turn. Full agents (worktree, remote) pay the full cold-start cost but get proper isolation.",
            "extractMemories 和 promptSuggestion 等分叉代理在每次回合后触发。由于它们的系统提示字节与父代理完全相同，因此能命中缓存——使每次回合的 6 个后台代理几乎免费。完整代理（worktree、remote）需要支付完整的冷启动成本，但可以获得适当的隔离。",
            "extractMemories や promptSuggestion などのフォーク型エージェントは毎ターン後に発火します。システムプロンプトのバイト列が親と完全に同一なためキャッシュヒットし、6つのバックグラウンドエージェントがほぼ無料になります。フル型（worktree、remote）はフルのコールドスタートコストを払いますが、適切な隔離が得られます。"
          )}
        </p>
      </Card>

      {/* Coordinator Quote */}
      <Card
        title={tx("Coordinator's Golden Rule", "协调器黄金法则", "コーディネーターの黄金律")}
        accent="var(--orange)"
        links={[
          { label: "coordinator/", href: ghTree("coordinator") },
          { label: "AgentTool.tsx", href: ghBlob("tools/AgentTool/AgentTool.tsx") },
        ]}
      >
        <div className="p-4 rounded-xl bg-bg-tertiary/20 border-l-2" style={{ borderLeftColor: "var(--orange)" }}>
          <p className="text-sm text-text-secondary italic leading-relaxed">
            {tx(
              "\"When workers report research findings, ",
              "当 worker 回报研究结论时，",
              "「ワーカーが調査結果を返したら、"
            )}<strong className="text-text-primary">{tx(
              "you must understand them before directing follow-up work",
              "你必须先理解它们，再去安排后续工作",
              "追加作業を指示する前に必ず内容を理解しなければならない"
            )}</strong>{tx(
              ". Read the findings. Identify the approach. Then write a prompt that proves you understood by including specific file paths, line numbers, and exactly what to change.\"",
              "。先读结论，确认方案，再写出能证明你确实理解的提示，其中要包含具体文件路径、行号以及明确的改动内容。",
              "。結果を読み、方針を特定し、その理解を示すために具体的なファイルパス、行番号、変更内容を含むプロンプトを書け。」"
            )}
          </p>
          <p className="text-[10px] text-text-muted mt-2">{tx("— coordinator system prompt, line ~180", "— 协调器系统提示，约第 180 行", "— コーディネーターシステムプロンプト、約180行目")}</p>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {tx(
            "The coordinator can't just throw tasks at workers blindly — the system prompt explicitly requires it to prove comprehension before delegating. Even AI managers have to actually read the reports.",
            "协调器不能盲目把任务甩给 workers。系统提示明确要求它在委派前证明自己已经理解，连 AI 管理者也得认真读报告。",
            "コーディネーターは盲目的にタスクを投げられません。委任前に理解を証明することが明示的に求められており、AIマネージャーですら報告を読む必要があります。"
          )}
        </p>
      </Card>
    </div>
  );
}
