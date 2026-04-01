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
import { HiOutlineBolt, HiOutlineGlobeAlt, HiOutlineCpuChip } from "react-icons/hi2";

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
      title: tx("Local (in-process)", "本地（进程内）", "ローカル（同一プロセス）"),
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
      title: tx("Worktree Isolation", "Worktree 隔离", "Worktree 隔離"),
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
      title: tx("Remote (CCR)", "远程（CCR）", "リモート（CCR）"),
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
    { name: "extractMemories", desc: tx("Auto-memory after each query", "每次查询后的自动记忆", "各クエリ後の自動メモリ"), icon: VscSymbolEvent, color: "var(--purple)" },
    { name: "sessionMemory", desc: tx("Periodic conversation notes", "周期性会话笔记", "定期的な会話メモ"), icon: VscServerProcess, color: "var(--accent)" },
    { name: "promptSuggestion", desc: tx("Next prompt suggestions", "下一条提示建议", "次のプロンプト提案"), icon: VscLightbulb, color: "var(--orange)" },
    { name: "compaction", desc: tx("Conversation summary", "对话摘要", "会話要約"), icon: VscGitMerge, color: "var(--green)" },
    { name: "autoDream", desc: tx("Background memory consolidation", "后台记忆整合", "バックグラウンドの記憶統合"), icon: HiOutlineCpuChip, color: "var(--pink)" },
    { name: "speculation", desc: tx("Fast hypothetical execution", "快速假设执行", "高速な仮想実行"), icon: HiOutlineBolt, color: "var(--red)" },
  ];
  return (
    <div className="page-shell">
      <PageHeader
        title={tx("Agents & Subagents", "代理与子代理", "エージェントとサブエージェント")}
        description={tx(
          "Claude Code can spawn isolated sub-agents with separate token budgets, custom prompts, and optional isolation (worktree or remote). The Agent system enables multi-agent coordination and parallel work.",
          "Claude Code 可以生成隔离的子代理，拥有独立的 token 预算、自定义提示和可选隔离（工作树或远程）。代理系统支持多代理协调和并行工作。",
          "Claude Code は、独立したトークン予算、カスタムプロンプト、任意の隔離（worktree または remote）を持つサブエージェントを起動できます。エージェント機構は並列作業とマルチエージェント協調を支えます。"
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

      {/* Execution Modes */}
      <Card
        id="execution-modes"
        title={tx("Execution Modes", "执行模式", "実行モード")}
        className="mb-6"
        summary={tx("Use this section to compare local, worktree, and remote execution tradeoffs.", "如果你想比较本地、worktree 与远程执行的取舍，读这一节。", "ローカル、worktree、remote の比較です。")}
        links={[
          { label: "runAgent.ts", href: ghBlob("tools/AgentTool/runAgent.ts") },
          { label: "EnterWorktreeTool.ts", href: ghBlob("tools/EnterWorktreeTool/EnterWorktreeTool.ts") },
          { label: "ExitWorktreeTool.ts", href: ghBlob("tools/ExitWorktreeTool/ExitWorktreeTool.ts") },
          { label: "remote/", href: ghTree("remote") },
        ]}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {executionModes.map(({ icon: Icon, color, title, items }) => (
            <div key={title} className="p-4 rounded-xl bg-bg-tertiary/20 border border-border/50">
              <Icon className="w-5 h-5 mb-2" style={{ color }} />
              <h4 className="text-xs font-semibold text-text-primary mb-2">{title}</h4>
              <ul className="text-[11px] text-text-muted space-y-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-1.5">
                    <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
        <p className="text-sm text-text-secondary mb-4">
          {tx(
            "The most important performance optimization. When spawning subagents, ",
            "这是最关键的性能优化。生成子代理时，",
            "最重要な性能最適化です。サブエージェント起動時に "
          )}<code className="text-accent">CacheSafeParams</code>{tx(
            " are frozen at fork time. If the system prompt bytes are identical, the API returns a prompt cache hit — making forked queries essentially free.",
            " 会在 fork 时被冻结。如果系统提示的字节完全相同，API 会直接命中 prompt cache，使 fork 查询几乎零成本。",
            " は fork 時点で凍結されます。システムプロンプトのバイト列が同一なら API は prompt cache hit を返し、fork クエリはほぼ無料になります。"
          )}
        </p>
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
            "真实提示里最重要的细节是：协调器不能把研究结果含糊带过。系统提示明确要求它必须先阅读 worker 的发现、自己理解，再写出带有具体文件路径和改动说明的后续提示。换句话说，Claude Code 把一种“管理风格”编码进了系统：综合判断留在 leader，执行则分发给 workers。",
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

      {/* Forked Agents */}
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
            "Lightweight background queries that share the parent&apos;s cache. Used for tasks you never see:",
            "共享父级缓存的轻量后台查询，用于那些你通常看不到的任务：",
            "親キャッシュを共有する軽量バックグラウンドクエリです。普段は見えない次の処理に使われます："
          )}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {forkedAgents.map(({ name, desc, icon: Icon, color }) => (
            <div key={name} className="p-3 rounded-xl bg-bg-tertiary/20 border border-border/50">
              <Icon className="w-3.5 h-3.5 mb-1.5" style={{ color }} />
              <code className="text-[10px] text-accent block mb-0.5">{name}</code>
              <span className="text-[10px] text-text-muted">{desc}</span>
            </div>
          ))}
        </div>
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
              "“当 worker 回报研究结论时，",
              "「ワーカーが調査結果を返したら、"
            )}<strong className="text-text-primary">{tx(
              "you must understand them before directing follow-up work",
              "你必须先理解它们，再去安排后续工作",
              "追加作業を指示する前に必ず内容を理解しなければならない"
            )}</strong>{tx(
              ". Read the findings. Identify the approach. Then write a prompt that proves you understood by including specific file paths, line numbers, and exactly what to change.\"",
              "。先读结论，确认方案，再写出能证明你确实理解的提示，其中要包含具体文件路径、行号以及明确的改动内容。”",
              "。結果を読み、方針を特定し、その理解を示すために具体的なファイルパス、行番号、変更内容を含むプロンプトを書け。」"
            )}
          </p>
          <p className="text-[10px] text-text-muted mt-2">{tx("— coordinator system prompt, line ~180", "— 协调器系统提示，约第 180 行", "— コーディネーターシステムプロンプト、約180行目")}</p>
        </div>
        <p className="text-[11px] text-text-muted mt-3 italic">
          {tx(
            "The coordinator can&apos;t just throw tasks at workers blindly — the system prompt explicitly requires it to prove comprehension before delegating. Even AI managers have to actually read the reports.",
            "协调器不能盲目把任务甩给 workers。系统提示明确要求它在委派前证明自己已经理解，连 AI 管理者也得认真读报告。",
            "コーディネーターは盲目的にタスクを投げられません。委任前に理解を証明することが明示的に求められており、AIマネージャーですら報告を読む必要があります。"
          )}
        </p>
      </Card>
    </div>
  );
}
