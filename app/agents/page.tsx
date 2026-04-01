"use client";

import { PageHeader, Card, CodeBlock, Table, SectionNav, NextPage, InsightCallout, RelatedPages, TldrBox } from "@/components/Section";
import { useTx } from "@/components/T";
import { ghBlob, ghTree } from "@/lib/sourceLinks";
import {
  VscGitMerge,
  VscServerProcess,
  VscGitCompare,
  VscLightbulb,
  VscSymbolEvent,
  VscDatabase,
  VscShield,
} from "react-icons/vsc";
import {
  HiOutlineBolt,
  HiOutlineGlobeAlt,
  HiOutlineCpuChip,
  HiOutlineArrowRight,
  HiOutlineArrowDown,
  HiOutlineArrowLongRight,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { motion } from "framer-motion";

export default function AgentsPage() {
  const tx = useTx();
  const sections = [
    { id: "spawn-flow", label: tx("Spawn Flow", "启动流程", "起動フロー"), description: tx("Step-by-step: how a subagent is born.", "一步步看子代理如何被创建。", "サブエージェントが生まれるまで。") },
    { id: "execution-modes", label: tx("Execution Modes", "执行模式", "実行モード"), description: tx("Local, worktree, and remote isolation models.", "本地、worktree、远程三种隔离模型。", "ローカル、worktree、remote の違い。") },
    { id: "cache-sharing", label: tx("Cache Sharing", "缓存共享", "キャッシュ共有"), description: tx("Why subagents can be so cheap to launch.", "为什么子代理可以如此低成本地启动。", "サブエージェントが安価な理由。") },
    { id: "forked-agents", label: tx("Forked Agents", "分叉代理", "フォーク型エージェント"), description: tx("Background agents that fire at each lifecycle phase.", "在每个生命周期阶段触发的后台代理。", "各フェーズに発火するバックグラウンドエージェント。") },
    { id: "coordinator-mode", label: tx("Coordinator", "协调器", "コーディネーター"), description: tx("How leader/worker orchestration really works.", "leader/worker 编排到底如何运作。", "leader/worker 編成の実態。") },
    { id: "agent-types", label: tx("Agent Types", "代理类型", "エージェント種別"), description: tx("Built-in agent types and custom agents.", "内置代理类型与自定义代理。", "組み込みと自定義エージェント。") },
  ];

  const executionModes = [
    {
      icon: HiOutlineBolt,
      color: "var(--accent)",
      title: tx("Local", "本地", "ローカル"),
      subtitle: tx("In-process", "进程内", "同一プロセス"),
      badge: tx("Default · Zero cost", "默认 · 零成本", "デフォルト · ゼロコスト"),
      diagram: tx("Shares parent AppState directly", "直接共享父级 AppState", "親AppStateを直接共有"),
      bestFor: [
        tx("Memory extraction", "记忆提取", "メモリ抽出"),
        tx("Prompt suggestions", "提示建议", "プロンプト提案"),
        tx("Auto-compaction", "自动压缩", "自動圧縮"),
        tx("Background annotations", "后台注释", "バックグラウンド注釈"),
      ],
      tradeoff: tx("No isolation — shares filesystem", "无隔离 — 共享文件系统", "隔離なし — ファイル共有"),
    },
    {
      icon: VscGitCompare,
      color: "var(--orange)",
      title: tx("Worktree", "Worktree", "Worktree"),
      subtitle: tx("Git isolation", "Git 隔离", "Git 隔離"),
      badge: tx("Safe · Git branch", "安全 · Git 分支", "安全 · Gitブランチ"),
      diagram: tx("Creates isolated git worktree branch", "创建独立的 git worktree 分支", "独立のgit worktreeブランチ作成"),
      bestFor: [
        tx("Parallel feature development", "并行功能开发", "並行機能開発"),
        tx("Risky refactors", "高风险重构", "リスクの高いリファクタ"),
        tx("Experimental changes", "实验性变更", "実験的な変更"),
        tx("Code review agents", "代码审查代理", "コードレビューエージェント"),
      ],
      tradeoff: tx("Own git branch — merges manually", "独立分支 — 需手动合并", "独自ブランチ — 手動マージ"),
    },
    {
      icon: HiOutlineGlobeAlt,
      color: "var(--purple)",
      title: tx("Remote", "远程", "リモート"),
      subtitle: "CCR",
      badge: tx("Full isolation · Network", "完全隔离 · 网络", "完全隔離 · ネットワーク"),
      diagram: tx("Runs on remote CCR servers", "运行在远程 CCR 服务器上", "リモートCCRサーバーで実行"),
      bestFor: [
        tx("True parallelism at scale", "真正的大规模并行", "大規模な真の並列処理"),
        tx("Sensitive operations", "敏感操作", "機密性の高い操作"),
        tx("Long-running background work", "长时间运行的后台工作", "長時間のバックグラウンド処理"),
        tx("Multi-machine workflows", "多机工作流", "マルチマシンワークフロー"),
      ],
      tradeoff: tx("High startup cost — full cold start", "高启动成本 — 完全冷启动", "高い起動コスト — フルコールドスタート"),
    },
  ];

  const forkedAgents = [
    {
      name: "speculation",
      desc: tx("Pre-executes likely next steps in /tmp overlay", "在 /tmp overlay 中预执行可能的下一步", "/tmp overlayで次の一手を先行実行"),
      icon: HiOutlineBolt,
      color: "var(--red)",
      phase: tx("Pre-turn", "回合前", "ターン前"),
      phaseColor: "var(--red)",
    },
    {
      name: "extractMemories",
      desc: tx("Extracts facts to CLAUDE.md after each query", "每次查询后提取事实到 CLAUDE.md", "各クエリ後に事実をCLAUDE.mdへ抽出"),
      icon: VscSymbolEvent,
      color: "var(--purple)",
      phase: tx("Post-turn", "回合后", "ターン後"),
      phaseColor: "var(--purple)",
    },
    {
      name: "promptSuggestion",
      desc: tx("Generates 3 follow-up prompt ideas", "生成 3 条后续提示建议", "フォローアップ案を3つ生成"),
      icon: VscLightbulb,
      color: "var(--orange)",
      phase: tx("Post-turn", "回合后", "ターン後"),
      phaseColor: "var(--purple)",
    },
    {
      name: "sessionMemory",
      desc: tx("Periodic conversation notes across sessions", "跨会话的周期性对话笔记", "セッション横断の定期的なメモ"),
      icon: VscServerProcess,
      color: "var(--accent)",
      phase: tx("Periodic", "周期性", "定期"),
      phaseColor: "var(--green)",
    },
    {
      name: "compaction",
      desc: tx("Conversation summary when context hits threshold", "上下文达到阈值时生成对话摘要", "コンテキストが閾値に達した際の要約"),
      icon: VscDatabase,
      color: "var(--green)",
      phase: tx("Threshold", "触发阈值", "閾値"),
      phaseColor: "var(--green)",
    },
    {
      name: "autoDream",
      desc: tx("Memory consolidation after 24h + 5 sessions", "24h + 5 个会话后的记忆整合", "24h+5セッション後のメモリ統合"),
      icon: HiOutlineCpuChip,
      color: "var(--pink)",
      phase: tx("24h + 5 sessions", "24h + 5次会话", "24h + 5セッション"),
      phaseColor: "var(--pink)",
    },
  ];

  const agentRows = [
    [tx("general-purpose", "general-purpose", "general-purpose"), tx("Default for complex tasks", "复杂任务的默认代理", "複雑タスク向けのデフォルト"), tx("Full tool access", "完整工具访问", "完全なツールアクセス")],
    [tx("Explore", "Explore", "Explore"), tx("Fast codebase exploration", "快速探索代码库", "高速コード探索"), tx("Search-focused, no write tools", "专注搜索，不含写工具", "検索特化、書き込みなし")],
    [tx("Plan", "Plan", "Plan"), tx("Architecture planning", "架构规划", "設計プランニング"), tx("Design docs, no code changes", "设计文档，不改代码", "設計文書中心")],
    [tx("code-review", "code-review", "code-review"), tx("PR code review", "PR 代码审查", "PRコードレビュー"), tx("Read-only analysis", "只读分析", "読み取り専用分析")],
    [tx("simplicity-engineer", "simplicity-engineer", "simplicity-engineer"), tx("Over-engineering review", "过度设计审查", "過剰設計レビュー"), tx("Complexity analysis", "复杂度分析", "複雑性分析")],
    [tx("Custom (.claude/agents/)", "自定义（.claude/agents/）", "カスタム（.claude/agents/）"), tx("User-defined agents", "用户自定义代理", "ユーザー定義エージェント"), tx("YAML/MD with frontmatter", "带 frontmatter 的 YAML/MD", "frontmatter付き YAML/MD")],
  ];

  const spawnSteps = [
    {
      step: "1",
      label: tx("User prompt", "用户提示", "ユーザープロンプト"),
      detail: tx("Task arrives at coordinator", "任务到达协调器", "タスクがコーディネーターに到達"),
      color: "var(--accent)",
      icon: HiOutlineSparkles,
    },
    {
      step: "2",
      label: tx("AgentTool called", "调用 AgentTool", "AgentTool呼出"),
      detail: tx("Model emits tool_use block", "模型发出 tool_use 块", "モデルがtool_useブロックを発出"),
      color: "var(--green)",
      icon: HiOutlineBolt,
    },
    {
      step: "3",
      label: tx("CacheSafeParams frozen", "CacheSafeParams 冻结", "CacheSafeParams固定"),
      detail: tx("System prompt bytes locked for cache hit", "系统提示字节锁定以命中缓存", "キャッシュヒットのためバイト列固定"),
      color: "var(--orange)",
      icon: VscShield,
    },
    {
      step: "4",
      label: tx("Subagent spins up", "子代理启动", "サブエージェント起動"),
      detail: tx("LocalAgentTask / worktree / CCR remote", "LocalAgentTask / worktree / CCR 远程", "LocalAgentTask / worktree / CCR"),
      color: "var(--purple)",
      icon: HiOutlineCpuChip,
    },
    {
      step: "5",
      label: tx("Executes independently", "独立执行", "独立実行"),
      detail: tx("Own token budget, separate turn loop", "独立 token 预算，独立回合循环", "独自トークン予算、独立ターンループ"),
      color: "var(--pink)",
      icon: VscGitMerge,
    },
    {
      step: "6",
      label: tx("Returns XML", "返回 XML", "XML返却"),
      detail: tx("<task-notification> with result + usage", "<task-notification> 含结果和用量", "<task-notification>で結果+使用量"),
      color: "var(--green)",
      icon: HiOutlineCheckCircle,
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Agents & Subagents", "代理与子代理", "エージェントとサブエージェント")}
        description={tx(
          "The most architecturally interesting part of Claude Code. Spawn isolated agents with separate token budgets, zero-cost cache sharing, and 3 isolation levels — all from a single AgentTool call.",
          "Claude Code 中最具架构价值的部分。通过单次 AgentTool 调用，启动拥有独立 token 预算、零成本缓存共享和 3 种隔离级别的子代理。",
          "Claude Codeで最もアーキテクチャ的に興味深い部分。単一のAgentTool呼び出しで、独立したトークン予算・ゼロコストキャッシュ共有・3段階の隔離レベルを持つサブエージェントを起動。"
        )}
        badge="AgentTool"
        links={[
          { label: "AgentTool.tsx", href: ghBlob("tools/AgentTool/AgentTool.tsx") },
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
          { label: "coordinator/", href: ghTree("coordinator") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      />

      <TldrBox
        color="var(--purple)"
        items={[
          tx(
            "AgentTool spawns a full Claude instance with its own token budget. The child agent runs the same query() loop independently — including its own tool calls, compaction, and recovery.",
            "AgentTool 启动一个完整的 Claude 实例，拥有独立的 token 预算。子代理独立运行同一套 query() 循环——包括自己的工具调用、压缩和恢复。",
            "AgentToolは独自トークン予算を持つ完全なClaudeインスタンスを起動します。子エージェントは独立してquery()ループを実行し、独自のツール呼び出し・圧縮・回復も行います。"
          ),
          tx(
            "CacheSafeParams (Step 3 of spawn flow) freezes the system prompt bytes at fork time. If parent and child have identical bytes, the API returns a prompt cache hit — zero extra cost for spawning.",
            "CacheSafeParams（启动流程第 3 步）在 fork 时冻结系统提示字节。父子字节完全相同时，API 返回 prompt cache hit——生成子代理几乎零额外成本。",
            "CacheSafeParams（起動フロー第3ステップ）はfork時にシステムプロンプトのバイト列を固定します。親子で同一バイト列なら prompt cache hit — サブエージェント起動のコストはほぼゼロ。"
          ),
          tx(
            "3 isolation modes: Local (in-process, shared state), Worktree (git-isolated branch), Remote (CCR server, full isolation). Pick the level of risk your task warrants.",
            "3 种隔离模式：Local（进程内，共享状态）、Worktree（git 隔离分支）、Remote（CCR 服务器，完全隔离）。根据任务风险选择合适的隔离级别。",
            "3つの隔離モード：Local（インプロセス、共有状態）、Worktree（git隔離ブランチ）、Remote（CCRサーバー、完全隔離）。タスクのリスクに応じて選択。"
          ),
          tx(
            "6 forked background agents run automatically: speculation (pre-executes next steps), extractMemories, promptSuggestion, sessionMemory, compaction, and autoDream (after 24h + 5 sessions).",
            "6 种 fork 后台代理自动运行：speculation（预执行下一步）、extractMemories、promptSuggestion、sessionMemory、compaction，以及 autoDream（24h + 5 次会话后触发）。",
            "6つのforkバックグラウンドエージェントが自動実行：speculation（次の一手を先行実行）、extractMemories、promptSuggestion、sessionMemory、compaction、autoDream（24h+5セッション後）。"
          ),
        ]}
      />

      {/* Hero Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 grid grid-cols-3 gap-3"
      >
        {[
          { value: "3", label: tx("Execution modes", "执行模式", "実行モード"), sub: tx("Local · Worktree · Remote", "本地 · Worktree · 远程", "ローカル · Worktree · リモート"), color: "var(--accent)" },
          { value: "0x", label: tx("Cache sharing cost", "缓存共享成本", "キャッシュ共有コスト"), sub: tx("Same bytes = free spawn", "相同字节 = 免费启动", "同一バイト列 = 無料起動"), color: "var(--green)" },
          { value: "∞", label: tx("Nesting depth", "嵌套深度", "ネスト深さ"), sub: tx("Agents spawning agents", "代理嵌套代理", "エージェントがエージェントを生成"), color: "var(--purple)" },
        ].map(({ value, label, sub, color }) => (
          <div
            key={label}
            className="relative overflow-hidden rounded-2xl border p-4 sm:p-6 text-center"
            style={{
              borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
              background: `color-mix(in srgb, ${color} 6%, var(--bg-secondary))`,
            }}
          >
            <div
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono mb-1"
              style={{ color }}
            >
              {value}
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-text-primary mb-0.5">{label}</div>
            <div className="text-[9px] sm:text-[10px] text-text-muted">{sub}</div>
            <div
              className="pointer-events-none absolute -right-4 -bottom-4 h-16 w-16 rounded-full opacity-5"
              style={{ background: color }}
            />
          </div>
        ))}
      </motion.div>

      <SectionNav title={tx("Jump To", "跳转到", "移動先")} sections={sections} />

      {/* Agent Spawning Flow */}
      <Card
        id="spawn-flow"
        title={tx("The Agent Spawning Flow", "代理启动流程", "エージェント起動フロー")}
        className="mb-6"
        accent="var(--accent)"
        summary={tx("Every subagent follows this exact 6-step lifecycle. Understanding it unlocks why cache sharing is the key innovation.", "每个子代理都遵循这个 6 步生命周期。理解它才能明白为什么缓存共享是核心创新。", "すべてのサブエージェントはこの6ステップのライフサイクルを辿ります。これを理解することで、なぜキャッシュ共有が核心的な革新なのかがわかります。")}
        links={[
          { label: "AgentTool.tsx", href: ghBlob("tools/AgentTool/AgentTool.tsx") },
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
        ]}
      >
        {/* Step cards: horizontal on desktop, vertical on mobile */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-1 sm:items-start">
          {spawnSteps.map(({ step, label, detail, color, icon: Icon }, i) => (
            <div key={step} className="flex sm:flex-col sm:flex-1 items-center sm:items-stretch gap-2 sm:gap-0">
              <div
                className="flex-1 sm:flex-none rounded-xl border p-3 sm:p-3.5"
                style={{
                  background: `color-mix(in srgb, ${color} 7%, var(--bg-tertiary))`,
                  borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: color, color: "white" }}
                  >
                    {step}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                </div>
                <div className="text-[11px] font-semibold text-text-primary mb-0.5 leading-snug">{label}</div>
                <div className="text-[9px] text-text-muted leading-relaxed">{detail}</div>
              </div>
              {i < spawnSteps.length - 1 && (
                <div className="flex items-center justify-center shrink-0 sm:py-2">
                  <HiOutlineArrowRight className="hidden sm:block w-4 h-4 text-border" />
                  <HiOutlineArrowDown className="sm:hidden w-4 h-4 text-border" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 3 callout — CacheSafeParams is the magic */}
        <div
          className="mt-4 rounded-xl border-l-4 p-3 sm:p-4"
          style={{ borderLeftColor: "var(--orange)", background: "color-mix(in srgb, var(--orange) 5%, var(--bg-secondary))" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--orange)" }}>
            {tx("Step 3 is the key", "步骤 3 是关键", "ステップ3が核心")}
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            {tx(
              "CacheSafeParams freezes the system prompt bytes at fork time. If parent and subagent bytes match exactly, the API returns a prompt cache hit — making every forked agent nearly free.",
              "CacheSafeParams 在 fork 时冻结系统提示字节。如果父代理和子代理的字节完全匹配，API 就会命中 prompt cache，让每个 fork 代理几乎免费。",
              "CacheSafeParamsはfork時にシステムプロンプトのバイト列を固定します。親とサブエージェントのバイト列が完全一致すれば、APIはprompt cache hitを返し、各forkエージェントはほぼ無料になります。"
            )}
          </p>
        </div>
      </Card>

      {/* Execution Modes — 3 big cards */}
      <Card
        id="execution-modes"
        title={tx("3 Execution Modes", "3 种执行模式", "3つの実行モード")}
        className="mb-6"
        summary={tx("Choose the right isolation level for the task. Default is always Local.", "根据任务选择正确的隔离级别。默认始终是 Local。", "タスクに応じて適切な隔離レベルを選択。デフォルトは常にLocal。")}
        links={[
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
          { label: "EnterWorktreeTool.ts", href: ghBlob("tools/EnterWorktreeTool/EnterWorktreeTool.ts") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      >
        {/* Isolation spectrum bar */}
        <div className="mb-5 rounded-xl border border-border/60 bg-bg-tertiary/30 p-4">
          <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-text-muted">
            <span>{tx("← Cheap · Shared · Fast startup", "← 成本低 · 共享 · 启动快", "← 低コスト · 共有 · 高速起動")}</span>
            <span className="text-right">{tx("Isolated · Safe · Slow startup →", "隔离 · 安全 · 启动慢 →", "隔離 · 安全 · 低速起動 →")}</span>
          </div>
          <div className="relative h-3 rounded-full overflow-hidden" style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--accent) 60%, var(--bg-tertiary)), color-mix(in srgb, var(--orange) 60%, var(--bg-tertiary)), color-mix(in srgb, var(--purple) 60%, var(--bg-tertiary)))" }}>
            {/* Mode markers */}
            {[
              { label: "Local", pos: "15%", color: "var(--accent)" },
              { label: "Worktree", pos: "50%", color: "var(--orange)" },
              { label: "Remote", pos: "85%", color: "var(--purple)" },
            ].map(({ label, pos, color }) => (
              <div key={label} className="absolute top-0 flex flex-col items-center" style={{ left: pos, transform: "translateX(-50%)" }}>
                <div className="h-3 w-0.5 bg-white/60" />
              </div>
            ))}
          </div>
          <div className="relative mt-1">
            {[
              { label: "Local", pos: "15%", color: "var(--accent)" },
              { label: "Worktree", pos: "50%", color: "var(--orange)" },
              { label: "Remote (CCR)", pos: "85%", color: "var(--purple)" },
            ].map(({ label, pos, color }) => (
              <div key={label} className="absolute text-[9px] font-bold" style={{ left: pos, transform: "translateX(-50%)", color }}>
                {label}
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-[9px] text-text-muted">
            <div className="text-center">
              <div className="font-semibold" style={{ color: "var(--accent)" }}>~0 tokens</div>
              <div>{tx("spawn cost", "启动成本", "起動コスト")}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold" style={{ color: "var(--orange)" }}>Low</div>
              <div>{tx("spawn cost", "启动成本", "起動コスト")}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold" style={{ color: "var(--purple)" }}>High</div>
              <div>{tx("spawn cost", "启动成本", "起動コスト")}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {executionModes.map(({ icon: Icon, color, title, subtitle, badge, diagram, bestFor, tradeoff }) => (
            <div
              key={title}
              className="rounded-2xl border p-5 flex flex-col"
              style={{
                background: `color-mix(in srgb, ${color} 6%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-center leading-tight"
                  style={{
                    color,
                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                  }}
                >
                  {badge}
                </span>
              </div>

              <div className="mb-3">
                <h4 className="text-base font-bold text-text-primary">{title}</h4>
                <span className="text-xs text-text-muted">{subtitle}</span>
              </div>

              {/* Diagram box */}
              <div
                className="mb-4 rounded-lg p-2.5 text-[10px] text-center font-mono"
                style={{
                  background: `color-mix(in srgb, ${color} 10%, var(--bg-primary))`,
                  color,
                  border: `1px dashed color-mix(in srgb, ${color} 30%, transparent)`,
                }}
              >
                {diagram}
              </div>

              {/* Best for */}
              <div className="mb-3 flex-1">
                <div className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-2">
                  {tx("Best for", "适合场景", "最適なケース")}
                </div>
                <ul className="space-y-1.5">
                  {bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[11px] text-text-secondary">
                      <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tradeoff */}
              <div
                className="text-[10px] rounded-lg px-3 py-2"
                style={{
                  color: "var(--text-muted)",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                ⚠ {tradeoff}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[480px] w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-text-muted font-medium text-[10px] uppercase tracking-wider">{tx("Feature", "特性", "機能")}</th>
                <th className="text-center py-2 px-3 text-accent font-semibold text-[10px]">Local</th>
                <th className="text-center py-2 px-3 font-semibold text-[10px]" style={{ color: "var(--orange)" }}>Worktree</th>
                <th className="text-center py-2 px-3 text-purple font-semibold text-[10px]">Remote</th>
              </tr>
            </thead>
            <tbody>
              {[
                [tx("Filesystem isolation", "文件系统隔离", "ファイル分離"), "✗", "✓", "✓"],
                [tx("Git branch isolation", "Git 分支隔离", "Git分離"), "✗", "✓", "✓"],
                [tx("Background execution", "后台执行", "バックグラウンド"), "opt", "opt", "✓"],
                [tx("Shared AppState", "共享 AppState", "AppState共有"), "✓", "✗", "✗"],
                [tx("Cache sharing", "缓存共享", "キャッシュ共有"), "✓", "✓", "✗"],
                [tx("Startup cost", "启动成本", "起動コスト"), tx("~0 tokens", "~0 token", "~0トークン"), tx("Low", "低", "低"), tx("High", "高", "高")],
              ].map(([feat, local, wt, remote]) => (
                <tr key={String(feat)} className="border-b border-border/40">
                  <td className="py-2 px-3 text-text-secondary text-[11px]">{feat}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-accent">{local}</td>
                  <td className="py-2 px-3 text-center text-[11px]" style={{ color: "var(--orange)" }}>{wt}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-purple">{remote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cache Sharing Deep Dive */}
      <Card
        id="cache-sharing"
        title={tx("Zero-Cost Cache Sharing", "零成本缓存共享", "ゼロコストのキャッシュ共有")}
        className="mb-6"
        accent="var(--green)"
        summary={tx("The key innovation that makes 6+ background agents per turn economically viable.", "让每次回合运行 6+ 个后台代理在经济上可行的核心创新。", "1ターンごとに6つ以上のバックグラウンドエージェントを経済的に可能にする核心的な革新。")}
        links={[
          { label: "forkedAgent.ts", href: ghBlob("utils/forkedAgent.ts") },
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
        ]}
      >
        {/* The math visual */}
        <div
          className="mb-5 rounded-2xl border p-4 sm:p-6"
          style={{ borderColor: "color-mix(in srgb, var(--green) 30%, var(--border))", background: "color-mix(in srgb, var(--green) 5%, var(--bg-secondary))" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-green mb-4">
            {tx("The math", "计算逻辑", "計算式")}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
            <div className="rounded-xl border-2 p-3 text-center" style={{ borderColor: "var(--accent)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-2">
                {tx("Parent Agent", "父代理", "親エージェント")}
              </div>
              <div className="text-2xl font-bold font-mono text-text-primary mb-1">10K</div>
              <div className="text-[9px] text-text-muted">{tx("tokens in system prompt", "系统提示 token 数", "システムプロンプトのトークン")}</div>
            </div>

            <div className="flex flex-col items-center gap-1 py-2">
              <HiOutlineArrowRight className="hidden sm:block w-6 h-6 text-green" />
              <HiOutlineArrowDown className="sm:hidden w-6 h-6 text-green" />
              <div className="text-[9px] font-bold text-green uppercase tracking-wider">
                {tx("same bytes →", "相同字节 →", "同一バイト →")}
              </div>
              <div className="text-[9px] font-bold text-green uppercase tracking-wider">
                CACHE HIT
              </div>
            </div>

            <div className="rounded-xl border-2 p-3 text-center" style={{ borderColor: "var(--green)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-green mb-2">
                {tx("Each Subagent", "每个子代理", "各サブエージェント")}
              </div>
              <div className="text-2xl font-bold font-mono text-green mb-1">~0</div>
              <div className="text-[9px] text-text-muted">{tx("tokens charged for prompt", "系统提示计费 token", "プロンプト課金トークン")}</div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-bg-primary border border-border p-3 text-center">
            <p className="text-[11px] text-text-secondary">
              {tx(
                "Instead of paying 10K tokens each time × 6 agents = 60K tokens per turn, Claude Code pays once and gets 6 cache hits. At scale: this is the difference between affordable and prohibitive.",
                "不再是每次支付 10K token × 6 个代理 = 每回合 60K token，Claude Code 只支付一次，获得 6 次缓存命中。在规模化场景下，这就是可负担与天价之间的区别。",
                "1回10Kトークン×6エージェント=1ターン60Kトークンではなく、1回払えば6回キャッシュヒット。スケールすると、これが「許容範囲」と「天文学的コスト」の差になります。"
              )}
            </p>
          </div>
        </div>

        {/* CacheSafeParams fields */}
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">
          {tx("CacheSafeParams — frozen at fork time", "CacheSafeParams — fork 时冻结", "CacheSafeParams — fork時に固定")}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-4">
          {[
            { field: "systemPrompt", desc: tx("Must match exactly byte-for-byte", "必须逐字节完全匹配", "バイト単位で完全一致が必須"), color: "var(--accent)" },
            { field: "userContext", desc: tx("Working dir, platform, git state", "工作目录、平台、Git 状态", "作業ディレクトリ、プラットフォーム、Git"), color: "var(--green)" },
            { field: "toolSchema", desc: tx("All available tool definitions", "所有可用工具定义", "利用可能な全ツール定義"), color: "var(--orange)" },
            { field: "thinkingConfig", desc: tx("Thinking mode settings", "思考模式设置", "思考モード設定"), color: "var(--purple)" },
          ].map(({ field, desc, color }) => (
            <div
              key={field}
              className="rounded-xl border p-3"
              style={{
                background: `color-mix(in srgb, ${color} 5%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 20%, var(--border))`,
              }}
            >
              <code className="text-[10px] font-bold block mb-1" style={{ color }}>{field}</code>
              <p className="text-[9px] text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`// CacheSafeParams — frozen at fork time
{
  systemPrompt: bytes      // Must match exactly — any change = cache MISS
  userContext: variables   // Working dir, platform, git
  systemContext: resources // Available tools, MCP servers
  toolSchema: definitions  // All tool definitions
  thinkingConfig: config   // Thinking mode settings
}

// Same bytes → prompt cache HIT → ~0 cost for subagent system prompt
// Changed bytes → cache MISS → pay full 10K+ tokens again`}
        />
      </Card>

      {/* Forked Agents Timeline */}
      <Card
        id="forked-agents"
        title={tx("Forked Agents Timeline", "分叉代理时间线", "フォーク型エージェントのタイムライン")}
        className="mb-6"
        summary={tx("Background agents users never see — but that make the product feel smarter. Each fires at a specific phase.", "用户永远看不到的后台代理，但正是它们让产品显得更聪明。每个代理在特定阶段触发。", "ユーザーが見ることのないバックグラウンドエージェント。しかしこれらが製品を賢く見せます。各エージェントは特定のフェーズで発火します。")}
        links={[
          { label: "extractMemories.ts", href: ghBlob("services/extractMemories/extractMemories.ts") },
          { label: "sessionMemory.ts", href: ghBlob("services/SessionMemory/sessionMemory.ts") },
          { label: "speculation.ts", href: ghBlob("services/PromptSuggestion/speculation.ts") },
        ]}
      >
        {/* Horizontal timeline on desktop, vertical on mobile */}
        <div className="mb-5 rounded-2xl border border-border bg-bg-tertiary/30 p-4 overflow-x-auto">
          <div className="min-w-[560px] sm:min-w-0">
            {/* Phase labels row */}
            <div className="flex gap-2 mb-3">
              {[
                { phase: tx("PRE-TURN", "回合前", "ターン前"), color: "var(--red)", flex: 1 },
                { phase: tx("MAIN TURN", "主回合", "メインターン"), color: "var(--accent)", flex: 2 },
                { phase: tx("POST-TURN", "回合后", "ターン後"), color: "var(--purple)", flex: 2 },
                { phase: tx("PERIODIC", "周期", "定期"), color: "var(--green)", flex: 2 },
              ].map(({ phase, color, flex }) => (
                <div
                  key={phase}
                  className="rounded-lg px-2 py-1.5 text-center text-[9px] font-bold uppercase tracking-wider"
                  style={{ flex, background: `color-mix(in srgb, ${color} 12%, transparent)`, color }}
                >
                  {phase}
                </div>
              ))}
            </div>

            {/* Timeline bar */}
            <div className="relative h-1.5 rounded-full bg-border mb-3">
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: "14%", background: "var(--red)" }} />
              <div className="absolute top-0 h-full rounded-full" style={{ left: "14%", width: "28%", background: "var(--accent)" }} />
              <div className="absolute top-0 h-full" style={{ left: "42%", width: "29%", background: "var(--purple)" }} />
              <div className="absolute top-0 h-full rounded-r-full" style={{ left: "71%", width: "29%", background: "var(--green)" }} />
            </div>

            {/* Agent chips below timeline */}
            <div className="flex gap-2">
              <div style={{ flex: 1 }}>
                <div className="rounded-lg border p-2" style={{ borderColor: "color-mix(in srgb, var(--red) 30%, var(--border))", background: "color-mix(in srgb, var(--red) 6%, var(--bg-secondary))" }}>
                  <code className="text-[9px] font-bold text-red block mb-0.5">speculation</code>
                  <p className="text-[8px] text-text-muted">{tx("Fast pre-exec in /tmp", "/tmp 中快速预执行", "/tmpで先行実行")}</p>
                </div>
              </div>
              <div style={{ flex: 2 }}>
                <div className="rounded-lg border p-2 text-center h-full flex items-center justify-center" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
                  <span className="text-[9px] text-text-muted">{tx("Model thinking + tool calls", "模型思考 + 工具调用", "モデル思考 + ツール呼出")}</span>
                </div>
              </div>
              <div style={{ flex: 2 }} className="space-y-1">
                {[
                  { name: "extractMemories", color: "var(--purple)" },
                  { name: "promptSuggestion", color: "var(--orange)" },
                ].map(({ name, color }) => (
                  <div key={name} className="rounded-lg border p-2" style={{ borderColor: `color-mix(in srgb, ${color} 30%, var(--border))`, background: `color-mix(in srgb, ${color} 6%, var(--bg-secondary))` }}>
                    <code className="text-[9px] font-bold block" style={{ color }}>{name}</code>
                  </div>
                ))}
              </div>
              <div style={{ flex: 2 }} className="space-y-1">
                {[
                  { name: "sessionMemory", color: "var(--accent)" },
                  { name: "compaction", color: "var(--green)" },
                  { name: "autoDream", color: "var(--pink)", note: tx("24h+5", "24h+5", "24h+5") },
                ].map(({ name, color, note }) => (
                  <div key={name} className="rounded-lg border p-2" style={{ borderColor: `color-mix(in srgb, ${color} 30%, var(--border))`, background: `color-mix(in srgb, ${color} 6%, var(--bg-secondary))` }}>
                    <code className="text-[9px] font-bold block" style={{ color }}>{name}{note ? ` (${note})` : ""}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agent detail cards */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {forkedAgents.map(({ name, desc, icon: Icon, color, phase, phaseColor }) => (
            <div
              key={name}
              className="p-4 rounded-xl border"
              style={{
                background: `color-mix(in srgb, ${color} 5%, var(--bg-tertiary))`,
                borderColor: `color-mix(in srgb, ${color} 18%, var(--border))`,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                  <code className="text-[11px] font-bold text-text-primary">{name}</code>
                </div>
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide shrink-0"
                  style={{ color: phaseColor, background: `color-mix(in srgb, ${phaseColor} 12%, transparent)` }}
                >
                  {phase}
                </span>
              </div>
              <p className="text-[10px] text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Coordinator Mode */}
      <Card
        id="coordinator-mode"
        title={tx("Multi-Agent Coordinator Pattern", "多代理协调器模式", "マルチエージェントコーディネーターパターン")}
        className="mb-6"
        accent="var(--purple)"
        summary={tx("The leader/worker pattern Claude Code encodes into its own system prompt. Synthesis stays with the leader; execution fans out.", "Claude Code 在自己的系统提示中编码的 leader/worker 模式。综合判断留在 leader，执行分发给 workers。", "Claude Codeがシステムプロンプトに組み込むleader/workerパターン。統合判断はleaderに残し、実行をworkersに分散。")}
        links={[
          { label: "coordinator/", href: ghTree("coordinator") },
          { label: "coordinatorMode.ts", href: ghBlob("coordinator/coordinatorMode.ts") },
          { label: "spawnMultiAgent.ts", href: ghBlob("tools/shared/spawnMultiAgent.ts") },
        ]}
      >
        {/* Visual coordinator diagram */}
        <div className="mb-5 rounded-2xl border border-border bg-bg-tertiary/30 p-4 sm:p-5">
          {/* Coordinator node */}
          <div className="flex justify-center mb-4">
            <div
              className="rounded-2xl border-2 px-5 py-3 text-center"
              style={{ borderColor: "var(--purple)", background: "color-mix(in srgb, var(--purple) 10%, var(--bg-secondary))" }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple mb-1">
                {tx("Coordinator", "协调器", "コーディネーター")}
              </div>
              <div className="text-[9px] text-text-muted">{tx("Research → Synthesize → Direct", "调研 → 综合 → 指挥", "調査 → 統合 → 指示")}</div>
            </div>
          </div>

          {/* Down arrow to workers */}
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-px h-6 bg-border" />
              <div className="text-[9px] text-text-muted mb-1">{tx("spawns via AgentTool", "通过 AgentTool 启动", "AgentToolで起動")}</div>
              <div className="flex gap-4">
                <div className="w-px h-4 bg-border" />
                <div className="w-px h-4 bg-border" />
                <div className="w-px h-4 bg-border" />
              </div>
            </div>
          </div>

          {/* Worker nodes */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: tx("Worker A", "Worker A", "Worker A"), task: tx("Explore codebase", "探索代码库", "コードベース探索") },
              { label: tx("Worker B", "Worker B", "Worker B"), task: tx("Write tests", "编写测试", "テスト作成") },
              { label: tx("Worker C", "Worker C", "Worker C"), task: tx("Review changes", "审查变更", "変更レビュー") },
            ].map(({ label, task }) => (
              <div
                key={label}
                className="rounded-xl border p-2.5 text-center"
                style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, var(--border))", background: "color-mix(in srgb, var(--accent) 6%, var(--bg-secondary))" }}
              >
                <div className="text-[10px] font-bold text-accent mb-0.5">{label}</div>
                <div className="text-[9px] text-text-muted">{task}</div>
              </div>
            ))}
          </div>

          {/* Return arrows */}
          <div className="flex justify-center mb-3">
            <div className="flex flex-col items-center">
              <div className="flex gap-4">
                <div className="w-px h-4 bg-border" />
                <div className="w-px h-4 bg-border" />
                <div className="w-px h-4 bg-border" />
              </div>
              <div className="text-[9px] text-text-muted my-1">{tx("returns <task-notification> XML", "返回 <task-notification> XML", "<task-notification> XMLを返却")}</div>
              <div className="w-px h-4 bg-border" />
            </div>
          </div>

          {/* Synthesis node */}
          <div className="flex justify-center">
            <div
              className="rounded-xl border px-4 py-2 text-center"
              style={{ borderColor: "color-mix(in srgb, var(--green) 30%, var(--border))", background: "color-mix(in srgb, var(--green) 8%, var(--bg-secondary))" }}
            >
              <div className="text-[10px] font-bold text-green">{tx("Coordinator synthesizes + directs next task", "协调器综合并指挥下一步", "コーディネーターが統合し次タスクを指示")}</div>
            </div>
          </div>
        </div>

        {/* The golden rule */}
        <div
          className="mb-4 rounded-xl border-l-4 p-4"
          style={{ borderLeftColor: "var(--purple)", background: "color-mix(in srgb, var(--purple) 5%, var(--bg-secondary))" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple mb-2">
            {tx("The Golden Rule", "黄金法则", "黄金ルール")}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed italic">
            {tx(
              "\"The coordinator must read worker findings, understand them itself, and write follow-up prompts with concrete file paths and changes. It cannot hand-wave research away. Synthesis stays with the leader, execution fans out.\"",
              "\"协调器必须阅读 worker 的发现、自己理解，再写出带有具体文件路径和改动说明的后续提示。不能含糊带过调研结果。综合判断留在 leader，执行分发给 workers。\"",
              "\"コーディネーターはworkerの発見を読み、自分で理解し、具体的なファイルパスと変更内容を含むfollowupプロンプトを書かなければならない。調査結果を曖昧に受け流してはならない。統合判断はleaderに残し、実行をworkersに分散する。\""
            )}
          </p>
        </div>

        <CodeBlock
          code={`// coordinator/coordinatorMode.ts — key rules (~370 lines)
getCoordinatorUserContext(...)
  → enumerates worker tool access
  → injects MCP server names
  → may expose scratchpadDir for cross-worker knowledge

getCoordinatorSystemPrompt()
  → workers are async, launch independent work in parallel
  → don't use workers for trivial file/command reporting
  → don't say "based on your findings"
  → always synthesize findings before delegating
  → verification means proving behavior, not just code presence
  → phases: research → synthesis → implementation → verification`}
        />
      </Card>

      {/* Built-in Agent Types */}
      <Card
        id="agent-types"
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
        <div
          className="mt-4 rounded-xl border p-3"
          style={{ borderColor: "color-mix(in srgb, var(--accent) 20%, var(--border))", background: "color-mix(in srgb, var(--accent) 5%, var(--bg-secondary))" }}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
            {tx("Custom Agents", "自定义代理", "カスタムエージェント")}
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            {tx(
              "Drop a .md or .yaml file in .claude/agents/ with frontmatter (name, description, tools, model). The agent becomes available system-wide. Custom agents can restrict tools to a safe subset — e.g., a read-only reviewer.",
              "在 .claude/agents/ 中放置带有 frontmatter（name、description、tools、model）的 .md 或 .yaml 文件，该代理即可全局使用。自定义代理可限制工具为安全子集，如只读审查员。",
              ".claude/agents/ にfrontmatter（name、description、tools、model）付きの.mdまたは.yamlを置くだけでシステム全体で利用可能に。カスタムエージェントは読み取り専用レビュアーのように安全なツールサブセットに制限できます。"
            )}
          </p>
        </div>
      </Card>

      <InsightCallout emoji="💡" title={tx("Prompt caching makes subagents nearly free", "提示缓存让子代理几乎免费", "プロンプトキャッシュでサブエージェントはほぼ無料")} className="mb-6">
        {tx(
          "When you spawn a subagent with the same system prompt as the parent, the API cost for that entire prompt is literally $0 — the bytes match exactly, triggering an automatic prompt cache hit. You're only paying for the unique task description. This is why Claude Code can afford to run 6+ background agents per turn without the cost becoming prohibitive.",
          "当你用与父代理相同的系统提示启动子代理时，整个提示的 API 成本实际上是 $0 —— 字节完全匹配，自动命中提示缓存。你只需为唯一的任务描述付费。这就是 Claude Code 每回合可以运行 6 个以上后台代理而不让成本高企的原因。",
          "親と同じシステムプロンプトでサブエージェントを起動すると、そのプロンプト全体の API コストは文字通り $0 です。バイト列が完全に一致し、自動的にプロンプトキャッシュヒットが発生するため、ユニークなタスク記述分だけの課金になります。これが、Claude Code が1ターンに6つ以上のバックグラウンドエージェントを走らせても費用が天文学的にならない理由です。"
        )}
      </InsightCallout>

      <RelatedPages pages={[
        { href: "/services", title: tx("Services", "服务", "サービス"), color: "var(--green)", desc: tx("The compaction, MCP, memory extraction, and speculation services that power background agents.", "压缩、MCP、记忆提取和推测推理服务，支撑着后台代理的运行。", "バックグラウンドエージェントを支えるコンパクション、MCP、メモリ抽出、推測実行サービス。") },
        { href: "/context", title: tx("Context & Memory", "上下文与记忆", "コンテキストとメモリ"), color: "var(--pink)", desc: tx("How the system prompt is assembled and why its exact byte content matters so much for cache sharing.", "系统提示如何组装，以及为什么其精确字节内容对缓存共享如此重要。", "システムプロンプトの組み立て方と、キャッシュ共有においてバイト列が重要な理由。") },
        { href: "/permissions", title: tx("Permissions", "权限", "権限"), color: "var(--red)", desc: tx("How subagents inherit and are restricted by permission modes from the parent session.", "子代理如何继承父会话的权限模式并受其限制。", "サブエージェントが親セッションから権限モードを継承・制限される仕組み。") },
      ]} />

      <NextPage
        href="/services"
        title={tx("Services", "服务系统", "サービスシステム")}
        description={tx(
          "MCP (470KB!), 4 compaction strategies, LSP integration, analytics pipeline, and the extractMemories background agent.",
          "MCP（470KB！）、4 种压缩策略、LSP 集成、分析管道和 extractMemories 后台代理。",
          "MCP（470KB！）、4つの圧縮戦略、LSP統合、分析パイプライン、extractMemoriesバックグラウンドエージェント。"
        )}
      />
    </div>
  );
}
